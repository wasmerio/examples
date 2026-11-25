---
sections:
  - "2.1 Design Problems"
  - "2.2 Document Structure"
  - "2.3 Patterns Applied"
---

## Design Problems

The Lexi document editor case study introduces seven design problems: document structure, formatting, embellishing the UI, supporting multiple look-and-feel standards, multiple window systems, user operations, and spell checking. Each problem maps to one or more design patterns.

## Document Structure

Lexi represents its document as a hierarchy of **glyphs** — characters, images, rows, columns. This is the **Composite** pattern: a single `Glyph` interface lets clients treat individual objects and compositions uniformly. A `Row` glyph contains child glyphs and delegates `Draw()` to each one.

## Patterns Applied

- **Composite** — recursive document structure where rows contain characters and other rows
- **Strategy** — formatting algorithms (`SimpleCompositor`, `TeXCompositor`) are interchangeable behind a `Compositor` interface
- **Decorator** — `Border` and `Scroll` decorators wrap glyphs to add visual embellishments without subclassing
- **Abstract Factory** — `WidgetFactory` produces UI widgets for different look-and-feel standards (Motif, PM) without client code knowing the concrete classes
- **Bridge** — `Window` abstraction decouples from platform-specific `WindowImp` implementations, enabling portability across window systems

This chapter is the roadmap for the entire catalog. Each design problem motivates why you need the pattern before you ever see its formal definition.
