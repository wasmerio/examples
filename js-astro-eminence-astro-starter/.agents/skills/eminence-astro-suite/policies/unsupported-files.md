# Unsupported files

The integration intentionally does not generate the files listed below. Do not add them via `Extend` or by hand — use the modern alternative instead.

## `browserconfig.xml`

Internet Explorer 11 / Windows 8–10 Start screen tile configuration.

**Reason:** tied to legacy Microsoft tile behavior. Modern browsers and platforms ignore it.

**Use instead:**

- [Web app manifest](../integration/manifest.md) for installable metadata, including tile icons.
- [Icon generation](../integration/icons.md) for the favicon/apple-touch-icon set.

## Cross-references

- Unsupported tags companion: [./unsupported-tags.md](./unsupported-tags.md).
