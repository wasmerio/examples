# Development Guide

These documents describe Nayuta's current design and development conventions.

## Directory

| Document                                             | Contents                                                                             |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Visual design](design.md)                           | Color palettes, typography, spacing, responsive composition, and control appearance. |
| [Architecture and code conventions](architecture.md) | Directory ownership, imports, TypeScript, styling, and browser behavior.             |
| [Content](content.md)                                | Content discovery, metadata, routing, sidebars, drafts, tags, and reading time.      |
| [Creating a template](templates.md)                  | Template definitions, schemas, body components, registration, and validation.        |
| [Components and pagination](components.md)           | Shared UI, static archives, and the dynamic post-list API.                           |

Start with architecture when adding a feature, and consult the relevant contract
before changing its implementation. Visual changes should also follow the design
reference. Update these documents when a public API or convention changes.

For local setup, branch and commit naming, validation commands, and pull requests,
see [Contributing to Nayuta](../../CONTRIBUTING.md). For site configuration and
authoring examples, see the [README](../../README.md).
