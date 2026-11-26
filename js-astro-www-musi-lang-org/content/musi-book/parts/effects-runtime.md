---
title: "Effects and runtime"
description: "Use effects, handlers, runtime modules, and foundation modules."
group: "Effects and runtime"
section: "Effects and runtime"
order: 7
slug: "effects-runtime"
summary: "Make outside work visible at the call site."
---

# Effects and runtime

Some work reaches outside a pure value. A program may ask the clock, read config, print text, or call a host function. Musi keeps this kind of work visible.

An `effect` names work that needs an answer from outside the current expression. `ask` performs that work. `answer`, `handle`, and `resume` describe what happens next.

This part teaches effects, requirements, handlers, runtime modules, and library modules. The page examples show where outside work enters the code.

Use this part when your program must talk to the world.
