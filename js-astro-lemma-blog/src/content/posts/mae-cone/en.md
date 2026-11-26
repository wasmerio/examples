---
title: One cone, two notions of solution
description: The cone has no Hessian at its vertex. In the Alexandrov sense it solves the Monge–Ampère equation with a point mass on the right-hand side; in the viscosity sense it solves the equation for no continuous right-hand side at all. This post derives the point mass from a smooth approximation and reports a small A100 experiment on what a pointwise-residual PINN makes of it.
date: 2026-10-20
tags: [PDE, Monge–Ampère, PINN]
draft: false
ai: true
macros:
  bx: '\mathbf{x}'
  bp: '\mathbf{p}'
  MA: '\mu'
---

## Introduction \label{sec:intro}

The [previous post](/en/posts/mae-convexity-branch/) asked why solutions of the Monge–Ampère equation

$$
\begin{equation}
  \det D^2 u(\bx) = f(\bx), \qquad \bx \in \Omega \subset \R^2,
\end{equation}
$$

are sought among convex functions. All solutions there were smooth, so $\det D^2 u$ could be evaluated point by point. This post looks at the simplest convex function that is not smooth, the cone

$$
u(\bx) = \abs{\bx}, \qquad \bx \in \R^2 .
$$

Away from the origin $u$ is smooth, its graph is a straight line in the radial direction, and $\det D^2 u(\bx) = 0$. At the origin $u$ is not differentiable and $D^2 u(0)$ does not exist. On the one hand, the cone satisfies $\det D^2 u = 0$ everywhere except at one point, and so does every constant function. On the other hand, the cone clearly bends at its vertex while a constant does not bend at all. So what should $\det D^2 u$ be at the origin? The answer depends on which notion of solution we use. The Monge–Ampère equation has two classical notions of weak solution, Alexandrov solutions and viscosity solutions \cite{figalli2017, gutierrez2016}, and for the cone they give different answers.

The rest of this post is organized as follows. Section \ref{sec:alexandrov} introduces the subgradient and the Monge–Ampère measure and proves that the Monge–Ampère measure of the cone is $\pi\delta_0$, so the cone is an Alexandrov solution of $\det D^2 u = \pi\delta_0$. Section \ref{sec:smooth} approximates the cone by smooth convex functions and shows how this point mass arises as the limit of measures with densities. Section \ref{sec:viscosity} introduces viscosity solutions and shows that the cone is not a viscosity solution of $\det D^2 u = f$ for any continuous $f$. Section \ref{sec:pinn} turns to neural network solvers: the residual loss of a PINN checks the equation only at collocation points, and we test what it does with the point mass.

## Subgradient and Monge–Ampère measure \label{sec:alexandrov}

### Subgradient

The cone has no tangent plane at the origin, but it has many planes that stay below its graph. The subgradient collects their slopes.

:::definition[Subgradient]{#def:subgradient}
Let $\Omega \subset \R^d$ be open and convex, $u\colon \Omega \to \R$ convex, and $\bx_0 \in \Omega$. The subgradient of $u$ at $\bx_0$ is the set

$$
\partial u(\bx_0) = \bigl\{ \bp \in \R^d :\ u(\bx) \ge u(\bx_0) + \bp \cdot (\bx - \bx_0) \ \text{for all}\ \bx \in \Omega \bigr\}.
$$

For $E \subset \Omega$ we write $\partial u(E) = \bigcup_{\bx \in E} \partial u(\bx)$.
:::

This is the definition of \cite[Definition 1.1.1]{gutierrez2016} and \cite[§A.4.1]{figalli2017}. If $u$ is differentiable at $\bx$, then $\partial u(\bx) = \set{\nabla u(\bx)}$ \cite[Lemma A.20]{figalli2017}, so the subgradient generalizes the gradient: it is a single point where $u$ is differentiable and a larger set at a kink.

For the cone, $\partial u(\bx) = \set{\bx/\abs{\bx}}$ for $\bx \ne 0$, a single point on the unit circle. At the origin the condition reads $\abs{\bx} \ge \bp\cdot\bx$ for all $\bx$. If $\abs{\bp} \le 1$, this follows from the Cauchy–Schwarz inequality, $\bp\cdot\bx \le \abs{\bp}\abs{\bx} \le \abs{\bx}$. If $\abs{\bp} > 1$, the choice $\bx = \bp$ gives $\abs{\bp} \ge \abs{\bp}^2$, a contradiction. Hence

$$
\partial u(0) = \set{\bp \in \R^2 : \abs{\bp} \le 1},
$$

the closed unit disk, of area $\pi$. Figure \ref{fig:subgradient} shows both cases.

:::figure{#fig:subgradient .invert-dark}
![Supporting lines and subgradient of the cone at its vertex](./cone-subgradient.svg)

(a) The section $\abs{x_1}$ of the cone along the line $x_2 = 0$ (thick black line). A supporting plane $\bp\cdot\bx$ with $\abs{\bp} \le 1$ restricts to $p_1 x_1$ on this line and stays below the graph (thin grey solid lines); the line with slope $1.6 > 1$ cuts through it (orange dashed line). (b) Slope space. The subgradient at the vertex is the closed unit disk (grey fill), of area $\pi$; the gradients $\bx/\abs{\bx}$ at all other points lie on the unit circle (thick black line), of area $0$.
:::

### Monge–Ampère measure

For a smooth convex function, $\det D^2 u$ is the area scaling factor of the gradient map $\bx \mapsto \nabla u(\bx)$: if $u \in C^2(\Omega)$ is convex, then

$$
\abs{\nabla u(E)} = \int_E \det D^2 u(\bx)\,\mathrm{d}\bx \qquad \text{for every Borel set}\ E \subset \Omega,
$$

where $\abs{\cdot}$ is Lebesgue measure \cite[Example 1.1.14]{gutierrez2016}. The left-hand side uses only the area of the image of the gradient map, not second derivatives. Alexandrov's idea is to replace the gradient by the subgradient, so that the left-hand side makes sense for every convex function.

:::definition[Monge–Ampère measure and Alexandrov solution]{#def:alexandrov}
Let $\Omega \subset \R^d$ be open and convex and $u\colon \Omega \to \R$ convex. For Borel sets $E \subset \Omega$ define

$$
\MA_u(E) = \abs{\partial u(E)} .
$$

$\MA_u$ is a nonnegative, locally finite Borel measure on $\Omega$, the Monge–Ampère measure of $u$ \cite[Definition 2.1, Theorem 2.3]{figalli2017}. Given a nonnegative, locally finite Borel measure $\nu$ on $\Omega$, $u$ is an Alexandrov solution of $\det D^2 u = \nu$ if $\MA_u = \nu$ \cite[Definition 2.5]{figalli2017}. If $\nu = f\,\mathrm{d}\bx$ with $f \ge 0$ and $f \in L^1_{\mathrm{loc}}(\Omega)$, we also call $u$ an Alexandrov solution of $\det D^2 u = f$.
:::

By the area formula above, $\MA_u$ has density $\det D^2 u$ when $u$ is smooth. The point of Definition \ref{def:alexandrov} is that the right-hand side $\nu$ may be a general measure, point masses included.

:::proposition[Monge–Ampère measure of the cone]{#prop:cone}
Let $u(\bx) = \abs{\bx}$ on $\Omega = \R^2$. Then $\MA_u = \pi\delta_0$, that is, the cone is an Alexandrov solution of $\det D^2 u = \pi\delta_0$.
:::

:::proof
Let $E \subset \R^2$ be a Borel set. If $0 \notin E$, the subgradient at every point of $E$ is a single point on the unit circle, so $\partial u(E)$ lies in the unit circle, has area $0$, and $\MA_u(E) = 0$. If $0 \in E$, then $\partial u(E)$ contains the closed unit disk $\partial u(0)$ and is contained in the union of the disk and the circle, which is the closed disk itself; so $\MA_u(E) = \pi$. Together, $\MA_u(E) = \pi\,\delta_0(E)$.
:::

More generally, $u = M\abs{\bx}$ in $d$ dimensions has $\MA_u = M^d\abs{B_1}\,\delta_0$ \cite[Example 2.2]{figalli2017}. Proposition \ref{prop:cone} says that all the bending of the cone sits at the vertex and has total amount $\pi$. Pointwise this amount is invisible: $\det D^2 u = 0$ away from the origin, and the origin has zero area.

The point mass also pins down the boundary value problem. On the unit disk $B_1$, the function $\abs{\bx} - 1$ is convex, vanishes on $\partial B_1$, and has Monge–Ampère measure $\pi\delta_0$. By existence and uniqueness for the Dirichlet problem \cite[Theorem 2.13, Corollary 2.11]{figalli2017}, it is the only convex function on $B_1$ with $\MA_u = \pi\delta_0$ and zero boundary values. In the same way, $u \equiv 0$ is the only convex function with $\MA_u = 0$ and zero boundary values. If we only ask for "$\det D^2 u = 0$ at every point but one", however, every convex function $c(\abs{\bx} - 1)$ with $c \ge 0$ qualifies, all with zero boundary values. So "the equation holds almost everywhere" is not a usable notion of solution: it does not determine the solution. Since $\MA_{\lambda u} = \lambda^2\MA_u$ in two dimensions \cite[Lemma 2.9]{figalli2017}, these functions have Monge–Ampère measures $c^2\pi\delta_0$, and the Alexandrov definition tells them apart.

## Smooth approximation: where the point mass comes from \label{sec:smooth}

On $\R^2$ take

$$
u_\varepsilon(\bx) = \sqrt{\varepsilon^2 + \abs{\bx}^2}, \qquad \varepsilon > 0 .
$$

$u_\varepsilon$ is $C^\infty$ and $0 \le u_\varepsilon(\bx) - \abs{\bx} \le \varepsilon$, so $u_\varepsilon$ converges uniformly to the cone as $\varepsilon \to 0$. With $s = \varepsilon^2 + x_1^2 + x_2^2$, a direct computation gives $\partial_{11}u_\varepsilon = (\varepsilon^2 + x_2^2)s^{-3/2}$, $\partial_{22}u_\varepsilon = (\varepsilon^2 + x_1^2)s^{-3/2}$ and $\partial_{12}u_\varepsilon = -x_1x_2 s^{-3/2}$, hence

$$
\begin{equation}
  f_\varepsilon(\bx) := \det D^2 u_\varepsilon(\bx) = \frac{(\varepsilon^2 + x_2^2)(\varepsilon^2 + x_1^2) - x_1^2x_2^2}{s^3} = \frac{\varepsilon^2}{(\varepsilon^2 + \abs{\bx}^2)^2} .
  \label{eq:feps}
\end{equation}
$$

Since $\partial_{11}u_\varepsilon > 0$ and $\det D^2 u_\varepsilon > 0$, we have $D^2 u_\varepsilon \succ 0$ and $u_\varepsilon$ is convex. In polar coordinates the mass in the disk $B_r$ is

$$
\int_{B_r} f_\varepsilon\,\mathrm{d}\bx = 2\pi\int_0^r \frac{\varepsilon^2\rho}{(\varepsilon^2 + \rho^2)^2}\,\mathrm{d}\rho = \frac{\pi r^2}{\varepsilon^2 + r^2} .
$$

Letting $r \to \infty$, the total mass over the plane is $\pi$ for every $\varepsilon$; with $r = 1$, the mass over the unit disk is $\pi/(1+\varepsilon^2)$. With $r = \varepsilon$ we get $\pi/2$: half of the mass lies in a disk of radius $\varepsilon$, whose area is a fraction $\varepsilon^2$ of the unit disk. Besides, the peak value $f_\varepsilon(0) = \varepsilon^{-2}$ blows up as $\varepsilon \to 0$. Figure \ref{fig:density} shows the radial profile of $f_\varepsilon$ and the cumulative mass.

:::figure{#fig:density .invert-dark}
![Monge–Ampère density and cumulative mass of the smoothed cone](./density.svg)

(a) $f_\varepsilon = \det D^2 u_\varepsilon$ along a ray. Black lines: formula \eqref{eq:feps}, solid for $\varepsilon = 0.1$, dashed for $\varepsilon = 0.03$ and dotted for $\varepsilon = 0.01$, in both panels. Grey dots: values computed by automatic differentiation (`torch.func.hessian`) on the remote server. (b) Cumulative mass $r^2/(\varepsilon^2 + r^2)$; the open diamonds on the grey dotted line at $1/2$ mark half of the mass at $r = \varepsilon$.
:::

So the mass stays fixed and concentrates at the origin. The precise statement is weak$^*$ convergence of measures. For a continuous function $\varphi$ with compact support, the substitution $\bx = \varepsilon\mathbf{y}$ gives

$$
\int_{\R^2}\varphi\,f_\varepsilon\,\mathrm{d}\bx = \int_{\R^2}\varphi(\varepsilon\mathbf{y})\,\frac{\mathrm{d}\mathbf{y}}{(1+\abs{\mathbf{y}}^2)^2} \;\longrightarrow\; \varphi(0)\int_{\R^2}\frac{\mathrm{d}\mathbf{y}}{(1+\abs{\mathbf{y}}^2)^2} = \pi\,\varphi(0),
$$

where the limit follows from dominated convergence with the dominating function $\max\abs{\varphi}\,(1+\abs{\mathbf{y}}^2)^{-2}$. Hence $f_\varepsilon\,\mathrm{d}\bx$ converges weakly$^*$ to $\pi\delta_0$. This agrees with the stability of Alexandrov solutions.

:::proposition[Stability of the Monge–Ampère measure]{#prop:stability}
(\cite[Proposition 2.6]{figalli2017}) Let convex functions $u_k$ converge locally uniformly on an open set $\Omega$ to a convex function $u$. Then $\MA_{u_k}$ converges weakly$^*$ to $\MA_u$, that is, $\int_\Omega\varphi\,\mathrm{d}\MA_{u_k} \to \int_\Omega\varphi\,\mathrm{d}\MA_u$ for every $\varphi \in C_c(\Omega)$.
:::

With Propositions \ref{prop:cone} and \ref{prop:stability}, the limit $\pi\delta_0$ is known without the computation above. Weak$^*$ convergence is not convergence on every set, though: $\MA_{u_\varepsilon}(\set{0}) = 0$ because $\MA_{u_\varepsilon}$ has a density and a point has zero area, while $\MA_u(\set{0}) = \pi$. This is where numerical methods have to be careful. The Hessian determinant of an approximate solution is finite at every point, and its mass can still concentrate in a smaller and smaller region.

## Viscosity solutions: touching with smooth functions \label{sec:viscosity}

The second notion of weak solution comes from the general theory of fully nonlinear equations \cite{crandall1992}. Since $u$ has no second derivatives, we touch $u$ from above or from below by a smooth test function and check the equation on the test function instead.

:::definition[Viscosity solution]{#def:viscosity}
(\cite[Definition 1.3.1]{gutierrez2016}) Let $u \in C(\Omega)$ be convex and $f \in C(\Omega)$, $f \ge 0$. $u$ is a viscosity subsolution of $\det D^2 u = f$ if, whenever a convex $\varphi \in C^2(\Omega)$ and $\bx_0 \in \Omega$ are such that $u - \varphi$ has a local maximum at $\bx_0$, we have $\det D^2\varphi(\bx_0) \ge f(\bx_0)$. It is a viscosity supersolution if, whenever $u - \varphi$ has a local minimum at $\bx_0$, we have $\det D^2\varphi(\bx_0) \le f(\bx_0)$. A viscosity solution is both.
:::

All second derivatives in the definition fall on $\varphi$, so it makes sense for nondifferentiable $u$. A smooth convex solution satisfies both conditions: if $\varphi$ touches $u$ from above at $\bx_0$, then $D^2\varphi(\bx_0) \succeq D^2u(\bx_0) \succeq 0$, and since the determinant is monotone on positive semidefinite matrices, $\det D^2\varphi(\bx_0) \ge \det D^2u(\bx_0)$; touching from below is the same. Viscosity solutions are defined by these two necessary conditions. It also compares $\det D^2\varphi(\bx_0)$ with $f(\bx_0)$, so $f$ must have a value at every point; this is why $f$ is continuous. A point mass $\pi\delta_0$ is not a function, so "viscosity solution of $\det D^2u = \pi\delta_0$" has no meaning.

:::proposition[The cone is not a viscosity solution]{#prop:cone-visc}
Let $u(\bx) = \abs{\bx}$ on $\Omega = \R^2$.

1. For every $f \in C(\R^2)$ with $f \ge 0$, $u$ is not a viscosity supersolution of $\det D^2u = f$.
2. If $f(\bx_0) > 0$ for some $\bx_0 \ne 0$, then $u$ is not a viscosity subsolution of $\det D^2u = f$. In particular, $u$ is neither a viscosity subsolution nor a viscosity supersolution of $\det D^2u = 1$.
:::

:::proof
(1) For $c > 0$, the convex function $\psi(\bx) = c\abs{\bx}^2$ satisfies $(u-\psi)(\bx) = \abs{\bx}(1 - c\abs{\bx}) \ge 0 = (u-\psi)(0)$ for $\abs{\bx} \le 1/c$, so $u - \psi$ has a local minimum at the origin. But $\det D^2\psi = 4c^2$, which exceeds $f(0)$ for $c$ large, and the supersolution condition fails.

(2) Let $r = \abs{\bx_0}$, $\mathbf{e} = \bx_0/r$, and let $\mathbf{e}^\perp$ be a unit vector orthogonal to $\mathbf{e}$. Near $\bx_0$, $u$ is smooth with $\nabla u(\bx_0) = \mathbf{e}$ and $D^2u(\bx_0) = \tfrac1r\mathbf{e}^\perp\mathbf{e}^{\perp\top}$. For $\delta > 0$ let

$$
\varphi(\bx) = r + \mathbf{e}\cdot(\bx-\bx_0) + \tfrac{\delta}{2}\bigl(\mathbf{e}\cdot(\bx-\bx_0)\bigr)^2 + \tfrac12\bigl(\tfrac1r + \delta\bigr)\bigl(\mathbf{e}^\perp\cdot(\bx-\bx_0)\bigr)^2 .
$$

$\varphi$ is a convex quadratic with $\varphi(\bx_0) = u(\bx_0)$, $\nabla\varphi(\bx_0) = \nabla u(\bx_0)$ and $D^2(\varphi - u)(\bx_0) = \delta I \succ 0$, so $u - \varphi$ has a local maximum at $\bx_0$. But $\det D^2\varphi(\bx_0) = \delta(\tfrac1r + \delta)$, which is below $f(\bx_0)$ for $\delta$ small, and the subsolution condition fails.
:::

Part (1) says that the viscosity definition does see the bending at the vertex: test functions touching the cone from below can bend as much as they like, their Hessian determinants have no upper bound, and no finite value $f(0)$ is enough. Conversely, the cone is a viscosity subsolution of $\det D^2u = 0$. At $\bx_0 \ne 0$ every convex test function has $\det D^2\varphi(\bx_0) \ge 0$. At the origin no $C^2$ function touches the cone from above: if $u - \varphi$ had a local maximum at $0$, then $\varphi(t\mathbf{e}) - \varphi(0) \ge \abs{t}$ for every unit vector $\mathbf{e}$ and small $t$, and $t \to 0^\pm$ would give both $\nabla\varphi(0)\cdot\mathbf{e} \ge 1$ and $-\nabla\varphi(0)\cdot\mathbf{e} \ge 1$. So for $\det D^2u = 0$ the cone passes the subsolution test and fails the supersolution test: it bends too much.

## What a PINN sees \label{sec:pinn}

A PINN represents the solution by a network $u_\theta$ and minimizes, over interior collocation points $\bx_i$ and boundary points $\bx_k^b$,

$$
\begin{align*}
  \mathcal{L}(\theta) &= \frac{1}{N} \sum_{i=1}^{N} \bigl( \det D^2 u_\theta(\bx_i) - f(\bx_i) \bigr)^2 + \frac{w_{bc}}{M} \sum_{k=1}^{M} u_\theta(\bx_k^b)^2 .
\end{align*}
$$

The loss uses $f$ only through its values at the collocation points, so it tests the equation in the pointwise sense discussed at the end of Section \ref{sec:alexandrov}. For the right-hand side $\pi\delta_0$ this loss cannot be written down directly, since $\delta_0$ has no value at the origin. If we use its value $0$ away from the origin, then, because with probability one no collocation point is the origin, the $f$ in the loss is $f \equiv 0$. What can be written down is the smoothed problem

$$
\det D^2 u = f_\varepsilon \quad \text{in } B_1, \qquad u = 0 \quad \text{on } \partial B_1,
$$

with $f_\varepsilon$ from \eqref{eq:feps}. Its unique convex solution is $v_\varepsilon(\bx) = \sqrt{\varepsilon^2 + \abs{\bx}^2} - \sqrt{\varepsilon^2 + 1}$, and $-v_\varepsilon$ is a concave solution. As $\varepsilon \to 0$, $f_\varepsilon\,\mathrm{d}\bx$ converges weakly$^*$ to $\pi\delta_0$ and $v_\varepsilon$ converges uniformly to $\abs{\bx} - 1$. The question is whether the pointwise residual still sees this mass as $\varepsilon$ shrinks. All computations ran on a remote server; code and raw results are at [TODO: repository link].

### How much mass the collocation points see

Before training anything, we look at the collocation points alone. We draw $N$ uniform points in the unit disk and estimate the total mass $\int_{B_1} f_\varepsilon = \pi/(1+\varepsilon^2)$ by $\pi\cdot\frac1N\sum_i f_\varepsilon(\bx_i)$. This Monte Carlo estimate is unbiased, but its variance is governed by $\int_{B_1} f_\varepsilon^2\,\mathrm{d}\bx = \frac{\pi}{3\varepsilon^2}\bigl(1 - \frac{\varepsilon^6}{(1+\varepsilon^2)^3}\bigr)$, which blows up as $\varepsilon \to 0$. About half of the mass lies in $B_\varepsilon$, the expected number of points in $B_\varepsilon$ is only $N\varepsilon^2$, and the probability that no point lands there is $(1-\varepsilon^2)^N$. Table \ref{tab:sampling} reports statistics over $1000$ random seeds.

:::table{#tab:sampling}
| $\varepsilon$ | $N$ | $N\varepsilon^2$ | fraction with no point in $B_\varepsilon$ | $(1-\varepsilon^2)^N$ | median estimate | 10% and 90% quantiles | exact |
| --: | --: | --: | --: | --: | --: | --: | --: |
| $0.1$ | $1000$ | $10$ | $0$ | $4.3\times10^{-5}$ | $3.07$ | $2.38$, $3.86$ | $3.110$ |
| $0.1$ | $4000$ | $40$ | $0$ | $3.5\times10^{-18}$ | $3.09$ | $2.74$, $3.47$ | $3.110$ |
| $0.1$ | $16000$ | $160$ | $0$ | $1.5\times10^{-70}$ | $3.10$ | $2.92$, $3.30$ | $3.110$ |
| $0.03$ | $1000$ | $0.9$ | $0.421$ | $0.406$ | $2.76$ | $1.07$, $5.64$ | $3.139$ |
| $0.03$ | $4000$ | $3.6$ | $0.038$ | $0.027$ | $2.98$ | $2.00$, $4.47$ | $3.139$ |
| $0.03$ | $16000$ | $14.4$ | $0$ | $5.5\times10^{-7}$ | $3.11$ | $2.51$, $3.75$ | $3.139$ |
| $0.01$ | $1000$ | $0.1$ | $0.904$ | $0.905$ | $0.88$ | $0.18$, $9.23$ | $3.141$ |
| $0.01$ | $4000$ | $0.4$ | $0.673$ | $0.670$ | $2.06$ | $0.61$, $7.03$ | $3.141$ |
| $0.01$ | $16000$ | $1.6$ | $0.213$ | $0.202$ | $2.95$ | $1.35$, $4.81$ | $3.141$ |

Monte Carlo estimates of the total mass $\int_{B_1} f_\varepsilon$ from uniform collocation points, $1000$ random seeds per row. Column 4 is measured, column 5 is the exact probability.
:::

For $\varepsilon = 0.01$ and $N = 1000$, $90\%$ of the point sets have no point in $B_\varepsilon$, and the median estimate is $0.88$, less than a third of the exact value. At the same time, $10\%$ of the point sets give estimates above $9.2$, because a single point near the origin contributes a value of order $\varepsilon^{-2} = 10^4$. The mean over the $1000$ seeds is $3.14$, as unbiasedness requires, but a single draw is almost always far off. So the pointwise residual does not miss the point mass on average. Most point sets miss it completely, and the few that catch it see one or two huge values. Training uses one such point set.

### Training setup

The network is the same as in the previous post: an MLP $2 \to 32 \to 32 \to 1$ with tanh activations in `float64`. The $N \in \set{1000, 4000, 16000}$ interior points are drawn once before training and kept fixed. Sampling is the same as in Table \ref{tab:sampling}, with seeds $0$ to $9$, so a given seed uses the same point set for every $\varepsilon$. We take $M = 200$ equispaced boundary points and $w_{bc} = 10$, and train with full-batch Adam, learning rate $10^{-3}$, for $5000$ steps. Hessians are computed exactly with `torch.func.hessian`. We use $\varepsilon \in \set{0.1, 0.03, 0.01}$ and, in addition, $f \equiv 0$, which is what a pointwise residual makes of $\pi\delta_0$. All $24$ settings (including the trace-penalty runs below) ran in parallel on one A100, at $122$ to $236$ seconds per seed.

After training we test on $20000$ fresh random points (seed $12345$) and on $801$ points of the line $x_2 = 0$, the origin included. Because of the branch issue from the previous post, the network may land near the convex solution $v_\varepsilon$ or the concave one $-v_\varepsilon$, so we report the error

$$
e = \min\bigl( \max\abs{u_\theta - v_\varepsilon},\ \max\abs{u_\theta + v_\varepsilon} \bigr).
$$

For the vanilla PINN, in every setting with $\varepsilon > 0$, $6$ seeds ended closer to the convex solution and $4$ closer to the concave one. We also compute the mass captured by the network, $\int_{B_1}\det D^2u_\theta\,\mathrm{d}\bx$, by polar quadrature: $[0,1]$ in the radius is split at $0, 10^{-4}, 10^{-3}, 3\times10^{-3}, 10^{-2}, 3\times10^{-2}, 0.1, 0.3, 1$ with $16$ Gauss–Legendre nodes per piece, and the angle uses $64$ equispaced nodes. We compare it with $\int_{B_1} f_\varepsilon = \pi/(1+\varepsilon^2)$. This quantity does not depend on the branch, since $\det D^2(-u) = \det D^2 u$ in two dimensions.

### Results

:::table{#tab:pinn}
| $\varepsilon$ | $N$ | $N\varepsilon^2$ | seeds with a point in $B_\varepsilon$ | final loss | captured mass | exact mass | error $e$ |
| --: | --: | --: | --: | --: | --: | --: | --: |
| $0.1$ | $1000$ | $10$ | $10$ | $3.3\times10^{-2}$ | $2.97$ $[2.92, 3.10]$ | $3.110$ | $0.041$ $[0.014, 0.074]$ |
| $0.1$ | $4000$ | $40$ | $10$ | $3.6\times10^{-2}$ | $3.02$ $[2.72, 3.06]$ | $3.110$ | $0.037$ $[0.022, 0.101]$ |
| $0.1$ | $16000$ | $160$ | $10$ | $3.0\times10^{-2}$ | $3.01$ $[2.74, 3.05]$ | $3.110$ | $0.041$ $[0.022, 0.101]$ |
| $0.03$ | $1000$ | $0.9$ | $6$ | $1.4\times10^{-1}$ | $2.20$ $[1.29, 5.17]$ | $3.139$ | $0.150$ $[0.056, 0.341]$ |
| $0.03$ | $4000$ | $3.6$ | $10$ | $1.1$ | $2.56$ $[1.35, 2.99]$ | $3.139$ | $0.133$ $[0.100, 0.293]$ |
| $0.03$ | $16000$ | $14.4$ | $10$ | $1.9$ | $2.50$ $[2.40, 2.64]$ | $3.139$ | $0.140$ $[0.100, 0.214]$ |
| $0.01$ | $1000$ | $0.1$ | $1$ | $1.9\times10^{-2}$ | $0.83$ $[0.19, 3.30]$ | $3.141$ | $0.542$ $[0.132, 1.202]$ |
| $0.01$ | $4000$ | $0.4$ | $4$ | $3.2$ | $0.94$ $[-0.55, 3.64]$ | $3.141$ | $0.416$ $[0.160, 1.011]$ |
| $0.01$ | $16000$ | $1.6$ | $8$ | $9.3$ | $1.36$ $[-0.71, 2.62]$ | $3.141$ | $0.264$ $[0.098, 0.906]$ |
| $f \equiv 0$ | $1000$ | | $0$ | $1.8\times10^{-7}$ | $0.00$ | ($\pi\delta_0$: $\pi$) | $0.993$ $[0.990, 0.997]$ |
| $f \equiv 0$ | $4000$ | | $0$ | $1.7\times10^{-7}$ | $0.00$ | ($\pi\delta_0$: $\pi$) | $0.993$ $[0.990, 0.998]$ |
| $f \equiv 0$ | $16000$ | | $0$ | $1.8\times10^{-7}$ | $0.00$ | ($\pi\delta_0$: $\pi$) | $0.993$ $[0.990, 0.998]$ |

Vanilla PINN (no trace penalty), $10$ seeds per row. Final loss: median. Captured mass and error: median, with minimum and maximum in brackets. For $f \equiv 0$ the error $e$ is measured against the cone $\abs{\bx} - 1$ and its negative.
:::

:::figure{#fig:pinn-mass .invert-dark}
![Captured mass against the number of collocation points](./pinn-mass.svg)

Mass captured by the network, $\int_{B_1}\det D^2u_\theta$, divided by the exact mass (black line at $1$). One marker per run, $10$ seeds for each pair $(\varepsilon, N)$, with a small random horizontal offset for readability. Circles: $\varepsilon = 0.1$; squares: $\varepsilon = 0.03$; triangles: $\varepsilon = 0.01$. Filled markers: the seed's point set has at least one point in $B_\varepsilon$; open markers: none. (a) Vanilla PINN (green). (b) With the trace penalty of the previous post (blue).
:::

:::figure{#fig:pinn-profiles .invert-dark}
![Network values on the line x_2 = 0](./pinn-profiles.svg)

$u_\theta$ of the vanilla PINN for $N = 4000$. Each thin green line is one of $10$ seeds; the green triangles mark their median. Results closer to the concave solution are multiplied by $-1$. (a) $\varepsilon = 0.03$. (b) $\varepsilon = 0.01$. The black solid line in (a) and (b) is the exact convex solution $v_\varepsilon$. (c) $f \equiv 0$; the black dotted line is $\abs{\bx} - 1$, the unique convex solution for the right-hand side $\pi\delta_0$.
:::

Table \ref{tab:pinn} and Figures \ref{fig:pinn-mass} and \ref{fig:pinn-profiles} show the results. We observe three things.

First, for $f \equiv 0$ all $30$ runs over the three values of $N$ give $\max\abs{u_\theta} \le 0.011$ (at most $0.012$ for the $30$ trace-penalty runs), with final loss at most $2.6\times10^{-4}$, while $\max\abs{u_\theta - (\abs{\bx} - 1)}$ lies between $0.990$ and $1.010$. The network finds $u \equiv 0$, the Alexandrov solution with $\MA_u = 0$ and zero boundary values, and not the cone, which is the solution for the right-hand side $\pi\delta_0$. Judged by the loss alone, every one of these runs is a success.

Second, for $\varepsilon = 0.01$ and $N = 1000$, only the point set of seed $8$ has a point in $B_\varepsilon$. The other $9$ seeds end with losses between $0.0020$ and $0.18$, the same order as for $\varepsilon = 0.1$ and $N = 1000$ ($0.011$ to $0.083$), but they capture a mass of only $0.19$ to $2.91$, and their errors $e$ lie between $0.13$ and $0.74$. The seed with the smallest loss, seed $3$ ($0.0020$), captures the least mass ($0.19$) and has the largest error ($0.74$). Seed $8$, the only one with a point in $B_\varepsilon$, fails in a different way, with loss $13.1$ and error $1.20$. In this setting the size of the loss says little about the quality of the solution.

Third, more collocation points help, but only up to a point. For $\varepsilon = 0.01$, going from $N = 1000$ to $N = 16000$ raises the number of seeds with a point in $B_\varepsilon$ from $1$ to $8$, the median captured mass from $0.83$ to $1.36$, and lowers the median error from $0.54$ to $0.26$. At the same time the median loss grows from $0.019$ to $9.3$: $f_\varepsilon$ is very large at the few points inside $B_\varepsilon$, the network cannot fit them, and training becomes erratic. Some seeds even capture a negative mass, which means $\det D^2u_\theta < 0$ on part of the disk and $u_\theta$ is neither convex nor concave there. Besides, for $\varepsilon = 0.03$ and $N = 16000$ every seed has $11$ to $20$ points in $B_\varepsilon$, yet the captured mass is only $76\%$ to $84\%$ of the exact value ($2.40$ to $2.64$) and the loss stays between $1.1$ and $3.0$. So sampling is not the only cause: this small network, trained for $5000$ steps, cannot fit a peak of width $0.03$ and height $\varepsilon^{-2} \approx 1111$. We did not try larger networks, longer training or adaptive sampling, so we cannot say how much this second cause contributes.

With the trace penalty the conclusions are the same (Figure \ref{fig:pinn-mass} (b)). For $\varepsilon = 0.1$ it suppresses the concave branch but does not secure the convex solution: $4$ seeds for each $N$ (seeds $0$, $6$, $7$ and $8$, exactly those that reach the concave solution without the penalty) stop at a loss above $1$, capturing a mass of only $0.20$ to $0.67$, with $u_\theta(0)$ between $0.43$ and $0.65$, far from both $v_\varepsilon(0) \approx -0.905$ (convex) and $0.905$ (concave).

## Summary \label{sec:summary}

The two notions of weak solution ask different things of the right-hand side. The following theorem says when they agree.

:::theorem[Alexandrov and viscosity solutions]{#thm:equiv}
Let $\Omega \subset \R^d$ be open and convex and $u \in C(\Omega)$ convex.

1. (\cite[Proposition 1.3.4]{gutierrez2016}) Let $f \in C(\Omega)$, $f \ge 0$. If $u$ is an Alexandrov solution of $\det D^2u = f$, then $u$ is a viscosity solution of $\det D^2u = f$.
2. (\cite[Proposition 1.7.1]{gutierrez2016}) Let $f \in C(\overline{\Omega})$ with $f > 0$ on $\overline{\Omega}$. If $u$ is a viscosity solution of $\det D^2u = f$ in $\Omega$, then $u$ is an Alexandrov solution of $\det D^2u = f$ in $\Omega$.
:::

The two directions need different hypotheses: (1) only needs $f$ continuous, while (2) also needs $f$ positive up to the boundary. Both need a continuous right-hand side, so that $\MA_u = f\,\mathrm{d}\bx$ is absolutely continuous with respect to Lebesgue measure. The cone fails on both sides. $\MA_u = \pi\delta_0$ gives positive mass to the null set $\set{0}$, so it is not of the form $f\,\mathrm{d}\bx$ for any $f \in L^1_{\mathrm{loc}}$ and the theorem does not apply; and by Proposition \ref{prop:cone-visc} the cone is not a viscosity solution for any continuous right-hand side. Table \ref{tab:notions} puts the three answers side by side.

:::table{#tab:notions}
| notion of solution | meaning of the equation | the cone $\abs{\bx}$ |
| :-- | :-- | :-- |
| pointwise (a.e.) | $\det D^2u(\bx) = f(\bx)$ for almost every $\bx$ | satisfies $\det D^2u = 0$; so do $c(\abs{\bx}-1)$, $c \ge 0$, and constants, so the solution is not unique |
| Alexandrov | $\MA_u(E) = \nu(E)$ for every Borel set $E$ | solves $\det D^2u = \pi\delta_0$; unique on $B_1$ once the boundary values are given |
| viscosity | convex $C^2$ test functions satisfy an inequality at touching points, $f$ continuous | solves the equation for no continuous $f$; a subsolution but not a supersolution of $\det D^2u = 0$ |

One function, three answers.
:::

The residual loss of a PINN tests the first row of Table \ref{tab:notions}, and the experiment shows what follows from that. With $f \equiv 0$ the network converged to $u \equiv 0$ in all $60$ runs, with a tiny loss and a distance of about $1$ from the cone. With the smoothed right-hand side at $\varepsilon = 0.01$ and $N \le 4000$, most uniform point sets have no point in $B_\varepsilon$ and so miss about half of the mass, and a smaller loss can even mean a worse solution. The experiment used one small network, fixed uniform collocation points and $5000$ Adam steps, and it does not separate the effect of sampling from that of the network's capacity. For right-hand sides with a point mass, or close to one, a natural direction is a loss that compares measures directly, for example the area of the image of the gradient map as in the Alexandrov definition, or collocation points refined near the origin. We will come back to this in a later post.
