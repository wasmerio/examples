---
title: 'TypeScript Generics Explained'
published: 2025-07-02
draft: false
description: 'Learn how to use generics in TypeScript to create reusable and type-safe code.'
tags: ['typescript']
---

Generics in TypeScript allow you to create reusable and type-safe components. Here's a simple example:

```typescript
function identity<T>(arg: T): T {
  return arg
}

console.log(identity<string>('Hello'))
console.log(identity<number>(42))
```

Generics can also be used with classes and interfaces:

```typescript
class Box<T> {
  private content: T

  constructor(content: T) {
    this.content = content
  }

  getContent(): T {
    return this.content
  }
}

const stringBox = new Box<string>('TypeScript')
console.log(stringBox.getContent())
```

Generics are a powerful feature that can make your TypeScript code more flexible and maintainable.
