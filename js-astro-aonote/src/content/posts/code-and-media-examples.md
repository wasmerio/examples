---
title: Code blocks and media examples
date: 2026-01-11
summary: Images, admonitions, fenced code, titles, line highlights, diff highlights, and long lines.
tags: [basic, markdown, code]
---

This page focuses on media and code presentation: images, admonitions, language labels, file titles, line highlights, diff markers, and long lines.

# Admonitions

:::: tip Tip
VuePress/VitePress-style `tip` admonition.
::::

!!! note "Note"
    Python-Markdown-style `note` admonition.

!!! warning "Warning"
    Use for information readers should not miss.

!!! danger "Danger"
    Use for destructive actions or serious risks.

````md
:::: tip Tip
VuePress/VitePress-style `tip` admonition.
::::

!!! note "Note"
    Python-Markdown-style `note` admonition.

!!! warning "Warning"
    Use for information readers should not miss.

!!! danger "Danger"
    Use for destructive actions or serious risks.
````

## Images

![Code syntax highlighting with line numbers, title bar, and highlighted lines](/static/code-example.svg)
*Fenced code block with syntax highlighting, file title, and line highlights.*

```md
![Code syntax highlighting with line numbers, title bar, and highlighted lines](/static/code-example.svg)
*Fenced code block with syntax highlighting, file title, and line highlights.*
```

## Code

Inline code: `code`

```md
Inline code: `code`
```

### Plain fence

```md
Sample text here...
```

### Titled block

```python title="hello.py"
def greet(name):
    return f"Hello, {name}!"
```

````md
```python title="hello.py"
def greet(name):
    return f"Hello, {name}!"
```
````

### Line highlights

```python title="highlight.py" hl_lines="2 4-5"
def greet(name):
    message = f"Hello, {name}!"
    print(message)
    return message
```

````md
```python title="highlight.py" hl_lines="2 4-5"
def greet(name):
    message = f"Hello, {name}!"
    print(message)
    return message
```
````

### Diff highlights

```diff title="example.patch"
 function greet(name) {
-  return "Hello, " + name;
+  return `Hello, ${name}!`;
 }
```

`````md
```diff title="example.patch"
 function greet(name) {
-  return "Hello, " + name;
+  return `Hello, ${name}!`;
 }
```
`````

### Indented code block

```
// Some comments
line 1 of code
line 2 of code
line 3 of code
```

````md
    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code
````

### Nested fences

````md
Outer fence

```
Sample text here...
```
````

### Long line

```bash
curl "https://example.com/api/articles?category=markdown&tag=markdown&include=metadata,summary,content,links,license&sort=published_at_desc"
```

````md
```bash
curl "https://example.com/api/articles?category=markdown&tag=markdown&include=metadata,summary,content,links,license&sort=published_at_desc"
```
````
