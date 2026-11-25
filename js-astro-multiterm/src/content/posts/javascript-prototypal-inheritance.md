---
title: "JavaScript's Prototypal Inheritance"
published: 2025-07-13
draft: false
description: 'Learn how prototypal inheritance works in JavaScript and its use cases.'
tags: ['javascript']
---

Prototypal inheritance is a feature in JavaScript that allows objects to inherit properties and methods from other objects. Here's an example:

```javascript
const parent = {
  greet() {
    console.log('Hello from parent!')
  },
}

const child = Object.create(parent)
child.greet() // Hello from parent!
```

Prototypal inheritance is a flexible way to share behavior between objects without using classes.

```shell title="Testing Prototypal Inheritance"
node -e "const parent = { greet() { console.log('Hello from parent!'); } }; const child = Object.create(parent); child.greet();"
```
