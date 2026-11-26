---
title: "[Study Notes] A Step-by-Step Analysis of Why Peterson's Algorithm Does Not Deadlock"
pubDate: 2025-06-10
description: "Study notes on Peterson's Algorithm"
author: "Cloverta"
image: 
    url: "https://files.seeusercontent.com/2026/03/25/sTq9/pasted-image-1774456630694.webp"
    alt: "zako2"
tags: ["Peterson's algorithm", "Operating System"]
---

In my OS course, I came across an interesting algorithm — Peterson's Algorithm. So why does Peterson's Algorithm satisfy the three conditions: "mutual exclusion", "progress", and "bounded waiting"?

First, here is the pseudocode:

```cpp
bool flag[2]; // Array indicating intention to enter critical section, initially false
int turn = 0; // turn indicates which process is given priority to enter the critical section

// Process P0
flag[0] = true; // First set its own flag to true, declaring it needs the critical section
turn = 1; // Let P1 execute first if P1 needs the critical section
while (flag[1] && turn == 1); // Check if P1 needs the critical section
CRITICAL_SECTION;
flag[0] = false;
REMAINDER_SECTION;

// Process P1
flag[1] = true;
turn = 0;
while (flag[0] && turn == 0);
CRITICAL_SECTION;
flag[1] = false;
REMAINDER_SECTION;
```

Let's analyze it case by case.

Assume that P0 and P1 are executing concurrently, and coincidentally they both complete the first step together — both of their flags are false.

At this point:

> **[Case 1]**  
> If P0 gets on the CPU first, it sets turn = 1;  
> P1 gets on the CPU, sets turn = 0;  
> P0 gets on the CPU, checks flag and turn — finds turn has been changed to 0, the waiting condition is not met, so P0 enters the critical section;  
> P1 gets on the CPU, checks flag and turn — finds flag[0] is true and turn is unchanged, so P1 waits.  
> P0 gets on the CPU and finishes using the critical section, sets flag[1] = false;  
> P1 gets on the CPU, finds flag[0] is false, stops waiting and enters the critical section;
>
> **[Case 2]**  
> If P0 gets on the CPU first, sets turn = 1;  
> P0 continues using the CPU, finds flag[0] is true and turn is still 1, the waiting condition is met, so P0 waits;  
> P1 gets on the CPU, sets turn = 0;  
> P1 continues using the CPU, finds flag[1] is true and turn is still 0, the waiting condition is met, so P1 waits;  
> P0 gets on the CPU, finds turn has become 0, the waiting condition is not met, so P0 exits the wait and enters the critical section;  
> P1 gets on the CPU, finds the waiting condition still holds, so P1 continues waiting;  
> P0 gets on the CPU and finishes using the CPU, sets flag[0] = false;  
> P1 gets on the CPU, finds flag[0] == false, the waiting condition is not met, stops waiting and enters the critical section;

_YES, IT WORKS ON MY MACHINE._
