---
sections:
  - "3.1 Data Structures That Power Your Database"
  - "3.2 Transaction Processing or Analytics?"
  - "3.3 Column-Oriented Storage"
---

## Data Structures That Power Your Database

Two main families of storage engines:

- **Log-structured** (LSM-trees, SSTables): append-only writes, periodic compaction and merging. Faster writes because sequential I/O dominates. Used by LevelDB, RocksDB, Cassandra.
- **Page-oriented** (B-trees): fixed-size pages, in-place updates. The standard for most relational databases. Faster reads due to direct lookups. Uses a write-ahead log (WAL) for crash recovery.

LSM-trees have better **write amplification** characteristics but can suffer from compaction interference at high write throughput.

## Transaction Processing or Analytics?

**OLTP** (online transaction processing) handles user-facing requests — small number of records per query, random access, low latency. **OLAP** (online analytical processing) scans huge volumes for business intelligence. Running analytics on the OLTP database degrades performance, so organizations use separate **data warehouses** fed by ETL. Star schema (fact table + dimension tables) is the standard warehouse structure.

## Column-Oriented Storage

Analytical queries often access only a few columns out of hundreds. **Column-oriented storage** stores each column's values together, enabling efficient compression (bitmap encoding, run-length encoding) and vectorized processing. Column compression + sorted order can dramatically reduce I/O for aggregate queries. Materialized views and data cubes pre-compute common aggregations.
