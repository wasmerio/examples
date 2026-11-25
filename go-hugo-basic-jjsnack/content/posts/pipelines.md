+++
title = "Drawing the pipeline"
date = 2026-07-27
draft = false
topics = ["Design", "Reference"]
+++

Sometimes a diagram says it faster than a paragraph. A build pipeline, start
to finish:

```mermaid
flowchart TD
  A[Write markdown] --> B[Hugo build]
  B --> C[Render hooks]
  C --> D[Images]
  C --> E[Mermaid]
  C --> F[MathML]
  D --> G[Static site]
  E --> G
  F --> G
  G --> H{Deploy}
```

Each render hook handles one concern, and the whole thing stays static — no
runtime dependencies to break.
