---
sections:
  - "5.1 Intent"
  - "5.2 Motivation"
  - "5.3 Structure"
  - "5.4 Consequences"
---

## Intent

Ensure a class has only one instance, and provide a global point of access to it.

## Motivation

Some classes should have exactly one instance — a filesystem, a window manager, a print spooler. A global variable makes the object accessible but doesn't prevent multiple instantiation. Singleton lets the class itself control access: private constructor, static `Instance()` method.

## Structure

The `Singleton` class defines a static `Instance()` operation that returns the unique instance. The constructor is protected or private. Clients access the singleton exclusively through `Instance()`.

## Consequences

- **Controlled access to sole instance** — the class encapsulates its single instance, giving it strict control over how and when clients access it
- **Reduced name space** — avoids polluting the global namespace with standalone variables
- **Permits refinement of operations and representation** — you can subclass `Singleton` and configure the application with an instance of the subclass
- **Registry of singletons** — instead of hardcoding the subclass in `Instance()`, register singleton classes by name and look them up at runtime

## Thread-Safety Considerations

The classic lazy-initialization idiom (`if instance == null`) is not thread-safe. Solutions include eager initialization, double-checked locking, or language-level guarantees (e.g., module-scope instances in Python/JS). In most modern contexts, dependency injection containers have replaced hand-rolled singletons.
