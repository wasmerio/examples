---
title: 为什么 Monge–Ampère 方程要求凸性
description: "Monge–Ampère 方程加上 Dirichlet 边界条件, 在二维就有一个凸解和一个凹解. 本文说明凸性为什么是选解的条件, 并用一个小实验说明: 普通 PINN 在 10 个随机种子下都收敛到凹解."
date: 2026-10-19
tags: [PDE, Monge–Ampère, PINN]
draft: false
ai: true
macros:
  bx: '\mathbf{x}'
  cof: '\operatorname{cof}'
---

## 引言 \label{sec:intro}

对 Poisson 方程 $\Delta u = f$, 给定有界区域上的 Dirichlet 边界条件, 解是唯一的. Monge–Ampère 方程

$$
\begin{equation}
  \det D^2 u(\bx) = f(\bx), \qquad \bx \in \Omega
  \label{eq:mae}
\end{equation}
$$

看上去也是一个二阶椭圆方程, 但它不是这样. 一方面, $\det$ 只看 Hessian 特征值的乘积, 看不到每个特征值的符号, 所以方程加上边界条件并不能确定解. 另一方面, 经典理论 \cite{figalli2017} 只在凸函数中找解, 在这个函数类中解是唯一的. 这对数值方法有直接的影响: 神经网络求解器 (PINN) 的损失通常只含方程残差和边界项, 损失本身不知道 "凸" 这个条件.

本文从三个方面说明这一点. 第 \ref{sec:example} 节给出一个有两个解的例子. 第 \ref{sec:why} 节说明凸性为什么是选解的条件: 它给出唯一性, 也给出椭圆性. 第 \ref{sec:pinn} 节用一个小实验说明, 普通 PINN 确实会收敛到错误的解, 而且损失很小.

## 一个有两个解的例子 \label{sec:example}

:::example[问题 1]{#ex:branches}
在单位圆盘 $\Omega = B_1 \subset \R^2$ 上考虑

$$
\det D^2 u = 1 \quad \text{in } B_1, \qquad u = \tfrac12 \quad \text{on } \partial B_1 .
$$

函数

$$
u_+(\bx) = \tfrac12 \abs{\bx}^2, \qquad u_-(\bx) = 1 - \tfrac12 \abs{\bx}^2
$$

的 Hessian 分别是 $I$ 和 $-I$, 行列式都是 $1$; 在单位圆周上它们都等于 $\tfrac12$. 所以两个函数都是解. $u_+$ 是一个碗, 凸; $u_-$ 是倒扣的碗, 凹.
:::

这个例子不是偶然的. 在二维, $\det D^2 u = f > 0$ 说明两个特征值 $\lambda_1, \lambda_2$ 的乘积为正, 所以它们同号: 要么都为正 ($u$ 沿每个方向向上弯), 要么都为负 (沿每个方向向下弯). 方程本身不区分这两种情形. 由 $\det D^2(-u) = (-1)^2 \det D^2 u$, 若 $u$ 是解, 则 $-u$ 也满足方程; 边界值是常数时, 再加一个常数就满足同样的边界条件. 例 \ref{ex:branches} 中 $u_- = 1 - u_+$ 就是这样得到的.

在三维及以上, 可能的情形更多. 特征值为 $(5, -1, -1)$ 的对称矩阵, 行列式为 $5 > 0$, 但它既不半正定, 也不半负定. 所以仅凭 $\det D^2 u = f$, 方程不能决定 $u$ 在每个方向上向哪边弯.

## 凸性为什么是选解的条件 \label{sec:why}

标准的做法是只在凸函数中找解. 由凸函数的二阶刻画, $C^2$ 函数 $u$ 在凸区域上凸, 当且仅当 $D^2 u \succeq 0$ 处处成立, 即沿每个方向都向上弯. 这个条件有两个作用: 一是给出唯一性, 二是给出椭圆性.

### 唯一性

:::theorem[Dirichlet 问题的凸解]{#thm:dirichlet}
(\cite[Theorem 2.14]{figalli2017}) 设 $\Omega \subset \R^d$ 是有界严格凸区域, $f \ge 0$, $f \in L^1(\Omega)$, $g \in C(\partial\Omega)$. 则存在唯一的函数 $u \in C(\overline{\Omega})$, 它在 $\Omega$ 内凸, 在 Alexandrov 意义下满足 $\det D^2 u = f$, 并且 $u = g$ 于 $\partial\Omega$.
:::

圆盘是严格凸的, 所以在凸函数中, 例 \ref{ex:branches} 只有一个解 $u_+$. 唯一性来自比较原理: 若两个凸函数在边界上 $u \le v$, 在内部 $\det D^2 u \ge \det D^2 v$, 则在整个区域上 $u \le v$ \cite[§2.4]{figalli2017}. 比较原理的背后是行列式在半正定矩阵上的单调性: $M \succeq N \succeq 0$ 推出 $\det M \ge \det N$. 离开半正定矩阵, 这个单调性就不成立了, 例如 $-I \succeq -2I$, 但二维时 $\det(-I) = 1 < 4 = \det(-2I)$.

### 椭圆性

文献中常说 Monge–Ampère 方程 "在凸函数上是椭圆的". 这句话可以用线性化来说清楚. 对 $u, v \in C^2(\Omega)$, 由行列式的导数公式 (Jacobi 公式)

$$
\frac{\mathrm{d}}{\mathrm{d}\varepsilon}\Big|_{\varepsilon=0} \det(A + \varepsilon B) = \tr\bigl(\cof(A)^{\top} B\bigr),
$$

其中 $\cof A$ 是 $A$ 的余子式矩阵, 我们得到方程在 $u$ 处的线性化

$$
\begin{equation}
  L_u v := \frac{\mathrm{d}}{\mathrm{d}t}\Big|_{t=0} \det D^2(u + tv) = \tr\bigl(\cof(D^2 u)\, D^2 v\bigr).
  \label{eq:linearized}
\end{equation}
$$

这是一个二阶线性算子, 系数矩阵为 $\cof(D^2 u)$. 它在点 $\bx$ 处椭圆, 当且仅当 $\cof(D^2 u(\bx)) \succ 0$.

:::proposition[凸性与线性化的椭圆性]{#prop:elliptic}
设 $u \in C^2(\Omega)$.

1. 若 $D^2 u(\bx) \succ 0$, 特征值为 $\lambda_1, \dots, \lambda_d$, 则 $\cof(D^2 u(\bx))$ 的特征值为 $\prod_{j \ne i} \lambda_j > 0$, 所以 $L_u$ 在 $\bx$ 处椭圆.
2. 若存在 $C \ge 1$, 使得 $C^{-1} I \preceq D^2 u \preceq C I$ 在 $\Omega$ 上成立, 则 $L_u$ 一致椭圆, 椭圆常数可取 $C^{1-d}$.
3. 若 $u$ 在凸区域 $\Omega$ 上凸, 则 $\cof(D^2 u) \succeq 0$.
:::

:::proof
(1) $A = D^2 u(\bx)$ 可逆时 $\cof(A)^{\top} = \det(A) A^{-1}$. 把 $A$ 对角化即得 $\cof A$ 的特征值为 $\det A / \lambda_i = \prod_{j \ne i} \lambda_j$. (2) 此时每个 $\lambda_j \in [C^{-1}, C]$, 由 (1), $\cof(D^2 u)$ 的最小特征值不小于 $C^{-(d-1)}$. (3) $D^2 u \succeq 0$, 所以对 $\varepsilon > 0$ 有 $D^2 u + \varepsilon I \succ 0$, 由 (1), $\cof(D^2 u + \varepsilon I) \succ 0$. $\cof$ 的每个元素是矩阵元素的多项式, 令 $\varepsilon \to 0^+$ 即可.
:::

二维时这个结论更直接. 对 $A = \begin{pmatrix} a & b \\ b & c \end{pmatrix}$, $\cof A = \begin{pmatrix} c & -b \\ -b & a \end{pmatrix}$, 它和 $A$ 的迹都是 $a + c$, 行列式都是 $ac - b^2$, 所以两者特征值相同. 也就是说, 二维时 $L_u$ 椭圆, 当且仅当 $D^2 u$ 正定. 回到例 \ref{ex:branches}:

- 在 $u_+$ 处, $D^2 u_+ = I$, $\cof I = I$, 所以 $L_{u_+} v = \Delta v$. 方程在 $u_+$ 附近像一个 Poisson 方程.
- 在 $u_-$ 处, $D^2 u_- = -I$, 二维时 $\cof(-I) = -I$, 所以 $L_{u_-} v = -\Delta v$. 系数矩阵负定, 在任何一点都不椭圆.
- 三维时若 $D^2 u(\bx)$ 的特征值为 $(5, -1, -1)$, 由命题 \ref{prop:elliptic} (1) 中的公式 (它对任何可逆对称矩阵成立), $\cof(D^2 u(\bx))$ 的特征值为 $(1, -5, -5)$, 不定. 此时无论乘以 $+1$ 还是 $-1$, $L_u$ 都不椭圆.

所以凸性的要求同时确定了椭圆性的符号. 需要注意的是, 命题 \ref{prop:elliptic} (3) 只给出半正定: 对一般的凸解, $D^2 u$ 可能在某些点退化或无界, 方程是退化椭圆的. 例如 $u(x, y) = \tfrac{1}{12} x^4 + \tfrac12 y^2$ 满足 $\det D^2 u = x^2$, 线性化为 $L_u v = v_{xx} + x^2 v_{yy}$, 在直线 $x = 0$ 上系数矩阵只是半正定. 一致椭圆需要命题 \ref{prop:elliptic} (2) 中 Hessian 的双侧界, 这是正则性理论的核心问题 \cite[§1.1]{figalli2017}.

## 普通 PINN 找到的是凹解 \label{sec:pinn}

上面的讨论对神经网络求解器有一个直接的推论. PINN 用网络 $u_\theta$ 表示解, 最小化

$$
\begin{align*}
  \mathcal{L}(\theta) &= \mathcal{L}_{\mathrm{res}}(\theta) + w_{bc}\, \mathcal{L}_{bc}(\theta), \\
  \mathcal{L}_{\mathrm{res}}(\theta) &= \frac{1}{N} \sum_{i=1}^{N} \bigl( \det D^2 u_\theta(\bx_i) - f(\bx_i) \bigr)^2, \\
  \mathcal{L}_{bc}(\theta) &= \frac{1}{M} \sum_{k=1}^{M} \bigl( u_\theta(\bx_k^{b}) - g(\bx_k^{b}) \bigr)^2,
\end{align*}
$$

其中 $\bx_i$ 是区域内部的配点, $\bx_k^b$ 是边界上的配点. 在例 \ref{ex:branches} 上, $u_+$ 和 $u_-$ 的损失都是零, 所以损失不区分两个解. 我们想知道, 实际训练时网络会落到哪一个解上.

### 实验设置

网络是 MLP $2 \to 32 \to 32 \to 1$, 激活函数为 tanh, 用 `float64` 计算. 优化器为 Adam, 学习率 $10^{-3}$, 训练 $2000$ 步; 每一步重新随机采 $500$ 个内部点和 $200$ 个边界点, $w_{bc} = 10$. Hessian 用 `torch.func` 自动求导精确计算. 训练后, 在 $2000$ 个新的随机点上测试. 然后在损失中加上迹罚项

$$
\frac{1}{N} \sum_{i=1}^{N} \min\bigl(0, \tr D^2 u_\theta(\bx_i)\bigr)^2,
$$

其他设置不变, 再训练一次. Nyström 和 Vestberg \cite{nystrom2023} 以及 Hacking 等 \cite{hacking2025} 用过这类罚项. 每种设置用 $10$ 个随机种子. 结果见表 \ref{tab:branch} 和图 \ref{fig:profiles}.

:::table{#tab:branch}
|           |                              最终损失 | $\max\abs{u_\theta - u_+}$ | $\max\abs{u_\theta - u_-}$ | $\min \lambda_{\min}(D^2 u_\theta)$ |  违反率 |
| :-------- | ------------------------------------: | -------------------------: | -------------------------: | ----------------------------------: | ------: |
| 普通 PINN | $2.1\times10^{-4}$ | $0.999$ | $0.0028$ | $-1.05$ | $100\%$ |
| 加迹罚项 | $7.5\times10^{-4}$ | $0.0046$ | $0.999$ | $0.88$ | $0\%$ |

例 \ref{ex:branches} 上 10 个随机种子的结果, 每格是 10 个种子的平均值. 违反率是测试点中 $\lambda_{\min}(D^2 u_\theta) < 0$ 的比例.
:::

:::figure{#fig:profiles .invert-dark}
![10 个种子训练出的网络在直线 x_2 = 0 上的取值](./profiles.svg)

10 个随机种子训练出的 $u_\theta$ 在直线 $x_2 = 0$ 上的取值. 每个种子是一条细线, 标记是 10 条曲线的中位数 (三角形: 普通 PINN; 圆点: 加迹罚项). 黑色实线是凸解 $u_+$, 橙色虚线是凹解 $u_-$. (a) 普通 PINN, 10 条曲线都和 $u_-$ 重合. (b) 加迹罚项, 10 条曲线都和 $u_+$ 重合.
:::

普通 PINN 在 10 个种子下全部收敛到凹解 $u_-$, 而且损失很小. 只看损失, 这些训练都是 "成功" 的. 加上迹罚项后, 10 个种子都收敛到凸解 $u_+$. 我们没有分析普通 PINN 为什么总是落到凹的一支上; 这个实验只说明, 选哪一支是由网络结构和优化过程决定的, 损失本身不做选择. 所以 Monge–Ampère 方程的神经求解器需要某种保证凸性的机制, 每次实验也需要检查凸性, 而不能只报告损失和残差.

### 迹罚项为什么有效, 以及它的局限

迹罚项在二维有效的原因是: $2 \times 2$ 对称矩阵半正定, 当且仅当 $\det \ge 0$ 并且 $\tr \ge 0$. 方程已经要求 $\det D^2 u = f > 0$, 所以只需再要求 $\tr D^2 u \ge 0$. 这和第 \ref{sec:example} 节的分析一致: 二维时特征值同号, 迹的符号就决定了是凸还是凹.

这个方法有两点局限. 它只适用于二维: 三维时特征值为 $(5, -1, -1)$ 的矩阵, 行列式和迹都为正, 但不半正定. 另外, 罚项只在配点上起作用, 不保证配点之间也凸. 另一种思路是让网络结构本身保证凸性, 例如输入凸神经网络 (ICNN) \cite{amos2017}: 只要层与层之间的权重非负, 激活函数凸且单调不减, 对任何参数, 输出都对输入凸. 代价是非负权重限制了表达能力, 训练也更难.

## 小结

Monge–Ampère 方程只规定了 Hessian 特征值的乘积, 不规定每个特征值的符号, 所以方程加上边界条件不能确定解. 凸性的要求选出了 Hessian 半正定的那一支: 在这一支上, 比较原理给出唯一性, 线性化 $\tr(\cof(D^2 u) D^2 v)$ 是 (退化) 椭圆的. 我们的小实验说明, 这不只是一个理论问题: 普通 PINN 在 10 个种子下都落到凹解上, 加上迹罚项后都落到凸解上. 这个实验只用了一个问题, 一个很小的网络和 2000 步训练, 我们也还没有解释普通 PINN 为什么偏向凹解. 三维以上怎样保证凸性, 以及怎样保证配点之间也凸, 是后面的文章要讨论的问题.
