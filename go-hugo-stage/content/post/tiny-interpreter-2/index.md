---
title: "Tiny Interpreter: Building the Tree"
date: 2025-11-17T09:00:00+01:00
description: "Part two: a recursive-descent parser, drawn as a Mermaid diagram."
categories: [Tutorials]
tags: [interpreters, go, mermaid]
series: [Tiny Interpreter]
---


The parser reads tokens and builds a syntax tree. Mermaid diagrams are drawn in the browser; the button under each one opens it full screen.

## The pipeline

```mermaid {caption="From source text to a value."}
flowchart LR
  A[Source text] --> B(Scanner)
  B -->|tokens| C(Parser)
  C -->|tree| D(Evaluator)
  D --> E[Value]
```

## Precedence

Each level of precedence is one function:

```go
func (p *Parser) expression() Node { return p.term() }

func (p *Parser) term() Node {
	left := p.factor()
	for p.match("+", "-") {
		op := p.previous()
		left = Binary{op, left, p.factor()}
	}
	return left
}
```

