---
sections:
  - "4.1 Conceptual Integrity"
  - "4.2 Achieving Conceptual Integrity"
---

## Conceptual Integrity

**Conceptual integrity is the most important consideration in system design.** A system that reflects one coherent set of design ideas is easier to learn, use, and extend than a system that cobbles together many brilliant but disconnected ideas.

It's better to omit certain features and improvements if they don't fit the overall design philosophy. A clean, consistent system with fewer features beats a feature-rich system that feels incoherent. Users (and developers) can hold one mental model; they can't hold a dozen.

## Achieving Conceptual Integrity

Conceptual integrity requires that the design come from **a few minds** — ideally one. This means separating architecture from implementation. The architect defines what the system does; the builders decide how. This isn't elitism — it's specialization.

The fear is that implementation teams will feel like mere code monkeys. In practice, the opposite is true. A clear architecture gives implementers **freedom** within well-defined boundaries. Without it, every developer invents their own conventions, and the system becomes an inconsistent mess.

Brooks argues this is the hardest organizational lesson in software: democratic design produces mediocre systems. Benevolent dictatorship — or at most a small oligarchy — produces coherent ones.
