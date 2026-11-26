---
title: Lemma 主题示例
description: "本主题支持的写作元素一览: 编号公式, 定理环境, 交叉引用, 文献, 旁注, 图表和交换图."
date: 2026-10-10
tags: [meta, 代数]
draft: true
ai: true
macros:
  abs: ['\left| #1 \right|', 1]
  Gal: '\operatorname{Gal}'
---

这篇文章展示 Lemma 主题支持的写作元素. 行内公式写在单个美元符号之间, 例如 $\Gal(\overline{\Q}/\Q)$ 和 $\abs{x - y} < \eps$. 文中的 `\abs` 和 `\Gal` 定义在本文的 frontmatter 里, `\Q` 和 `\eps` 是全站宏.

> Euler 恒等式 $e^{i\pi} + 1 = 0$ 把五个最基本的常数联系在了一起.

## AMS 环境与编号 \label{sec:ams}

带编号的公式可以用 `\label` 和 `\eqref` 引用:

$$
\begin{equation}
  \int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
  \label{eq:gauss}
\end{equation}
$$

由 \eqref{eq:gauss}[^gauss] 可得 $\Gamma(1/2) = \sqrt{\pi}$. 多行对齐:

$$
\begin{align*}
  (a + b)^2 &= a^2 + 2ab + b^2 \\
  \sum_{\substack{0 \le i \le m \\ 0 < j < n}} P(i, j) &= \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}
\end{align*}
$$

分段函数:

$$
f(x) = \begin{cases}
  x^2 \sin(1/x) & x \neq 0, \\
  0 & x = 0.
\end{cases}
$$

## 定理环境 \label{sec:thm}

定理的编号随章节变化[^numbering], 例如本节的定理写作 2.x[^amsthm]. 第 \ref{sec:ams} 节介绍了公式编号. 关于数论的入门, 见 \cite{serre1973} 或 \cite[第 3 章]{hua1957}.

:::definition
设 $G$ 是群, $H \subseteq G$. 如果 $H$ 对 $G$ 的运算也构成群, 就称 $H$ 是 $G$ 的**子群**, 记作 $H \le G$.
:::

:::theorem[Lagrange]{#thm:lagrange}
设 $G$ 是有限群, $H \le G$. 那么 $\abs{H}$ 整除 $\abs{G}$, 并且

$$
[G : H] = \frac{\abs{G}}{\abs{H}}.
$$
:::

:::proof
$H$ 的左陪集[^coset]构成 $G$ 的一个划分, 并且每个陪集 $gH$ 和 $H$ 之间有双射 $h \mapsto gh$. 所以

$$
\abs{G} = [G : H] \cdot \abs{H}.
$$
:::

:::lemma
若 $\abs{G} = p$ 是素数, 则 $G$ 是循环群.
:::

:::proof
取 $g \ne e$. 由定理 \ref{thm:lagrange}, $\abs{\langle g \rangle}$ 整除 $p$, 所以 $\langle g \rangle = G$.
:::

:::remark
定理 \ref{thm:lagrange} 的逆命题不成立 (参见 \cite{serre1973, greentao2008}): $A_4$ 没有 6 阶子群.
:::

## 字体与箭头

$\mathbb{R}$, $\mathcal{C}$, $\mathfrak{g}$, $\mathscr{F}$, $\mathsf{Set}$, $\mathds{1}$. 正合列:

$$
0 \longrightarrow A \xrightarrow{\ f\ } B \xrightarrow[\text{surj}]{\ g\ } C \longrightarrow 0
$$

### 李代数 $\mathfrak{sl}_2(\C)$

$[h, e] = 2e$, $[h, f] = -2f$, $[e, f] = h$.

### 交换图

交换图 (amscd):

$$
\begin{CD}
  A @>f>> B \\
  @VgVV @VVhV \\
  C @>>k> D
\end{CD}
$$

tikz-cd, 带编号:

:::figure{#fig:pullback}
```tikzcd
X \arrow[drr, bend left, "x"] \arrow[ddr, bend right, "y"'] \arrow[dr, dashed, "\exists!" description] \\
& P \arrow[r, "p"] \arrow[d, "q"'] \arrow[dr, phantom, very near start, "\lrcorner"] & A \arrow[d, "f"] \\
& B \arrow[r, "g"'] & C
```

拉回 $P = A \times_C B$ 的泛性质.
:::

## physics 与 mathtools

$$
\dv{x} \qty(\frac{1}{x}) = -\frac{1}{x^2}, \qquad
\pdv{f}{x}{y}, \qquad
\bra{\psi} \hat{H} \ket{\phi}, \qquad
\norm{v} \coloneqq \sqrt{\inner{v}{v}}
$$

$$
\Hom_{\mathsf{Set}}(X, Y) \cong \set{f : X \to Y}, \qquad \underbrace{1 + 1 + \cdots + 1}_{n} = n
$$

## 表格与图片

表 \ref{tab:groups} 列出几个小群. 图 \ref{fig:hom} 是一个群同态的示意图, 图 \ref{fig:clip} 是一段视频.

:::table{#tab:groups}
| 群 $G$   | 阶 $\abs{G}$ | 是否交换 |
| :------- | -----------: | :------: |
| $\Z/n\Z$ |          $n$ |    是    |
| $S_3$    |          $6$ |    否    |
| $Q_8$    |          $8$ |    否    |
| $A_5$    |         $60$ |    否    |

几个小群的阶与交换性.
:::

:::figure{#fig:hom .invert-dark}
![群同态示意图](./homomorphism.png)

群同态 $\varphi\colon G \to H$. 透明背景的黑线图在深色模式下自动反色.
:::

:::figure[一段短视频 (3 秒).]{#fig:clip}
![示例视频](./test-clip.mp4)
:::

## 代码

```python
def zeta(s, terms=10_000):
    """Partial sum of the Riemann zeta function."""
    return sum(n ** -s for n in range(1, terms + 1))
```

## 长公式

$$
\left( \sum_{k=1}^{n} a_k b_k \right)^2 \le \left( \sum_{k=1}^{n} a_k^2 \right) \left( \sum_{k=1}^{n} b_k^2 \right) \quad \text{for all } a_1, \dots, a_n, b_1, \dots, b_n \in \R
$$

## 杂项

映射常写作 $f:X \to Y$ 或 $\phi:G\to H$. 正文里的冒号照常显示, 例如 std::vector 和 key:value.

[^gauss]: 这是 Gauss 积分, 可以用极坐标计算 $\left(\int e^{-x^2} dx\right)^2$.

[^numbering]: 和 amsthm 的 `\numberwithin{theorem}{section}` 相同.

[^amsthm]: 定理, 引理, 命题和推论共用一个计数器.

[^coset]: 左陪集是形如 $gH = \{ gh : h \in H \}$ 的子集. 两个左陪集要么相等, 要么不相交, 并且所有左陪集的并是 $G$. 每个陪集都与 $H$ 等势, 所以陪集的个数是 $\abs{G} / \abs{H}$.
