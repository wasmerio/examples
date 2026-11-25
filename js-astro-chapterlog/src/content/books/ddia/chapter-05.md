---
sections:
  - "5.1 Partitioning of Key-Value Data"
  - "5.2 Partitioning and Secondary Indexes"
  - "5.3 Rebalancing Partitions"
  - "5.4 Request Routing"
---

## Partitioning of Key-Value Data

Partitioning (sharding) splits data across nodes to scale beyond a single machine. Two main strategies:

- **Key range partitioning**: sorted, good for range scans, but risk of **hot spots** (e.g., timestamp keys concentrate writes on one partition).
- **Hash partitioning**: distributes keys uniformly, but loses sort order. Compound keys (hash first part, sort on second) offer a middle ground.

Skewed workloads (celebrity problem) may require application-level splitting.

## Partitioning and Secondary Indexes

Secondary indexes complicate partitioning:

- **Document-partitioned (local) index**: each partition maintains its own index. Writes are simple, but reads require **scatter/gather** across all partitions.
- **Term-partitioned (global) index**: index is partitioned by the indexed term. Reads hit one partition, but writes touch multiple partitions and updates are often async.

## Rebalancing Partitions

When nodes are added or removed, data must be rebalanced. Approaches: **fixed number of partitions** (many more partitions than nodes, reassign whole partitions), **dynamic partitioning** (split/merge as data grows), **proportional to nodes** (fixed partitions per node). Avoid hash-mod-N — it causes massive data movement.

## Request Routing

How does a client know which node holds a given partition? Three approaches: clients contact any node (gossip protocol, e.g., Cassandra), a dedicated **routing tier** (e.g., ZooKeeper-based), or clients maintain partition-aware logic. ZooKeeper acts as a coordination service that notifies routing tiers of partition assignment changes.
