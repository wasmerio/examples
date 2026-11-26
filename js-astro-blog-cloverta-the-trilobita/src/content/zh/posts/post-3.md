---
title: "[学习笔记]逐步解析Peterson算法为什么不会死等"
pubDate: 2025-06-10
description: '关于Peterson算法的学习笔记'
author: "三叶"
image: 
    url: "https://files.seeusercontent.com/2026/03/25/sTq9/pasted-image-1774456630694.webp"
    alt: "zako2"
tags:  ["peterson算法", "操作系统"]
---

在OS课程上看到一个有意思的算法——Peterson算法，那么为什么Peterson算法能满足“忙则等待”、“空闲让进”、“有限等待”这三个条件呢？

先上伪代码：

```cpp
bool flag[2]; // 表示进入临界区意愿的数组，初始值都为false
int turn = 0; // turn表示优先让哪个进程进入临界区

// P0进程
flag[0] = true; // 首先将自己的flag设置为1,声明自己需要使用临界区
turn = 1; // 让P1优先执行，如果P1需要临界区
while (flag[1] && turn == 1); // 检查P1是否需要临界区
CRITICAL_SECTION;
flag[0] = false;
REMAINDER_SECTION;

// P1进程
flag[1] = true;
turn = 0;
while (flag[0] && turn == 0);
CRITICAL_SECTION;
flag[1] = false;
REMAINDER_SECTION;
```

让我们来分情况分析。

现在，我们假设P0和P1在并发执行，并且非常巧的是，他们一起完成了第一步，他们俩的flag都是false。

此时：

> **\[情况1\]**  
> 若P0先上处理机，将turn设置为1;  
> P1上处理机，将turn设置为0;  
> P0上处理机，P0检查flag和turn，发现trun被改为0，不满足等待条件，P0进入临界区;  
> P1上处理机，P1检查flag和turn，发现flag\[0\]为true且turn未被改变，P1等待。  
> P0上处理机，且P0结束使用临界区，将flag\[1\]改为false;  
> P1上处理机，发现flag\[0\]为false,结束等待，进入临界区;
>
> **\[情况2\]**  
> 若P0先上处理机，将turn设置为1;  
> P0继续使用处理机，发现flag\[0\]为true,turn仍然为1,满足等待条件，P0等待;  
> P1上处理机，将turn改为0;  
> P1继续使用处理机，发现flag\[1\]为true,turn仍然为0,满足等待条件，P1等待;  
> P0上处理机，发现turn变为0,不满足等待条件，P0解除等待进入临界区;  
> P1上处理机，发现等待条件仍满足，P1继续等待;  
> P0上处理机，且P0结束使用处理机，将flag\[0\]改为false;  
> P1上处理机，发现flag\[0\] == false, 不满足等待条件，结束等待，进入临界区;

_YES, IT WORKS ON MY MACHINE._