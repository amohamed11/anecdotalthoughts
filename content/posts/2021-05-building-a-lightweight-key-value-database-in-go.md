---
title: Building a Lightweight Key-Value Database in Go
description: On-disk B+trees & other midly extreme sports.
date: 2021-05-17T01:14:50.167Z
tags:
  - side-project
  - database-design
  - go
ShowToc: true
---
This will be more of a high-level technical overview of key-value database design. 
For more lower-level insight into the nitty & gritty, checkout my Github repo: <https://github.com/amohamed11/kagi>

## Why build a database?

About a year and a half ago, I decided to take Databases II. And as soon as the first assignment, a run-of-the-mill embedded SQL assignment, was released, I remember thinking "why can't we just create a database instead". So this past holiday, I thought I'd finally sit down and do just that.

## Database design, and why a KV database?

![Representation of a Key-Value database](/img/kv.png "Representation of a Key-Value database")

For this, ironically, I ended up pulling out my lecture notes from said Databases II class. Despite the dreadful assignments, this course did touch on some essential parts of database design. I won't bore you with the lethargic details, so here is the bullet-point summary:

1. Accessing the data (on-disk vs in-memory, ordered vs unordered, etc.)
2. Executing queries (SQL compiler, query optimizer, etc.) 
3. Managing transactions (ACID, scheduling, batching, etc.)
4. Maintaining the database (index updates, tombstone cleanup, etc.)

As you can already probably tell, database can get pretty complicated. But thankfully for a simple key-value database, we can focus on the first & the last parts to create a functional key-value store.\
Given my familiarity with B+Tree, it was an obvious choice to allow me to focus on the on-disk aspect. 

## Our Database connection

First off, we need to create a struct that contains all the necessary elements for a Kagi DB connection. First thing is the DB file itself. Since we are using a tree, we only need to track the root node for it. Other than that we have a single mutex for the DB and 2 loggers, one for general info, the other for fatal errors. With that we have this representation for a DB connection

```go
type DB_CONNECTION struct {
	sync.Mutex
	file        *os.File
	filePath    string
	root        *Node
	count       uint32
	infoLogger  *log.Logger
	errorLogger *log.Logger
}
```

## Hear me out, B+Tree ... but on-disk.🤯

Since our B+Tree will be on disk, we have to deal with 2 integral changes to the traditional in-memory representation. The first is offsets instead of pointers, and the second is working with bytes instead of abstractions.  Unix has a block size of `4096 bytes`, as such we structure our B+Tree around that block size. To start off I settled on an `Order=20` and a `Degree=10` for the B+Tree, and from there look into how to fit 20 key-value pairs in a 4KB node. 

Here is an early sketch of Node as I was considering what headers are necessary, and how many bytes each part required. All elements of the header use either `uint16` or `uint32` as there is no need for negatives for boolean flags or for counts.

![Representation of a Node](/img/node.png "Representation of a Node (slightly different than the final code)")

After deciding on the headers, I decided that about 192 bytes for key (48 bytes) & value (144 bytes) sounds about right. With that here is the set of constraints utilized in Kagi to make sure we are maximizing what we can get out of the 4KB blocks.

```go
const (
	Order        int32 = 20   // the upper limit for number of keys/values that node can hold
	Degree       int32 = 10   // the lower limit for number of keys/values that node must hold
	BlockSize    int32 = 4096 // max size of a node
	Int32Size    int32 = 4    // size of uint32 used for offsets in node
	Int16Size    int32 = 2    // size of uint16 used for flags and counts in nodes
	MaxKeySize   int32 = 48
	MaxValueSize int32 = 144
)
```

### Constructing our Node

With our byte constraints set, we can setup our Node structure. One of the more confusing aspects of this project was in fact managing all the offsets necessary. In the end, it took some trial & error to figure out which offsets were necessary, and which were just waste of space.

As in all B+Trees, we will have two types of nodes:  

* Branching Node: holds a bucket of keys to direct us in the tree   
* Leaf Node: holds a bucket of key-value pairs  

Both type of nodes have the same headers for simplicity. These headers are used to tell us about the state (leaf count, deleted marker, etc.). If a node ever has more than 0 leaf nodes then we know that we it is a leaf node, otherwise it's a branching node.

```go
type Node struct {
	//----Header----
	// Flags
	isRoot    uint16
	isDeleted uint16

	// Counts
	dbCount   uint32
	numKeys   uint16
	numLeaves uint16

	// Offsets
	offset       uint32
	parentOffset uint32
	childOffsets []uint32
	// -------------

	// branching node
	keys [][]byte

	// leaf nodes
	leaves []*Leaf
}

type Leaf struct {
	// data
	key   []byte
	value []byte
}
```

### Reading/Writing an on-disk Node 

With the Node struct set, we can start on B+Tree operations. The first is writing a node to the DB file in the correct offset. But first, tests. Below is a simple test for setting/getting 100 key-value pairs. The test generates random values to use for key & value, each 5 bytes. 

```go
func TestSet100Keys(t *testing.T) {
	db := Open(testClearOptions)
	rand.Seed(time.Now().UnixNano())
	seq := randSeq(1000)

	for i := 0; i < 1000; i += 10 {
		k := seq[i : i+5]
		v := seq[i+5 : i+10]

		err := db.Set(k, v)
		db.logError(err)
	}
	db.Close()
}

func TestGet100Keys(t *testing.T) {
    ...
	// Same as test for Set
    ...

	for i := 0; i < 1000; i += 10 {
		k := seq[i : i+5]
		v := seq[i+5 : i+10]

		found, err2 := db.Get(k)
		if found != v {
			t.Error(err2)
			t.Errorf(`test %d, actual: "%s", expected: "%s"`, i/10, found, v)
		}
	}
	db.Close()
}
```

Next, I worked on the tree traversal. Traversing the tree is pretty straightforward. Starting from the root node (which the DB always knows), you recursively traverse using child offsets depending using the given key to direct our direction.   

*Discuss on a high level B+Tree updates including splitting*