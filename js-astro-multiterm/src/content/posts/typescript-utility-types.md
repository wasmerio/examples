---
title: 'TypeScript Utility Types'
published: 2025-07-06
draft: false
description: 'Explore the built-in utility types in TypeScript and how to use them.'
tags: ['typescript']
---

TypeScript provides several utility types to make your code more concise and type-safe. For example:

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Partial makes all properties optional
const updateUser: Partial<User> = { name: 'New Name' }

// Readonly makes all properties read-only
const readonlyUser: Readonly<User> = { id: 1, name: 'John', email: 'john@example.com' }

// Pick selects specific properties
const userName: Pick<User, 'name'> = { name: 'John' }

// Omit removes specific properties
const userWithoutEmail: Omit<User, 'email'> = { id: 1, name: 'John' }
```

Utility types are a great way to work with complex types in TypeScript.

```shell title="Exploring TypeScript Utility Types"
echo "Using Partial, Readonly, Pick, and Omit in TypeScript"
```
