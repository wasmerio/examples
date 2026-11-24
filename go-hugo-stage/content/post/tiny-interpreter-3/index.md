---
title: "Tiny Interpreter: Evaluating"
date: 2025-12-01T09:00:00+01:00
description: "Part three: walking the tree, and a sequence diagram of one evaluation."
categories: [Tutorials]
tags: [interpreters, rust, mermaid]
series: [Tiny Interpreter]
---


The last part walks the tree. This time in Rust, to show another language in the code theme.

```rust
fn eval(node: &Node) -> f64 {
    match node {
        Node::Number(n) => *n,
        Node::Binary(op, l, r) => {
            let (a, b) = (eval(l), eval(r));
            match op {
                '+' => a + b,
                '-' => a - b,
                '*' => a * b,
                _ => a / b,
            }
        }
    }
}
```

## One evaluation, step by step

```mermaid
sequenceDiagram
  participant R as REPL
  participant P as Parser
  participant E as Evaluator
  R->>P: "1 + 2 * 3"
  P-->>R: tree
  R->>E: eval(tree)
  E-->>R: 7
```

