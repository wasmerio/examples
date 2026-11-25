---
sections:
  - "2.1 Relational Model vs Document Model"
  - "2.2 Query Languages for Data"
  - "2.3 Graph-Like Data Models"
---

## Relational Model vs Document Model

The relational model (SQL) has dominated since the 1980s, but **document databases** (NoSQL) gained traction for schema flexibility and better data locality. Document model works well when data has a tree structure (one-to-many). Relational model wins for **many-to-many relationships** and joins. The impedance mismatch between relational tables and application objects drove the document model's popularity.

## Query Languages for Data

**SQL is declarative** — you specify what you want, not how to get it. This lets the optimizer choose the best execution strategy. Contrast with imperative approaches like IMS/CODASYL. **MapReduce** is neither fully declarative nor imperative; it's based on map and reduce functions that must be pure. MongoDB added the aggregation pipeline as a more ergonomic alternative.

## Graph-Like Data Models

When many-to-many relationships are central to your data, **graph models** are natural. Two main approaches:

- **Property graph model** (Neo4j): vertices + edges, each with properties. Queried with Cypher.
- **Triple stores** (RDF): subject-predicate-object triples. Queried with SPARQL.

Graph models excel at traversing relationships with variable depth — something relational joins handle awkwardly.
