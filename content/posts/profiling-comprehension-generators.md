---
title: "Profiling List Comprehension & Generators in Python"
date: 2022-02-11
toc: true
---

> "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%."
>
> -- Donald Knuth 

If you already have an existing service, for the most part, Python's benefits (easy to write & read, library ecosystem, etc.) out-weigh the benefits of optimizing for that 97% by switching to a compiled language. And really, for most services, Python is rarely the biggest bottleneck. I mean, most APIs needn't be scalable to gazilion requests/sec.  

Regardless though, if your hot-paths include some sort of iteration over huge data, then Python's shortcomings in speed, and its memory hungriness are hideously bare to witness. For many of these cases though, there a two simple best practices that can help alleviate those ills tremendously. Those are defaulting to list comprehension instead of loop + append combo, and returning generators instead of returning lists.  

Both of these tools can yield a surprising amount of benefits for little to no extra effort. When I first read of these benefits in [Effective Python](https://effectivepython.com/), I thought this would be a nice chance to try out profiling Python code. For this, I used Python's built-in [cProfile](https://docs.python.org/3/library/profile.html#module-cProfile) for execution time and a neat library called [memory-profiler](https://pypi.org/project/memory-profiler/) for memory usage.  
Check out this [gist](https://gist.github.com/amohamed11/8bc40153d964c0a7cd8bf13f5f7dae9d) for the entire Python script I used.

## Comprehend This Speedup

Let's take the following example of a generic loop
```python
def exhibitA(n):
    a = []
    for i in range(2**n):
        if i%2 == 0:
            a.append(i)
```
This code simply iterates over a range and creates a list containing only even numbers. Now lets run it and profile it.

```text
         524292 function calls in 0.122 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.004    0.004    0.122    0.122 <string>:1(<module>)
        1    0.096    0.096    0.118    0.118 comprehension_and_generators.py:5(exhibitA)
        1    0.000    0.000    0.122    0.122 {built-in method builtins.exec}
   524288    0.022    0.000    0.022    0.000 {method 'append' of 'list' objects}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}


Exhibit A: max=39.58 MiB, min=24.3 MiB, diff=15.27 MiB
```

It takes approximately **0.122s** to run and uses about about 15.27 MiB (wow, python is one chonky boi) when you basically remove miscellenous import modules.
Alright that's not too good, let's what we can do about that.

Here is the code re-written to use list comprehension
```python
def exhibitA_comprehension(n):
    a = [i for i in range(2**n) if i%2 == 0]
```

Succinct and to the point.  
And here is the profile

```text
         5 function calls in 0.051 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.003    0.003    0.051    0.051 <string>:1(<module>)
        1    0.000    0.000    0.048    0.048 comprehension_and_generators.py:11(exhibitA_comprehension)
        1    0.048    0.048    0.048    0.048 comprehension_and_generators.py:12(<listcomp>)
        1    0.000    0.000    0.051    0.051 {built-in method builtins.exec}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}

Exhibit A with list comprehension: max=37.75 MiB, min=24.31 MiB, diff=13.43 MiB
```

Now we're cooking with gas. Our execution time is down to **0.051s** from 0.122s, a huge speedup factor of ~2.4x. Function calls are also reduced, by 5 orders of magnitude nevertheless. A nice bonus for debuggability.  
Since we are still creating the same list, our memory usage is essentially the same, at about 13.43 MiB for our function.

So, next time you catch yourself writing the same old for loop + append combo, see if it can be written using list comprehension instead. In most cases it can be, and personally I would argue it is also more readable as well, but that's entirely subjective and is neither here nor there.

## Yield or Else

Generators are a bit less clear cut in their use cases. Where they really shine is where memory is a bigger constraint than speed. For example when you are ingesting a whole lot of data which needs to be processed in some form. In these scenarios using a generator will avail your program from holding all that data in a in-memory list while they are waiting to be processed.

Here is the same loop from the initial example, but in this case we need to carry out another filtering process after our list is created
```python
def exhibitB(n):
    a = []
    for i in range(2**n):
        if i%2 == 0:
            a.append(i)

    div_by_8_and_2 = len([x for x in a if x%8 == 0])
```

and here are our results
```text
         524294 function calls in 0.140 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.005    0.005    0.140    0.140 <string>:1(<module>)
        1    0.098    0.098    0.135    0.135 comprehension_and_generators.py:14(exhibitB)
        1    0.017    0.017    0.017    0.017 comprehension_and_generators.py:20(<listcomp>)
        1    0.000    0.000    0.140    0.140 {built-in method builtins.exec}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.len}
   524288    0.021    0.000    0.021    0.000 {method 'append' of 'list' objects}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}

Exhibit B: max=40.91 MiB, min=24.91 MiB, diff=16.0 MiB
```

Oh lord, that's almost 16 MiB just to store 131,072 ints. Shouldn't that be like 1MiB or so? What's up here?  
*\*few tabs & getsizeof calls later\**  
Huh, why are ints in Python 28 bytes minimum? that seems a bit excessive.  
*\*even more tabs later\**  
WAIT, WHAT DO YOU MEAN EVERY INT IS AN ENTIRE OBJECT IN PYTHON? WHAT? WHY DO YOU NEED A REF COUNT FOR AN INT???

Phew! alright, that seems like entire rabbit hole that I do not want to jump into right now. 
I mean, I'm sure there is good reasoning for this (better handling of large numbers maybe??), but that's an investigation for another day.

Coming back to generators, let's see how much of that memory we can get back.  
Here is the generator version
```python
def _generator(n):
    for i in range(2**n):
        if i%2 == 0:
            yield i

def exhibitB_generator(n):
    it = _generator(n)

    div_by_8_and_2 = len([x for x in it if x%8 == 0])
```

and our results
```text
         524295 function calls in 0.124 seconds

   Ordered by: standard name

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.000    0.000    0.124    0.124 <string>:1(<module>)
   524289    0.072    0.000    0.072    0.000 comprehension_and_generators.py:22(_generator)
        1    0.001    0.001    0.124    0.124 comprehension_and_generators.py:27(exhibitB_generator)
        1    0.051    0.051    0.123    0.123 comprehension_and_generators.py:30(<listcomp>)
        1    0.000    0.000    0.124    0.124 {built-in method builtins.exec}
        1    0.000    0.000    0.000    0.000 {built-in method builtins.len}
        1    0.000    0.000    0.000    0.000 {method 'disable' of '_lsprof.Profiler' objects}

Exhibit B with generator: max=28.61 MiB, min=24.97 MiB, diff=3.64 MiB
```

From 16 MiB down to **3.64 MiB**, that's an astounding reduction of -440% in memory usage for arguably no extra code.  
You might notice there is also a very slight speedup, from 0.140 to 0.124, but that is actually an artifact of this specific example. Depending on your case you could very easily end up with a noticeable slow down when using generators. Also techincally there is 1 more function call but that just the iterator asking if there is anything left and returning a no.

Like I mentioned earlier, generators are much more case specific than list comprehension. If you know that your list might get large, or if you can start processing that list one by one, it is a huge boon to your memory usage. But if that's not the case, and you need the entire list first before processing it, or your case is more constrained by speed rather than memory, then generators are not the right tool.  

Really that's just a bunch of words for "it depends". But as is often the case, that's the answer for most programming questions.  
Regardless, it's important to know the benefits & drawbacks for each tool you use. That's what will help you optimize for that critical 3%. 


## Conclusions

- List comprehension is signficantly faster than loop + append combo.
- Returning generators is substantially more memory efficient than return entire lists.
- Read [Effective Python](https://effectivepython.com/), it's pretty good.

That was fun. And I learned a lot about Python after delving a bit into some of the opcode in some tangents. 
Something I kinda wanna look into a bit more is how `<listcomp>` is so much more efficient than an append loop. It seems that's thanks to its usage of the `LIST_APPEND` opcode instead of loading the append method, so that would be a good place to start. But that's for some other time, that's enough Python existentialism for one day.
