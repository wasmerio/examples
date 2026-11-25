---
sections:
  - "4.1 Leaders and Followers"
  - "4.2 Problems with Replication Lag"
  - "4.3 Multi-Leader Replication"
  - "4.4 Leaderless Replication"
---

## Leaders and Followers

**Single-leader replication**: one replica accepts writes, streams changes to followers. Synchronous followers guarantee up-to-date copies but any one slow follower stalls all writes. In practice, one synchronous + rest async (**semi-synchronous**) is common. Setting up new followers uses a consistent snapshot + replay of the replication log.

## Problems with Replication Lag

Async replication introduces lag. Three consistency guarantees to consider:

- **Read-after-write consistency**: users always see their own writes. Route user's reads to the leader, or track replication position.
- **Monotonic reads**: a user never sees time go backward. Sticky sessions to the same replica solve this.
- **Consistent prefix reads**: causal ordering is preserved. Particularly tricky in partitioned databases.

## Multi-Leader Replication

Useful for **multi-datacenter** setups — each datacenter has its own leader. Tolerates datacenter outages and network problems between datacenters. The hard part is **conflict resolution**: last-write-wins (data loss), merge, or custom resolution logic. Collaborative editing tools face the same challenges.

## Leaderless Replication

**Dynamo-style**: clients send writes to multiple replicas in parallel. Read from multiple replicas and use version numbers to detect stale values. **Quorum condition**: w + r > n ensures overlap between write and read sets. **Sloppy quorums** accept writes on any available nodes during outages, with **hinted handoff** to replay later. Anti-entropy processes repair inconsistencies in the background.
