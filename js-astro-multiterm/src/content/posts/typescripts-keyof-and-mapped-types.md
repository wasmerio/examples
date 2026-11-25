---
title: "TypeScript's keyof and Mapped Types"
published: 2025-07-14
draft: false
description: 'Explore the keyof operator and mapped types in TypeScript for advanced type manipulation.'
tags: ['typescript']
---

The `keyof` operator and mapped types in TypeScript allow for advanced type manipulation. Here's an example:

```typescript
interface User {
  id: number
  name: string
  email: string
}

type UserKeys = keyof User // 'id' | 'name' | 'email'

type ReadonlyUser = {
  [K in keyof User]: Readonly<User[K]>
}

const user: ReadonlyUser = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
}

// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property.
```

These features make TypeScript a powerful tool for creating robust and type-safe applications.

```shell title="Exploring keyof and Mapped Types"
echo "Using keyof and mapped types in TypeScript"
```
