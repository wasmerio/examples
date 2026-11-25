---
sections:
  - "6.1 Data Abstraction"
  - "6.2 Data/Object Anti-Symmetry"
  - "6.3 The Law of Demeter"
---

## Data Abstraction

Hiding implementation is not just about putting a layer of functions between variables and the outside world. It's about **exposing abstract interfaces** that let users manipulate the essence of data without knowing its implementation. A `Point` class with `getX()`/`getY()` is no more abstract than public fields — a truly abstract interface might expose polar coordinates while storing Cartesian, or vice versa.

## Data/Object Anti-Symmetry

Objects and data structures are fundamentally opposite:

- **Objects** hide data behind abstractions and expose functions that operate on that data.
- **Data structures** expose data and have no meaningful functions.

This creates a symmetry: **procedural code** (using data structures) makes it easy to add new functions without changing existing structures. **OO code** makes it easy to add new types without changing existing functions. The flip side is also true — adding a new function to OO code means changing every class, and adding a new type to procedural code means changing every function. Neither paradigm is universally better; choose based on whether you expect new types or new functions to be added.

## The Law of Demeter

A method `f` of class `C` should only call methods on: `C` itself, objects created by `f`, objects passed as arguments to `f`, or objects held in instance variables of `C`. The key violation is **train wrecks** — chains like `ctxt.getOptions().getScratchDir().getAbsolutePath()`. Each dot reaches deeper into objects you shouldn't know about. The fix depends on context: if the intermediaries are data structures (no behavior), chaining is fine. If they're objects, you're violating encapsulation — ask the object to do the work instead of extracting its internals.
