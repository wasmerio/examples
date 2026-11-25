---
sections:
  - "3.1 Intent"
  - "3.2 Motivation"
  - "3.3 Structure"
  - "3.4 Consequences"
---

## Intent

Provide an interface for creating families of related or dependent objects without specifying their concrete classes. Also known as **Kit**.

## Motivation

The maze game example: a `MazeFactory` declares creation methods — `MakeMaze()`, `MakeRoom()`, `MakeDoor()`. Subclasses like `EnchantedMazeFactory` override these to produce enchanted rooms and doors. Client code builds mazes without knowing which concrete products it creates.

## Structure

`AbstractFactory` declares the creation interface. `ConcreteFactory` implements it for a specific product family. `AbstractProduct` and `ConcreteProduct` define the objects being created. The client only depends on the abstract interfaces.

## Consequences

**Pros:**
- Isolates concrete classes — client manipulates instances through abstract interfaces only
- Easy to exchange product families — swap the factory, swap the entire suite of products
- Enforces consistency among products — a factory guarantees that its products work together

**Cons:**
- Supporting new product types is hard — adding a new abstract method to `AbstractFactory` forces changes in every concrete factory subclass

In practice, Abstract Factory shines when you need to support multiple platforms or themes. React's context-based theming follows a similar idea — provide a family of styled components without the consumer knowing the specifics.
