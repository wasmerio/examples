---
title: 'Concurrency in Go'
published: 2025-07-04
draft: false
description: 'Explore how Go handles concurrency with goroutines and channels.'
tags: ['go']
---

Go is known for its excellent support for concurrency. The primary tools for concurrency in Go are goroutines and channels. Here's an example:

```go
package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")
    say("hello")
}
```

Channels are used to communicate between goroutines:

```go
package main

import "fmt"

func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum // send sum to channel
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}

    c := make(chan int)
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    x, y := <-c, <-c // receive from channel

    fmt.Println(x, y, x+y)
}
```

Go's concurrency model is simple yet powerful, making it a great choice for concurrent programming.

```shell title="Running Go Concurrency Example"
go run concurrency_example.go
```
