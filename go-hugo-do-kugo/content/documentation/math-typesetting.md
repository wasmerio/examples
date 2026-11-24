---
author: DoKugo
title: Math Typesetting
description: A brief guide to use MathJax
date: 2019-03-08
categories:
    - documentation
categories_weight: 2
tags:
    - math
    - markdown
draft: false
---


Mathematical notation in a Hugo project can be enabled by using the third party JavaScript library MathJax.
<!--more-->

In the following examples we will be using [MathJax](https://mathjax.org/)

## Examples

Inline math starts and ends with `%$`:

```plaintext
Inline math: %$ \varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887… %$
```

Inline math: %$ \varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887… %$

Block math on the other hand starts and ends with `$$`:

$$
 \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } } 
$$

$$\varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }$$

$$ \left[\begin{array} {rrr} 3.381563 & 3.389113 \\\\ 4.527875 & 5.854178 \\\\ 2.655682 & 4.411995 \\\\ \vdots & \vdots \end{array}\right] $$

$$ 
f(n) = \begin{cases} \frac{n}{2}, & \text{if } n\text{ is even} \\\\ 3n+1, & \text{if } n\text{ is odd} \end{cases}
$$

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} & = \frac{4\pi}{c}\vec{\mathbf{j}} \\\\   
\nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\\\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\\\
\nabla \cdot \vec{\mathbf{B}} & = 0 \end{aligned}
$$

$$
