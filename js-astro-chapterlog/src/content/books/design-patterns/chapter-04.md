---
sections:
  - "4.1 Intent"
  - "4.2 Motivation"
  - "4.3 Structure"
  - "4.4 Consequences"
---

## Intent

Separate the construction of a complex object from its representation so that the same construction process can create different representations.

## Motivation

An RTF reader must convert documents to multiple formats — plain text, TeX, a GUI widget. The reader parses RTF tokens and calls a `TextConverter` builder: `ConvertCharacter()`, `ConvertParagraph()`, `ConvertFontChange()`. Each concrete builder (e.g., `TeXConverter`) assembles the output in its own format.

## Structure

The **Director** (`RTFReader`) drives the construction step by step. The **Builder** (`TextConverter`) declares the interface for creating parts. **ConcreteBuilders** implement those steps and provide a `GetResult()` method to retrieve the final product. The director doesn't know what's being built — it just follows the parsing algorithm.

## Consequences

- **Vary internal representation** — new output formats only require a new builder, no changes to the parsing logic
- **Isolates construction and representation** — the director encapsulates how a complex object is assembled; the builder encapsulates how it's represented
- **Finer control over construction** — unlike one-shot factory methods, builder constructs products step by step, giving the director control over the process

Builder is everywhere in modern APIs: query builders, request builders, config objects with `.setX().setY().build()`. The key insight is separating the **what to build** from the **how to build it**.
