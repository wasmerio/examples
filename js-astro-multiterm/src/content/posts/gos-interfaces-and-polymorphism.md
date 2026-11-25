---
title: "Go's Interfaces and Polymorphism"
published: 2025-07-12
draft: false
description: 'Explore how Go uses interfaces to achieve polymorphism.'
tags: ['go']
---

Interfaces in Go provide a way to achieve polymorphism. Here's an example:

```go
package main

import "fmt"

type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14 * c.Radius * c.Radius
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func printArea(s Shape) {
    fmt.Println("Area:", s.Area())
}

func main() {
    c := Circle{Radius: 5}
    r := Rectangle{Width: 4, Height: 6}

    printArea(c)
    printArea(r)
}
```

Interfaces in Go are a powerful way to write flexible and reusable code.

```shell title="Running Go Interfaces Example"
go run interfaces_example.go
```
