---
author: DoKugo
title: Mermaid diagrams
description: A brief guide to use Mermaid
date: 2019-03-08
categories:
    - documentation
categories_weight: 2
tags:
    - mermaid
    - markdown
draft: false
---



To get the following graph use the following code:

```plaintext
{{</* mermaid */>}}
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
{{</* /mermaid */>}}
```


{{<mermaid>}}
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
{{</mermaid>}}



```plaintext
{{</* mermaid */>}}
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid
    section A section
    Completed task            :done,    des1, 2014-01-06,2014-01-08
    Active task               :active,  des2, 2014-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2               :         des4, after des3, 5d
    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
