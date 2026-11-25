---
title: 'Mastering Async/Await in JavaScript'
published: 2025-07-05
draft: false
description: 'Learn how to handle asynchronous operations in JavaScript using async/await.'
tags: ['javascript']
---

Async/await simplifies working with asynchronous code in JavaScript. Here's an example:

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

fetchData()
```

Async/await is built on top of Promises and makes the code more readable and maintainable.

```shell title="Running Async/Await Example"
node -e "(async () => { const response = await fetch('https://api.example.com/data'); console.log(await response.json()); })()"
```
