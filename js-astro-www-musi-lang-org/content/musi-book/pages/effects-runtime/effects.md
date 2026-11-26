---
title: "Effects"
description: "Name outside work."
group: "Effects and runtime"
section: "Effects and runtime"
order: 1
slug: "effects"
summary: "An effect names an operation that asks for an answer from outside normal value flow."
examples: "chapter-effects"
---

# Effects

An effect names work that asks the outside world, runtime, or host for an answer.

{{snippet:chapter-effects}}

## Define an effect

```musi
let Clock := effect {
  let tick () : Int;
};
```

The effect says what can be asked. It does not decide who answers.

## Ask for an effect

```musi
ask Clock.tick();
```

`ask` marks the boundary clearly. A reader can see that the expression needs an effect provider.

## Keep pure code separate

Pure functions should take values and return values. Effectful code should live near the boundary where answers are provided.

## Effect operation shape

An operation inside an effect looks like a function signature.

```musi
let Clock := effect {
  let tick () : Int;
};
```

`tick` takes no arguments and returns an `Int`. The effect declaration does not say where the value comes from.

## Ask site

```musi
ask Clock.tick();
```

The ask site is where the program requests that value.
