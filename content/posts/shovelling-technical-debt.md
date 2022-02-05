---
title: "Technical Debt or Why I Hate Shovelling Snow"
date: 2022-01-15T16:52:41-07:00
---

I really hate shovelling snow. But regardless, I still have to do it. And often I have to, do it in frostbite-inducing weather, shovel a ridiculously long corner sidewalk, and do it multiple times a week. As such, every year, and without fail, there will be a series of snowy days where I simply do not shovel out of exhaustion, being too busy, or mostly abject laziness. My mind always defaults to the same justifications that I know to be silly, like why shovel now if it's gonna snow tomorrow anyways? Why shovel for both today and tomorrow, instead of shovelling it all at once the day after?

I'm sure anyone who had had to deal with copious amounts of snow is fighting the intense urge to facepalm. Most likely, because they too have fallen for that trap of their own design before.

You see, the thing with not shovelling consecutive days of snow is that the interest on your snow debt is horribly efficient at compounding. If you let the snow be, the bottom layer will very quickly begin to harden into an icy rock that really wants to grow up and become a glacier. As such I always end up paying the price of my laziness in double, often having to shovel for 40 mins to an hour (never live in a corner lot, trust me). And recently, after one of those arduous hours where I had to hurl ossified snow off an awfully dull shovel that I probably should've changed by now, it dawned on me how apt of an analogy snow shovelling is for technical debt. 

With disregarded & unshovelled snow, just as with accidentally accrued technical debt, the one who always ends up paying the price is yourself - or at least it would be if a career in this industry did not hinge on job-hopping, resulting in `git blame` being borderline useless - and your team as a whole. When you want to go outside (read: fix bugs, and add features) it becomes a balancing game and a struggle with inches of snow. And when you finally buckle up to shovel properly (read: refactor) it ends up taking X times (where X is a function of time left untouched) the original effort if you had just done it from the get-go. The bottom layer of the snow, now turned rock-like ice, becomes increasingly difficult to remove. Just as those short-sighted architectural design decisions that become unmovable glacials your critical systems have now been built on. Systems that have long ago turned into a [big ball of mud](http://www.laputan.org/pub/foote/mud.pdf), and are now too large, too complicated, and too obtuse to refactor in a reasonable time without breaking everything else that is dependent on it.

> "Systems that are permitted to evolve gracefully in a series of small, controlled stages can stay the seismic upheaval that can result from deferring change."
>
> -- Foote & Yoder - [Evolution, Architecture, and Metamorphosis](http://www.laputan.org/pub/foote/plop95.pdf) 

Just like how with snow, simply shovelling even a few layers of today's snow will pay off big time when you have to shovel even more snow tomorrow, incremental refactoring will pay off by delaying or all on ending the need for the complete upheaval of your codebase. So, next time you notice that one function is getting a bit too long & obtuse in what it does and is also somehow being called by everything else, try to take the time to shovel a few layers of it here and there, or it too will become as solid as granite and will require a much sharper shovel.


*yeah, I really should've shovelled yesterday, and I definitely should've refactored that function that is few hundred lines too long and resulted in 2 hours of debugging.*
