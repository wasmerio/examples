---
title: The Lemma Theme
description: "What the theme typesets: numbered equations, theorems, cross-references, citations, figures and diagrams."
date: 2026-10-10
tags: [meta, Group Theory]
draft: true
ai: true
macros:
  abs: ['\left| #1 \right|', 1]
  Gal: '\operatorname{Gal}'
---

This post shows what the Lemma theme can typeset. Inline math goes between single dollar signs, for example $\Gal(\overline{\Q}/\Q)$ and $\abs{x - y} < \eps$. Here `\abs` and `\Gal` come from this post's frontmatter; `\Q` and `\eps` are site-wide macros.

## Numbered equations

$$
\begin{equation}
  \int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
  \label{eq:gauss}
\end{equation}
$$

From \eqref{eq:gauss} we get $\Gamma(1/2) = \sqrt{\pi}$. Aligned equations:

$$
\begin{align}
  (a + b)^2 &= a^2 + 2ab + b^2 \label{eq:square} \\
  e^{i\pi} + 1 &= 0
\end{align}
$$

Equation \eqref{eq:square} has its own number.

## Theorem \label{sec:thm}

Theorems are numbered within sections. For background see \cite{serre1973}; for a famous application of such counting arguments see \cite[Sec.~2]{wiles1995}.

:::theorem[Lagrange]{#thm:lagrange}
Let $G$ be a finite group and $H \le G$. Then $\abs{H}$ divides $\abs{G}$, and `card` agrees:

$$
[G : H] = \frac{\abs{G}}{\abs{H}}.
$$
:::

:::proof
The left cosets of $H$ partition $G$, and $h \mapsto gh$ is a bijection $H \to gH$. Hence

$$
\abs{G} = [G : H] \cdot \abs{H}.
$$
:::

:::corollary{#cor:prime}
If $\abs{G}$ is prime, then $G$ is cyclic.
:::

:::proof[Proof of Corollary \ref{cor:prime}]
Take $g \ne e$. By Theorem \ref{thm:lagrange}, the order of $g$ divides $\abs{G}$, so it equals $\abs{G}$.
:::

In Lean:

```lean
theorem card_subgroup_dvd_card {G : Type*} [Group G] [Fintype G]
    (H : Subgroup G) [Fintype H] : Fintype.card H ∣ Fintype.card G :=
  Subgroup.card_subgroup_dvd_card H
```
