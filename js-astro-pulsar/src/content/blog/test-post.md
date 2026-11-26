---
title: "Test Post - Theme Functionality Check"
description: "This is a comprehensive test post to verify all blog features are working correctly"
published: true
date: 2025-11-10
author: "amirdaraee"
keywords: ["test", "demo", "functionality", "astro"]
photo: "/sample-4.jpg"
language: "en"
---

# Test Post for Pulsar Theme

This is a test post created to verify the blog theme functionality. Let's test various markdown features.

## Text Formatting

This paragraph contains **bold text**, *italic text*, and ***bold italic text***. We can also use ~~strikethrough~~ text.

## Lists

### Unordered List
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

### Ordered List
1. First step
2. Second step
3. Third step

## Code Blocks

### JavaScript
```javascript
function testFunction() {
  const message = "Hello from Pulsar theme!";
  console.log(message);
  return message;
}

testFunction();
```

### TypeScript
```typescript
interface BlogPost {
  title: string;
  description: string;
  date: Date;
  published: boolean;
}

const post: BlogPost = {
  title: "Test Post",
  description: "Testing the theme",
  date: new Date(),
  published: true
};
```

### Python
```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

## Blockquotes

> This is a blockquote. It should be styled differently from regular text.
> It can span multiple lines.

## Links

Here's a [link to Astro documentation](https://docs.astro.build).

## Inline Code

You can use `inline code` like this: `const x = 10;`

## Horizontal Rule

---

## Conclusion

This test post verifies that:
- Markdown rendering works correctly
- Syntax highlighting is functional
- Text formatting is applied properly
- The blog post template displays content correctly

If you can see this post rendered properly, the theme is working! 🎉
