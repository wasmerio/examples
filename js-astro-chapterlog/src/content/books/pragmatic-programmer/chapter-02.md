---
sections:
  - "2.1 The Evils of Duplication"
  - "2.2 Orthogonality"
  - "2.3 Reversibility"
  - "2.4 Tracer Bullets"
---

## The Evils of Duplication

**DRY — Don't Repeat Yourself.** Every piece of knowledge must have a single, unambiguous representation. But DRY isn't just about code duplication. It also applies to documentation, data schemas, and even knowledge shared between team members.

Four kinds of duplication: **imposed** (the environment requires it), **inadvertent** (you don't realize it's duplicated), **impatient** (you're in a rush), and **inter-developer** (multiple people build the same thing). Active communication is the best defense against the last one.

## Orthogonality

Two components are **orthogonal** if changing one doesn't affect the other. Orthogonal systems are easier to test, debug, and change. If fixing a bug in the UI requires editing database code, something is wrong.

Design for independence. Avoid global data. Pass context explicitly. If a component needs to know about too many other components, your design isn't orthogonal enough.

## Reversibility

Requirements change. Vendors disappear. Technologies fall out of favor. **Design for reversibility** — don't lock yourself into decisions that are hard to undo. Abstract away third-party dependencies. Keep your architecture flexible enough to swap out major components.

No decision is cast in stone. The more reversible your decisions, the less you need to get them right the first time.

## Tracer Bullets

Tracer bullets are end-to-end slices of functionality that connect the interface to the database. Unlike prototypes, **tracer bullet code is production code** — lean but real. It gives you immediate feedback and a visible framework to build on.

Prototypes are disposable; tracer bullets are skeletal systems you flesh out. Use tracer bullets when you're facing a new domain or an unfamiliar architecture.
