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
This will be more of a high-level techinical overview of key-value database design. 
For more low-lower insight, checkout my Github repo: <https://github.com/amohamed11/kagi>

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
Given my familiarity with B+Tree, it was an obvious choice so I can focus on on-disk aspect.

## Hear me out, B+Tree ... but on-disk.🤯

Since our B+Tree will be on disk, we have to deal with 2 integral changes to the traditional in-memory representation. The first is offsets instead of pointers, and the second is working with bytes instead of abstractions.  Unix has a block size of `4096 bytes`, as such we structure our B+Tree around that block size. To start off I settled on an `Order=20` and a `Degree=10` for the B+Tree, and from there look into how to fit 20 key-value pairs in a 4KB node. After deciding on what the headers would be (2 flags, 3 counts, 3 offsets) we have about 192 bytes for key & value. Here is the final set of constants utilized in Kagi to make sure we are maximizing what we can get out of those 4KBs.

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

![Representation of a Node](/img/node.png "Representation of a Node (slightly different than the final code)")

As in all B+Trees, we will have two types of nodes:  

* Branching Node: a bucket of keys to direct us in the tree   
* Leaf Node: holds a bucket of key-value pairs  

Both nodes also have headers to tell us about the state (free space, key count, etc.) and contents of the node. 

*Add image of how a node looks like using bytes*
*Add code block of Node struct* 

### Writing a Node to Disk

*Start with tests for writing*\
*Discuss on a high level B+Tree updates*
*Reference B+Tree visualizer*

### Retrieving a Node from Disk by Key