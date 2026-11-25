---
sections:
  - "1.1 What Is a Design Pattern"
  - "1.2 Design Patterns in Smalltalk MVC"
  - "1.3 Describing Design Patterns"
  - "1.4 The Catalog of Design Patterns"
---

## What Is a Design Pattern

A design pattern names, abstracts, and identifies the key aspects of a common design structure. Each pattern describes **a problem which occurs over and over again** in our environment, and then describes the core of the solution to that problem.

A pattern has four essential elements:

1. **Pattern name** — a handle we can use to describe a design problem
2. **Problem** — describes when to apply the pattern
3. **Solution** — describes the elements that make up the design
4. **Consequences** — the results and trade-offs of applying the pattern

## Design Patterns in Smalltalk MVC

The Model/View/Controller triad of classes is used to build user interfaces in Smalltalk-80. MVC consists of three kinds of objects: the **Model** is the application object, the **View** is its screen presentation, and the **Controller** defines the way the user interface reacts to user input.

MVC decouples views and models by establishing a **subscribe/notify** protocol between them — a pattern known as Observer.
