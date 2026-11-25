---
sections:
  - "6.1 Encapsulate Record"
  - "6.2 Encapsulate Collection"
  - "6.3 Replace Primitive with Object"
---

## Encapsulate Record

Raw data records (plain objects, hashes, dictionaries) expose their structure to every consumer. Wrap them in a class with accessors. Now you can **change the internal representation without breaking callers**. You can add validation, computed fields, and logging.

This is especially valuable for data that crosses boundaries — API responses, configuration objects, database rows. The record format will change; encapsulation absorbs the impact.

## Encapsulate Collection

A class that exposes a raw collection (array, list, set) loses control over its own data. Callers can add, remove, or reorder items without the class knowing. Instead, provide **add/remove methods** and return copies or read-only views.

The getter should return a copy or a proxy — never the original collection. This prevents subtle bugs where external code modifies the collection and the owning object's invariants break silently.

## Replace Primitive with Object

A phone number starts as a string. Then you need formatting. Then validation. Then comparison logic. The string can't hold all of this. **Replace the primitive with a small object** that encapsulates the value and its behavior.

This is one of the most valuable refactorings for growing systems. Early in development, a primitive is fine. But the moment a value attracts behavior — formatting, validation, parsing, equality — it's time to graduate it to its own type.
