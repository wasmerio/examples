---
sections:
  - "1.1 Thinking About Data Systems"
  - "1.2 Reliability"
  - "1.3 Scalability"
  - "1.4 Maintainability"
---

## Thinking About Data Systems

Modern applications are **data-intensive**, not compute-intensive. The bottleneck is usually the amount, complexity, and speed of data — not raw CPU power. Databases, caches, search indexes, stream processing, and batch processing are all "data systems" with blurring boundaries.

## Reliability

Reliability means the system continues to work correctly even when things go wrong. Faults (hardware, software, human) are inevitable; the goal is **fault-tolerance**, not fault-prevention. Hardware faults are increasingly handled by software-level redundancy. Human errors cause most outages — design systems that minimize opportunities for mistakes.

## Scalability

Scalability is about describing how a system copes with increased load. First, **describe load** with load parameters (e.g., Twitter's fan-out problem: 12k writes/sec vs 300k reads/sec shifted the design from pull to push). Then **describe performance** — throughput for batch systems, response time for online systems. Use **percentiles** (p50, p95, p99) rather than averages, because tail latencies matter.

## Maintainability

Three design principles for long-term health:

- **Operability**: Make it easy for ops teams to keep the system running smoothly.
- **Simplicity**: Manage complexity through good abstractions. Accidental complexity is the real enemy.
- **Evolvability**: Make it easy to adapt the system to changing requirements.
