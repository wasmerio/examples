---
title: 'Error Handling in Go'
published: 2025-07-08
draft: false
description: 'Understand how to handle errors effectively in Go.'
tags: ['go']
---

Go uses a simple and explicit approach to error handling. Here's an example:

```go title="error_handling.go"
package main

import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
}
```

Error handling in Go is straightforward and encourages developers to handle errors explicitly.

```shell title="Running Go Error Handling Example"
go run error_handling.go
```
