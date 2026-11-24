---
title: "Tiny Interpreter: Reading Characters"
date: 2025-11-03T09:00:00+01:00
description: "Part one of a series: a scanner that turns source text into tokens."
categories: [Tutorials]
tags: [interpreters, go]
series: [Tiny Interpreter]
---


This is the first part of a short series. Posts in a series show their position under the title, and a series menu after the text.

## Tokens

A scanner reads characters and groups them into tokens:

```go
type Token struct {
	Kind  Kind
	Text  string
	Line  int
}

func (s *Scanner) Next() Token {
	s.skipSpace()
	switch c := s.peek(); {
	case isDigit(c):
		return s.number()
	case isLetter(c):
		return s.identifier()
	default:
		return s.symbol()
	}
}
```

## What comes next

The next part turns the tokens into a tree.

