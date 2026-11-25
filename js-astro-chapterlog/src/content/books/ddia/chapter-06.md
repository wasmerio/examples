---
sections:
  - "6.1 The Slippery Concept of a Transaction"
  - "6.2 Weak Isolation Levels"
  - "6.3 Serializability"
---

## The Slippery Concept of a Transaction

**ACID** is vaguely defined in practice. Atomicity = abortability (all-or-nothing), not about concurrency. Consistency is really an application property. Isolation = concurrent transactions don't interfere. Durability = data survives crashes. Many "ACID" databases actually implement weak isolation. BASE (Basically Available, Soft state, Eventually consistent) is even vaguer.

## Weak Isolation Levels

Isolation levels trade correctness for performance:

- **Read committed**: no dirty reads, no dirty writes. Default in many databases (e.g., PostgreSQL). Implemented with row-level locks + remembering old values.
- **Snapshot isolation** (MVCC): each transaction reads from a consistent snapshot. Prevents non-repeatable reads. PostgreSQL calls it "repeatable read."
- **Preventing lost updates**: atomic operations, explicit locking (SELECT FOR UPDATE), or automatic detection.
- **Write skew and phantoms**: two transactions read the same data, make decisions, then write — violating a constraint that neither saw individually. Phantoms occur when one transaction's write changes another's search condition.

## Serializability

Three approaches to true serializability:

- **Actual serial execution**: run all transactions on a single thread. Works if transactions are fast (stored procedures) and data fits in memory (VoltDB).
- **Two-phase locking (2PL)**: readers block writers and vice versa. Strong guarantees but poor performance and risk of deadlocks. Predicate locks or index-range locks handle phantoms.
- **Serializable snapshot isolation (SSI)**: optimistic approach built on snapshot isolation. Detects conflicts at commit time rather than blocking. Better performance than 2PL for read-heavy workloads.
