---
title: "Code Highlighting Demo"
date: 2026-04-05
draft: false
tags: ["code", "demo"]
description: "Demonstrates syntax highlighting in multiple languages"
---


## Go

```go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", handler)
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Python

```python
def fibonacci(n):
    """Generate Fibonacci sequence"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(100))
```

## JavaScript

```javascript
