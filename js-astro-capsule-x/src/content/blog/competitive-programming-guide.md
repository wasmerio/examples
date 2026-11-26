---
title: "Competitive Programming: A Beginner's Guide"
description: "An introduction to competitive programming covering fundamental algorithms, common techniques, and practical advice for newcomers."
pubDate: 2026-07-04
tags: ["algorithm", "tutorial"]
---

## What is Competitive Programming?

Competitive programming is a mind sport where participants solve well-defined algorithmic problems under time constraints. You write programs that produce correct output for given inputs, and solutions are judged automatically in real-time.

It's one of the best ways to improve your problem-solving skills, deepen your understanding of algorithms, and sharpen your coding ability.

## Common Contest Formats

### Online Judges

Most online contests run on platforms called "Online Judges" (OJs). You submit your code, and the system runs it against hidden test cases.

| Platform | Language | Difficulty |
|----------|----------|------------|
| Codeforces | English | Beginner to Expert |
| LeetCode | English | Interview-focused |
| OJ (various) | Mixed | Varies |

### Typical Contest Rules

- **Duration:** 1 to 5 hours depending on the contest
- **Problems:** 3 to 12 problems of varying difficulty
- **Scoring:** Each problem has a fixed score; penalty for wrong submissions
- **Judging:** Real-time — you know immediately if your solution passes

## Essential Algorithms by Difficulty

### Level 1: Fundamentals

These topics cover the easiest problems (A–B level in most contests):

- **Input/Output:** Fast reading, formatted output
- **Loops and conditionals:** Nested loops, string processing
- **Basic math:** GCD, LCM, modular arithmetic, prime checking

```python
# Example: Check if a number is prime
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
```

### Level 2: Sorting and Searching

These are the bread and butter of competitive programming:

- **Sorting:** Built-in sort, custom comparators, counting sort
- **Binary search:** On arrays, on answer space
- **Two pointers:** Sliding window, fast-slow pointers

```python
# Binary search on answer space
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

### Level 3: Greedy Algorithms

Greedy algorithms make locally optimal choices at each step:

- **Activity selection:** Sort by end time, pick non-overlapping activities
- **Huffman coding:** Build optimal prefix codes
- **Interval scheduling:** Maximize number of non-overlapping intervals

```python
# Activity selection
def max_activities(activities):
    activities.sort(key=lambda x: x[1])  # Sort by end time
    count = 0
    last_end = 0
    for start, end in activities:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

### Level 4: Dynamic Programming

DP is the most important technique in competitive programming. It breaks complex problems into overlapping subproblems:

- **0-1 Knapsack:** Classic DP problem
- **Longest Common Subsequence (LCS):** String comparison
- **Longest Increasing Subsequence (LIS):** Array analysis
- **Grid paths:** Count paths with obstacles

```python
# 0-1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    for i in range(n):
        for j in range(capacity, weights[i] - 1, -1):
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])
    return dp[capacity]
```

### Level 5: Graph Theory

Graph problems are common in mid-to-hard contests:

- **BFS/DFS:** Traversal, connected components, shortest path (unweighted)
- **Dijkstra:** Shortest path with non-negative weights
- **Minimum Spanning Tree:** Kruskal's and Prim's algorithms
- **Topological sorting:** Directed acyclic graphs

```python
# BFS shortest path on unweighted graph
from collections import deque

def bfs(graph, start, end):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == end:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1
```

## Practical Advice

### Before a Contest

1. **Master your language:** Know the standard library inside out
2. **Prepare templates:** Fast I/O, common data structures, algorithm implementations
3. **Practice regularly:** Solve 2–3 problems daily on platforms like LeetCode or Codeforces

### During a Contest

1. **Read all problems first:** Spend 5 minutes scanning; start with the easiest
2. **Don't get stuck:** If a problem blocks you for 20+ minutes, move on
3. **Test edge cases:** Empty input, maximum values, single element, all identical
4. **Check before submitting:** Off-by-one errors and wrong variable names are the most common mistakes

### After a Contest

1. **Read editorials:** Learn the intended solution approach
2. **Upsolve:** Solve the problems you couldn't finish
3. **Analyze complexity:** Understand why your solution is fast or slow

## Learning Roadmap

```
Basic Syntax → Sorting & Searching → Greedy → Dynamic Programming
→ Graph Theory → Data Structures → Number Theory → Advanced Topics
```

Spend 2–3 weeks on each topic with 20–30 practice problems. Don't rush — building a strong foundation is more important than speed.

## Resources

- [OI-Wiki](https://oi-wiki.org/) — Comprehensive algorithm encyclopedia
- [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf) — Free ebook by Antti Laaksonen
- [Codeforces](https://codeforces.com/) — Popular contest platform with regular competitions
- [LeetCode](https://leetcode.com/) — Great for interview prep and daily practice

---

> The essence of competitive programming isn't about who codes the fastest — it's about who thinks the deepest. Enjoy the process of thinking, and the skills will follow.
