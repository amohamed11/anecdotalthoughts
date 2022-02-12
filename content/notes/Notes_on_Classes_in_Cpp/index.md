---
title: "Notes on Classes in C++"
toc: true
---

## Classes in C++

### **Access Restrictions:**

- public:
    - the data/method is accessible to all methods and theowner of the class variable

- private:
    - data/method is only accessible to methods but not tothe object owner
- protected:
    - similar to private, used with class inheritance. Methodof derived class have access, but the object owner doesnot. (We will discuss this in more detail later)

<aside>
➡️ **The default access type is private**

</aside>

Example:

```cpp
class A
{
public:
	// Public data/methods
	int x;
	void foo() { x++; y--; }

private:
	// Private data/methods
	int y;
	void bar() { x--; y++; }
};
```

---

### Constructors:

- Class variables can be automatically initialized by con-structors
- No uninitialized struct variables anymore! Thisis a major improvement over C
- If not defined, the compiler creates the DEFAULT con-structor for you. It does not initialize POD members, but calls sub-object constructors recursively

Example:

```cpp
class Foo
{
public:
	Foo() { x = 0; }          // constructor 1
	Foo(int x_) { x = x_; }   // constructor 2

private:
	int x;
};
```

---

### Destructors:

- A destructor is called whenever a class variable leaves the scope or is deleted. Automatic cleanup!
- If we don’t define a destructor, the compiler creates a **default destructor** for us, **which only calls the destruc-tors of all non-POD members**
- The **destructor must be defined whenever the class ob-ject allocates resources** (memory, files, locks ...) that need to be freed when the object is no longer needed

Example:

```cpp
class Foo
{ 
public:
// automatically allocate array when a
// Foo is created
Foo()  { p = new int[100]; }

// destructor: clean up when done
// name:  ~Classname
~Foo() { delete [] p; }

private:
	int *p;
};
```

---

### Copy Constructors (CC):

- It would be a waste of time if we first call the con-structor and then overwrite the result with the stateof another object
- Also, simply copying data members bitwise may notwork. For instance, if we just copied pointers, bothpointers in a and b would point to the same object, i.e. they share a resource. Often this is not accept-able.

Example:

```cpp
class Foo
{
public:
	Foo() { x = y = 0; }

	// this is what the default CC does:
	// data members are copied one by one
	// from the rhs object to the lhs object
	// NB.: if class contains class variables
	// their copy constructors are called
	// recursively
	Foo(const Foo &rhs)
	{
		x = rhs.x;
		y = rhs.y;
	}
private:
	int x, y;
};

Foo a;
Foo b = a; // rhs=a; effect: b.x = a.x, b.y = a.y
```

<aside>
➡️ **What about pointers?**

</aside>

- Watch out! Pointers are POD types, which are copied bitwise
- After copying, **pointee object is shared** by the lhs and rhs objects!
- Who then is responsible for deleting the shared ob-ject?
- If sharing resources when copy constructing your ob-jects isn’t what you want, then you need to defineyour own copy constructo

---

### Assignment Operators:

**How to define the AO for class Foo?**

*a = b;*

/

is transcribed by the compiler into

*a.operator=(b)*

object to act on: left-hand-side (lhs) a, right-hand-side (rhs) b passed to method operato.

So, the AO can be considered a method!

Example:

```cpp
class Foo
{
	int u;
	Foo() { u = 0; }
	// assignment operator, pass on a reference to the object
	Foo &operator= (const Foo &rhs)
	{
		u = rhs.u;    // for POD members, just copy bitwise
		return *this; // returns a reference to the lhs object
									// itself. "this" points to the object
									// itself and it is implicitely known in
									// all methods
	}
};
```

**Note:** this is a pointer to the object and *this refers to the object itself. So, method

```cpp
Foo f() { return *this; }
```

returns a **copy of the object**. But 

```cpp
Foo &f() { return *this; }
```

just returns a **reference the object itself (much faster)**

The default AO, which is created if you don’t provide one, does member-by-member copy 

- Bitwise copy for POD members and calling the assignment operators for all other data members
- This may not be what you want if the class has pointer members! (see sharing issues discussed inthe CC section)
- You can provide your own AO for each class if the default AO is insufficient

```cpp
Foo a(10);
a = a
```

In above implementation first releases memory associated with a, and then uses it.

Ouch!  It may have changed in the interim. So, we need to **guard against self assignment!**

Example:

```cpp
class X
{
public:

	// general assignment operator code template
	X &operator= (const X &rhs)
	{
		if (this == &rhs) {  // self-assignment,
			return *this;      // nothing to do!
		}                    // release current resources and copy rhs
	...
	return *this;
	}
};
```

<aside>
➡️ **Difference between Copy and Assignment:**

</aside>

**Copy:**

The space we copy to does not contain anything,so we can just overwrite it 

```cpp
X a = b; // defining a, just copy b over
```

**Assignment:**

the space we copy to is occupied. We mayhave to release resources before copying

```cpp
a = b; 
// if a contains a resource its assignment
// operator must first release it before copying members
```

---

### Shallow vs. Deep Copy:

- In the presence of pointer data members we have to decide how to copy objects
- If we allow to share resources, the default CC and AO will work fine — as they copy bits in case of POD members **(shallow copy)** and call the CC/AO for non-POD types recursively
- Otherwise we need to copy the data the pointer points to recursively **(deep copy)**
    - In this case, we need to implement both CC and AO,and most likely the destructor as well
- Make sure that there are no resource leaks and no self-assignments!

**Rule of 3:**

if you decide you need to define your own destructor, CC, or AO, you most likely also have to define the other two

<aside>
➡️ The  presence  of  a  pointer  almost  always  calls  for  im-plementing the destructor, CC, and AO

</aside>
