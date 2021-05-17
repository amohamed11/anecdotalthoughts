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

## How are Databases built? And Why a KV database?

Ironically, for this I ended up pulling out my lecture notes from said Databases II class. Despite the dreadful assignments and exams, this course did touch on some essential parts of database design. I won't bore you with the lethargic details, so here an overly short summary:

1. Accessing the data (on-disk vs in-memory, ordered vs unordered, etc.)
2. Executing queries (SQL compiler, query optimizer, etc.) 
3. Managing transactions (ACID, scheduling, batch transactions etc.).
4. Maintaining the database (index updates, tombstone cleanup, etc.)

As you can already probably tell, database can get pretty complicated. But thankfully, for a simple key-value database, we only need to concern ourselves with the first & the last part to end up with a functional key-value store.  
Given my familiarity with B+Tree, it was an obvious choice so I can focus on on-disk aspect.

## B+Tree, but on-disk 🤯

First things first, let's breakdown this process to smaller tasks. What we need our database to do is:
* Write key-value pair to a file
* Retrieve a desired value by key
* Delete a desired key-value pair

### Constructing our Node

*Mention offests to keep track of nodes on-disk*
*Add image of how a node looks like using bytes*
*Add code block of Node struct*

### Writing a Node to Disk

*Start with tests for writing*  
*Discuss on a high level B+Tree updates*
*Reference B+Tree visualizer*

### Retrieving a Node from Disk by Key