---
title: "Paper reading: Solving the Dirichlet problem for the Monge–Ampère equation using neural networks"
description: "A close reading of Nyström and Vestberg: two ansatzes (a penalized MLP and an input convex neural network), an a posteriori error estimate built on the stability of Alexandrov solutions, and every experiment from two to five dimensions, together with the questions they leave open."
date: 2026-10-20
tags: [PDE, Monge–Ampère, PINN]
draft: false
ai: true
macros:
  diam: '\operatorname{diam}'
  Lip: '\operatorname{Lip}'
  adj: '\operatorname{adj}'
---

## Introduction \label{sec:intro}

This post is a close reading of the paper by Nyström and Vestberg \cite{nystrom2023}. The paper solves the Dirichlet problem for the Monge–Ampère equation,

$$
\begin{equation}
  \det D^2 u = f \quad \text{in } \Omega, \qquad u = g \quad \text{on } \partial\Omega,
  \label{eq:dirichlet}
\end{equation}
$$

where $\Omega \subset \R^n$ is a bounded open convex set, $f \ge 0$ is locally integrable and $g$ is continuous (their (1.1), p. 2). The authors state on p. 2 that, according to their literature review in Section 2.2, there seems to be no earlier work that solves the Monge–Ampère equation with neural networks.

The problem is hard for two reasons. On the one hand, $\det D^2 u$ is fully nonlinear, so neural network methods for linear PDEs do not carry over directly. On the other hand, \eqref{eq:dirichlet} usually has more than one solution: in two dimensions Rellich's theorem only says that there are at most two, and when $n$ is even and $g = 0$, every convex solution $u$ comes with the concave solution $-u$ (p. 2). Applications need the unique convex solution, so a numerical method has to make sure it picks that one. We discussed this in [the previous post](../mae-convexity-branch/): a loss made only of the residual and a boundary term cannot tell the convex solution from the concave one, and in the experiment there a vanilla PINN ended up on the concave one for all 10 random seeds.

The paper answers with two ansatzes that aim at convexity. The first is a standard multilayer perceptron (MLP) with a loss term that penalizes non-convexity; it essentially only works in two dimensions. The second is an input convex neural network (ICNN) \cite{amos2017}, whose architecture makes it convex in its input, in any dimension. Most of the paper is about the second. The rest of this post is organized as follows. Section \ref{sec:background} collects the theory the paper relies on. Section \ref{sec:method} describes both methods and how they are trained. Section \ref{sec:stability} presents the stability result and the a posteriori error estimate derived from it. Section \ref{sec:experiments} goes through the experiments one by one, and Section \ref{sec:discussion} discusses what they show and what they do not.

We read arXiv version v3 (13 June 2023); the journal version appeared in *Journal of Computational Mathematics and Data Science*, volume 8. All page, equation, figure and table numbers below refer to arXiv v3.

## Background \label{sec:background}

For a convex function $v$ that need not be smooth, the paper follows Figalli \cite{figalli2017} and defines the Monge–Ampère measure $Mv(E) := \abs{\partial v(E)}$, where $\partial v(E)$ is the set of subgradients of $v$ at points of $E$ and $\abs{\cdot}$ is Lebesgue measure. For $v \in C^2$, $Mv = \det D^2 v \, dx$. A convex function $u$ is an Alexandrov solution of $\det D^2 u = \mu$ if $Mu = \mu$ (their Definition 2.1). Two results are used later.

:::theorem[Comparison principle]{#thm:comparison}
(Their Theorem 2.2, from \cite[Theorem 2.10]{figalli2017}.) Let $u, v$ be convex on a bounded domain $\Omega$ with $u \le v$ on $\partial\Omega$. If $Mu \ge Mv$ in $\Omega$, then $u \le v$ in $\Omega$.
:::

:::theorem[Well-posedness of the Dirichlet problem]{#thm:wellposed}
(Their Theorem 2.3.) Let $\Omega \subset \R^n$ be a bounded strictly convex domain, $\mu$ a bounded Borel measure on $\Omega$ and $g \in C(\partial\Omega)$. Then the Dirichlet problem $\det D^2 u = \mu$ in $\Omega$, $u = g$ on $\partial\Omega$ has a unique Alexandrov solution in $C(\overline\Omega)$. If $\Omega$ is merely convex, the same holds provided $g$ extends to a convex function on $\overline\Omega$.
:::

Every test problem in the paper is built the same way: take a known convex $u$, set $f := \det D^2 u$ and $g := u|_{\partial\Omega}$. Except in Example 4.5, $u$ is $C^2$ in $\Omega$; in Example 4.5 the subdifferential is needed to check that $u$ is an Alexandrov solution. Uniqueness among convex functions then follows from Theorem \ref{thm:comparison}. In all examples except Example 4.4, existence and uniqueness also follow from Theorem \ref{thm:wellposed} (p. 9).

## Two ansatzes \label{sec:method}

Both methods minimize the residual of the equation at collocation points. They differ in how they obtain convexity and how they handle the boundary condition.

### Penalized MLP: exact boundary values plus a convexity penalty

The first method reuses the ansatz that Berg and Nyström \cite{berg2018} proposed for linear problems,

$$
\begin{equation}
  u(w, x) = G(x) + D(x) N(w, x),
  \label{eq:hard-bc}
\end{equation}
$$

where $G$ is a smooth function with the right boundary values, $D$ is positive in the domain and zero on its boundary, and $N$ is a deep network with parameters $w$ (their (3.1)). Whatever $N$ is, $u$ satisfies the Dirichlet condition exactly, so the loss only has to deal with the equation. On the unit square the paper builds $G$ and $D$ as follows (p. 10):

- $G$ is a network with one hidden layer of $20$ tanh units, fitted to $g$ by BFGS with a mean squared error loss.
- $D$ is a network with one hidden layer of $40$ tanh units, fitted to the exact distance function at $300$ random interior points and to zero at $400$ boundary points.
- $N$ has five hidden layers of $10$ sigmoid units and a linear output, $481$ parameters in total.

Minimizing the residual alone does not single out the convex solution, so the paper adds a convexity penalty. For a symmetric $2 \times 2$ matrix $H = [h_{ij}]$ the eigenvalues are

$$
\lambda = \frac{h_{11} + h_{22} \pm \sqrt{(h_{11} + h_{22})^2 - 4 \det H}}{2}.
$$

The paper's (3.2) drops the factor $4$ under the square root[^typo]; the argument is unaffected. The residual term drives $\det H$ towards $f \ge 0$, and when $\det H \ge 0$ both eigenvalues are nonnegative if and only if $h_{11} + h_{22} \ge 0$. Since the diagonal of a positive semidefinite matrix is nonnegative, under $\det H \ge 0$ the matrix is positive semidefinite exactly when $h_{11} \ge 0$ and $h_{22} \ge 0$. This gives the loss

$$
\begin{align*}
  E_e &= \sum_{j=1}^{M} \bigl( \det D^2 u(x_j, w) - f(x_j) \bigr)^2, \\
  E_c &= \frac{1}{M} \sum_{j=1}^{M} \Bigl( \min\{0, \partial_x^2 u(x_j, w)\}^2 + \min\{0, \partial_y^2 u(x_j, w)\}^2 \Bigr), \\
  E &= E_e + C E_c,
\end{align*}
$$

with interior collocation points $\{x_j\}$ and a large constant $C$ (their (3.3)–(3.5); their $E_e$ has no factor $1/M$). The experiments use $C = 10^4$. The authors also tried the variant of Brix et al., which replaces $\det D^2 u$ in the residual by $\max\{0, u_{xx}\} \max\{0, u_{yy}\} - u_{xy}^2$ (their (3.6)). It did not improve accuracy, and the plain determinant needed fewer iterations (p. 7). Their guess is that with a large $C$ the modification hardly matters.

The penalty has two limitations. As the authors say, it essentially only works in two dimensions, because in higher dimensions the sign of the eigenvalues is hard to check (p. 7). The example from the previous post shows why: in three dimensions a matrix with eigenvalues $(5, -1, -1)$ can have a positive determinant and positive diagonal entries without being positive semidefinite. Besides, the argument relies on $\det D^2 u \ge 0$, which the residual enforces only approximately, and only at the collocation points; nothing is said about convexity between them. The two-dimensional trace penalty $\min(0, \tr D^2 u)^2$ from the previous post works for the same reason and has the same gap.

### ICNN: convex by construction, boundary values by penalty

The second method makes the network itself convex in its input. The ICNN of their (3.7) is

$$
\begin{equation}
\begin{aligned}
  z_1 &= g_0(L_0 x + b_0), \\
  z_{j+1} &= g_j(W_j z_j + L_j x + b_j), \qquad j = 1, \dots, L-1, \\
  N(\theta, x) &= z_L,
\end{aligned}
\label{eq:icnn}
\end{equation}
$$

where the $g_j$ are nondecreasing convex functions applied componentwise, the $W_j$ have nonnegative entries, and $L_j$, $b_j$ are unconstrained. Convexity follows from two facts: a nonnegative combination of convex functions is convex, and a nondecreasing convex function of a convex function is convex. The terms $L_j x$ feed the input directly into every layer ("passthrough"); they are affine in $x$ and do not affect convexity. Three implementation details matter (pp. 8 and 11):

- The nonnegative weights are written as $w = v^2$, and training is done in $v$.
- The hidden activation is softplus, $S(t) = \ln(1 + e^t)$, which is convex, increasing and smooth, so the network is smooth and its second derivatives can be computed by automatic differentiation. The form actually used is written out in their (6.9): the last layer is the affine map $W_N z_N + L_N x + b_N$ with no activation, so that the output range is not restricted.
- The network has five hidden layers of $10$ units, $563$ parameters in total.

Here convexity and the boundary condition get in each other's way. Even if $G$, $D$ and $N$ in \eqref{eq:hard-bc} were all convex networks, the product $DN$ is in general not convex, so the ICNN cannot use exact boundary values (p. 8). The paper uses a boundary penalty instead:

$$
\begin{align*}
  E_b &= \frac{1}{K} \sum_{k=1}^{K} \bigl( u(y_k, w) - g(y_k) \bigr)^2, \\
  E &= E_e + C E_b,
\end{align*}
$$

with points $\{y_k\} \subset \partial\Omega$ (their (3.8)). The convexity penalty is no longer needed; the price is that the boundary condition now holds only approximately.

### Training

All derivatives, including the Hessian and the gradient of the loss with respect to the parameters, are computed by automatic differentiation in TensorFlow. The main optimizer is BFGS from SciPy, which uses only function values and first derivatives and stops when the Euclidean norm of the gradient falls below $10^{-5}$, the SciPy default (p. 8). The authors also use their own implementation of Adam. Parameters are initialized from a normal distribution. Collocation points are drawn with `numpy.random.uniform`: directly inside the square; on straight boundary pieces by an affine map from $[0,1)$; on the circular arc of Example 4.6 by a trigonometric parametrization, with interior points drawn in the unit square and rejected if they fall outside the domain (pp. 8–9).

A recurring problem is that BFGS stops early with a "precision loss" message, that is, the line search fails. The paper's fix is an Adam restart: train with Adam for a while to leave the problematic region, then switch back to BFGS. In Example 4.1 this meant a few hundred epochs at a learning rate of order $10^{-7}$ (p. 10). The same trick appears in Example 4.4 and in the five-dimensional case (Section \ref{sec:experiments}).

## Stability and an a posteriori error estimate \label{sec:stability}

The theory in the paper (its Section 6) does not ask whether training converges. It asks a different question: if we already have a convex function that nearly satisfies the equation and the boundary condition, how far is it from the true solution?

:::proposition[Stability]{#prop:stability}
(Their Proposition 6.1.) Let $u_1, u_2 \in C(\overline\Omega)$ be convex functions on a bounded domain $\Omega \subset \R^n$ that solve (in the Alexandrov sense) $\det D^2 u_j = f_j$ in $\Omega$, $u_j = g_j$ on $\partial\Omega$, with $f_j \in L^1(\Omega; [0, \infty))$ and $g_j \in C(\partial\Omega)$, $j = 1, 2$. Assume also $\|f_1 - f_2\|_{L^\infty(\Omega)} < \infty$. Then

$$
\begin{equation}
  \|u_1 - u_2\|_{L^\infty(\Omega)} \le \sup_{x \in \partial\Omega} \abs{g_1(x) - g_2(x)} + C_n \diam(\Omega) \abs{\Omega}^{1/n} \|f_1 - f_2\|_{L^\infty(\Omega)}^{1/n},
  \label{eq:stability}
\end{equation}
$$

where $C_n$ depends only on the dimension.
:::

:::proof[Idea of the proof]
Write $\eta = \|f_1 - f_2\|_{L^\infty}$ and $\varepsilon = \sup_{\partial\Omega} \abs{g_1 - g_2}$. Let $w$ be the convex solution with right-hand side $f_1 + \eta$ and boundary values $g_1 - \varepsilon$; by the comparison principle, $u_2 \ge w$. Let $v$ be the convex solution with constant right-hand side $\eta$ and zero boundary values. The Monge–Ampère measure is superadditive, $M(u_1 + v) \ge Mu_1 + Mv$ (their Proposition A.2), so a second use of the comparison principle gives $u_2 \ge u_1 + v - \varepsilon$. Finally, the Alexandrov maximum principle (their Theorem A.1) gives $\abs{v}^n \le \tfrac{c_n}{2} \diam(\Omega)^n \eta \abs{\Omega}$. Exchanging $u_1$ and $u_2$ yields \eqref{eq:stability} with $C_n = (c_n / 2)^{1/n}$, where $c_n$ is the constant in the Alexandrov maximum principle.
:::

The statement only asks for a bounded domain, but the proof uses their Theorem A.1, which the paper states for bounded convex domains, and Theorem \ref{thm:wellposed} to get $w$ and $v$. We therefore read the proposition as a result on bounded convex domains, which matches the setting of \eqref{eq:dirichlet}.

How does this give an error estimate? Let $u$ be the (unknown) solution of \eqref{eq:dirichlet} and $v$ a known smooth convex function, for example a trained ICNN. Then $v$ is itself the solution of a Dirichlet problem with right-hand side $f_v := \det D^2 v$ and boundary values $g_v := v|_{\partial\Omega}$. By \eqref{eq:stability}, $\|u - v\|_{L^\infty}$ is controlled by $\sup_{\partial\Omega} \abs{g - g_v}$ and $\|f - f_v\|_{L^\infty}^{1/n}$, and both involve only known functions. The remaining gap is that the loss sees the residual at finitely many points while \eqref{eq:stability} needs a supremum. The paper bridges it with Lipschitz constants.

:::lemma[A posteriori estimate]{#lem:aposteriori}
(Their Lemma 6.2.) Let $u$ solve \eqref{eq:dirichlet} with $f$ and $g$ Lipschitz, and let $v \in C^3(\overline\Omega)$ be convex. Take points $\{x_j\}_{j=1}^M \subset \Omega$, $\{y_k\}_{k=1}^N \subset \partial\Omega$ and radii $r, s > 0$ such that $\Omega \subset \bigcup_j B(x_j, r)$ and $\partial\Omega \subset \bigcup_k B(y_k, s)$. Then

$$
\begin{aligned}
  \|u - v\|_{L^\infty(\Omega)} \le{} & C_n \diam(\Omega) \abs{\Omega}^{1/n} \Bigl( (\Lip f + \Lip f_v) r + \max_{j} \abs{f(x_j) - f_v(x_j)} \Bigr)^{1/n} \\
  & + (\Lip g + \Lip g_v) s + \max_{k} \abs{g(y_k) - g_v(y_k)},
\end{aligned}
$$

with $C_n$ from Proposition \ref{prop:stability}.
:::

Everything on the right except $\Lip f_v$ and $\Lip g_v$ can be computed from finitely many function evaluations. For those two constants, the paper first shows that bounds on the derivatives of $v$ up to order three suffice: from $\partial_k \det H = \tr(\adj H \, \partial_k H)$ with $H = D^2 v$,

$$
\abs{\nabla f_v} \le \sqrt{n}\, n\, (n!) \Bigl( \sup_{x \in \Omega, \abs{\alpha} = 2} \abs{\partial^\alpha v} \Bigr)^{n-1} \sup_{x \in \Omega, \abs{\beta} = 3} \abs{\partial^\beta v}
$$

(their (6.8)). Their Lemma 6.3 then gives explicit bounds on the first, second and third derivatives of a softplus ICNN in terms of its weights alone. With $\abs{L_j}$ the entrywise absolute value and the nonnegative matrices $M_0 = \abs{L_0}$, $M_p = \abs{L_p} + W_p M_{p-1}$, one has $\abs{\partial_k v} \le M_N(k)$; the second and third derivative bounds are sums of products of entries of $W_N \cdots W_j$ and $M_{j-1}$. The proof uses only $\abs{S'}, \abs{S''}, \abs{S'''} \le 1$ for softplus and the chain rule. Inserting these bounds into Lemma \ref{lem:aposteriori} gives an $L^\infty$ error bound that needs no exact solution, only finitely many function evaluations.

The estimate only covers convex approximations. Proposition \ref{prop:stability} needs both $u_1$ and $u_2$ to be convex, so it applies to the ICNN but not to the penalized MLP, which is only approximately convex at the collocation points. This is a theoretical advantage of the ICNN approach.

Besides, the residual enters with exponent $1/n$, so the bound is pessimistic. Figure \ref{fig:stability} plots $\eta^{1/n}$. In two dimensions, even a residual supremum of $10^{-6}$ still leaves an error term of $C_2 \diam(\Omega) \abs{\Omega}^{1/2} \cdot 10^{-3}$; in four dimensions, bringing $\eta^{1/4}$ down to $10^{-3}$ takes a residual supremum of $10^{-12}$. Unless $C_n$ is small, such bounds are far above the errors of order $10^{-5}$ observed in Section \ref{sec:experiments}. The constant $C_n$ comes from the Alexandrov maximum principle, and the paper gives no value for it.

The paper also never evaluates the bound on any experiment. So we do not know how large $\Lip f_v$ from their Lemma 6.3 is for a trained network, how small the covering radius $r$ has to be, or how many orders of magnitude separate the bound from the actual error. The authors list better Lipschitz bounds as future work (p. 27).

:::figure{#fig:stability .invert-dark}
![The factor eta^(1/n) in the stability estimate](./stability.svg)

The factor $\eta^{1/n}$ multiplying the residual in \eqref{eq:stability}, computed from the formula. Black solid, dashed, dash-dot and dotted lines are $n = 2, 3, 4, 5$; the wide grey solid line is $\eta$ itself, for comparison.
:::

## Experiments \label{sec:experiments}

Section 4 of the paper has seven examples, and Section 5 studies the number of collocation points. Example 4.1 uses the penalized MLP; all others use the ICNN. Table \ref{tab:examples} summarizes the settings, and Figure \ref{fig:problems} shows some of the test problems. The paper gives error tables only for Sections 4.6, 4.7 and 5.3; the other 2D examples of Section 4 are reported as heat maps of the absolute error. When we quote a number from a heat map below, it is the highest tick on the color bar and indicates only the order of magnitude.

:::table{#tab:examples}
| Ex. | Domain | Exact solution or feature | Method | Interior / boundary points | Weights | Iterations |
| :-- | :-- | :-- | :-- | --: | :-- | :-- |
| 4.1 | $(0,1)^2$ | $e^{(x^2+y^2)/2}$, smooth | penalized MLP | $3000$ / $400$ | $C = 10^4$ | BFGS + Adam restarts |
| 4.2 | $(0,1)^2$ | same | ICNN | $3000$ / $400$ | $C = 100$ | BFGS, converged at $2287$ |
| 4.3 | $(0,1)^2$ | $f$ singular at the origin (on the boundary), integrable | ICNN | not given; plus $40$ | $C = 1000$, $K = 4000$ | $55000$ |
| 4.4 | $(0,1)^2$ | $f$ singular at $(1,1)$, not integrable | ICNN | not given; plus $40$ | $C = 1000$, $K = 4000$ | BFGS + Adam |
| 4.5 | $(0, 1.5)^2$ | $f$ discontinuous at $r = 1$ | ICNN | $3000$ / $400$; $10^4$ / $1000$ | not given | see text |
| 4.6 | asymmetric convex domain | no symmetry; noisy $f$ | ICNN | $3000$ / $400$ | not given | $5000$; at most $10^4$ |
| 4.7 | $(0,1)^n$, $n = 3,4,5$ | $e^{\abs{x}^2/2}$ | ICNN | see text | not given | see text |

Settings of the examples, from Section 4 of the paper (pp. 9–17). "Plus $40$" means $20$ extra boundary points on each of the two edges next to the singularity, weighted by $K$; for Examples 4.3 and 4.4 the paper only says that the method of Example 4.2 is reused and does not restate the numbers of points. "Not given" means the paper does not state the value.
:::

:::figure{#fig:problems .invert-dark}
![Four test problems](./problems.svg)

Four test problems, computed from the formulas in the paper. (a) The domain of Example 4.6 ($x > 0$, $y > 0$, $x^2 + y^2 < 1$, $y > x - \tfrac12$; black outline) with level sets of the exact solution (thin black lines labelled with the value of $u$; the unlabelled one in the lower corner of the arc is $1.05$). (b) Radial profile of Example 4.5: $u$ (black solid line) vanishes for $r \le 1$ and continues in a $C^1$ way outside, while $f$ (wide grey solid line) jumps from $0$ to $4$ at $r = 1$ (grey dotted line). (c) The right-hand sides of Examples 4.3 (black dashed line) and 4.4 (black solid line) along the diagonal; the singularities sit at the origin and at $(1,1)$, both on the boundary.
:::

### A smooth problem in 2D: the two methods side by side

Examples 4.1 and 4.2 solve the same problem on $\Omega = (0,1)^2$:

$$
u(x, y) = \exp\Bigl( \frac{x^2 + y^2}{2} \Bigr), \qquad f(x, y) = (1 + x^2 + y^2) \exp(x^2 + y^2)
$$

(their (4.1) and (4.2)). Both use $3000$ random interior points and $400$ boundary points. The penalized MLP uses $C = 10^4$; BFGS stopped with precision loss at some point and was restarted after a few hundred Adam epochs. The highest tick on its error heat map (their Figure 1) is $0.0054$. The ICNN uses $C = 100$ and includes the boundary points in $E_e$ as well; BFGS converged after $2287$ iterations, and the highest tick on its error heat map (their Figure 2) is $2.97 \times 10^{-5}$. The authors summarize this as errors of order $10^{-3}$ for the penalized MLP and $10^{-5}$ for the ICNN (p. 11). Since $u$ is of order one on the unit square, the relative errors are of the same order. They also note that the accuracy of the penalized MLP is comparable to the examples in \cite{berg2018}.

The gap of two orders of magnitude is large, but the comparison does not control several factors. The networks differ (a sigmoid MLP with $481$ parameters against a softplus ICNN with $563$), the penalty weights differ ($10^4$ against $100$), one method has exact boundary values and the other only approximate ones, and only the first needed Adam restarts. Each method is reported for a single run, with no statistics over random seeds and no run times. So the result shows that the ICNN reaches high accuracy on this problem; it does not show that the whole factor of $100$ comes from structural convexity being better than a penalty.

### Singularities on the boundary

Example 4.3 takes

$$
u(x, y) = \frac{2\sqrt2}{3} (x^2 + y^2)^{3/4}, \qquad f(x, y) = \frac{1}{(x^2 + y^2)^{1/2}}.
$$

Here $f$ is singular at the origin, which lies on the boundary of $\Omega = (0,1)^2$, but it is integrable (pp. 11–12). The method of Example 4.2 works, but the authors found it better to add boundary points near the singularity and give them a larger weight. The loss becomes

$$
\begin{align*}
  E &= E_e + C E_b + K E_B, \qquad E_B = \frac{1}{P} \sum_{k=1}^{P} \bigl( u(z_k, w) - g(z_k) \bigr)^2,
\end{align*}
$$

where the $z_k$ are $20$ equidistant points on each of the segments $[0, 0.04] \times \{0\}$ and $\{0\} \times [0, 0.04]$, with $C = 1000$ and $K = 4000$ (their (4.3)). With $E_B$, the absolute error after $5000$ iterations was already below the best the authors could reach without it, and the maximum error dropped by more than $90\%$. The highest tick on the heat map after $55000$ iterations (their Figure 3) is $9 \times 10^{-5}$.

Example 4.4 is a piece of a sphere,

$$
u(x, y) = -\sqrt{2 - x^2 - y^2}, \qquad f(x, y) = \frac{2}{(2 - x^2 - y^2)^2},
$$

with $f$ singular at the corner $(1,1)$. The singularity is stronger than in Example 4.3, and $f$ is not integrable (pp. 12–13), so Theorem \ref{thm:wellposed} does not apply; uniqueness follows from the explicit solution and the comparison principle. Training keeps the $C$ and $K$ of Example 4.3, with $20$ extra boundary points on each of $[0.95, 1] \times \{1\}$ and $\{1\} \times [0.95, 1]$. BFGS stopped with precision loss several times, most likely because of the strong singularity, according to the authors, and each time a few Adam iterations got it going again. The highest tick on the final heat map (their Figure 4) is $1.8 \times 10^{-4}$; judging from the figure, the largest error sits on the right edge $x = 1$ close to the corner $(1,1)$.

### A discontinuous right-hand side

Example 4.5 uses the radial function on $\Omega = (0, 1.5)^2$

$$
u(r) = \begin{cases} 0, & r \le 1, \\ r\sqrt{r^2 - 1} - \ln\bigl(r + \sqrt{r^2 - 1}\bigr), & r > 1, \end{cases}
\qquad
\partial_r u(r) = \begin{cases} 0, & r \le 1, \\ 2\sqrt{r^2 - 1}, & r > 1, \end{cases}
$$

which is $C^1$. Using $\det D^2 u = \tfrac1r (\partial_r u)(\partial_r^2 u)$ for radial functions, $f = 0$ for $r < 1$ and $f = 4$ for $r > 1$; the circle $r = 1$ carries no Monge–Ampère mass, so $u$ is the Alexandrov solution with right-hand side (4.4) (p. 13). This is the only example whose solution is not $C^2$ in $\Omega$.

The network is the one of Example 4.2. With $3000$ interior and $400$ boundary points, the highest tick on the heat map (their Figure 5) is $0.00162$, much worse than before, with the largest errors near the discontinuity $r = 1$. Adding points near $r = 1$ made training harder; the authors explain that points very close to each other on the two sides of the circle must be mapped to very different values, $4$ and $0$. Refining everywhere instead, with $10000$ interior and $1000$ boundary points, cut the maximum error to less than half (their Figure 6, highest tick $0.00072$), still large compared with the other examples. On the number of iterations, the text says $15000$ while the captions of their Figures 5 and 6 say $150000$ (pp. 14–15); we cannot tell which is right. [TODO: check the iteration count of Example 4.5 in the journal version (JCMDS 8, 100080)]

### An asymmetric domain and noise

The domain of Example 4.6 is bounded by $x > 0$, $y > 0$, $x^2 + y^2 < 1$ and $y > x - \tfrac12$ (Figure \ref{fig:problems}a). The exact solution

$$
u(x, y) = \tfrac{7}{10} \exp\Bigl( \tfrac12 \bigl( (x - \tfrac12)^2 + y^2 \bigr) \Bigr) + x^2 - \tfrac12
$$

was chosen to have no particular symmetry (p. 15). There are $3000$ interior and $400$ boundary points, with the number of points on each boundary piece roughly proportional to its length. After $5000$ BFGS iterations, the highest tick on the noise-free heat map (their Figure 7) is $8.1 \times 10^{-6}$.

The authors then add normally distributed noise to the values of the right-hand side, with standard deviations from $10^{-3}$ to $1$, train with BFGS until convergence or for at most $10000$ iterations, and measure the maximum and average error at $10^6$ random interior points (their Table 1). Figure \ref{fig:noise}a shows the result. Without noise the maximum error is $8.58 \times 10^{-6}$ and the average error $1.17 \times 10^{-6}$. With standard deviations $10^{-3}$ and $10^{-2}$ the maximum error is $1.32 \times 10^{-5}$ and $2.54 \times 10^{-5}$, a range in which the authors see little change; with $10^{-1}$ and $1$ it is $1.21 \times 10^{-4}$ and $2.48 \times 10^{-3}$. The authors call the method "rather stable" with respect to noise, and note that values vary between runs while the general trend is that noise lowers accuracy. We add two observations. Going from $0.1$ to $1$, the maximum error grows by a factor of about $20$ and the average error by about $17$, more than the noise level itself. Besides, the paper says neither whether the noise is drawn once or redrawn during training, nor how much the numbers vary over repeated runs.

:::figure{#fig:noise .invert-dark}
![Effect of noise and of the number of collocation points](./noise-points.svg)

Blue curves are ICNN results; for (b) the network is our inference (see below). (a) Error in Example 4.6 when normal noise is added to the right-hand side: maximum error as a solid line with filled circles, average error as a dotted line with open circles; the grey horizontal solid and dotted lines are the noise-free values (a standard deviation of $0$ has no place on a log axis). Data from Table 1 of the paper. (b) Average error when boundary and interior points are doubled together; there are $5$ times (Table 4, solid line, filled circles) or $2.5$ times (Table 5, dashed line, open squares; Table 6, dash-dot line, filled triangles) as many interior points as boundary points. Data from Tables 4–6 of the paper, each run with at most $5000$ BFGS iterations. The value printed as "1.27-03" in Table 6 is plotted as $1.27 \times 10^{-3}$.
:::

### Higher dimensions

Example 4.7 extends Example 4.2 to $u = \exp(\abs{x}^2/2)$ on $(0,1)^n$. The paper does not restate the network for these runs, nor does it write out the right-hand side in $n$ dimensions; from $\det D^2 u = (\partial_r u / r)^{n-1} \partial_r^2 u$ for radial functions we get $f = (1 + \abs{x}^2) e^{n\abs{x}^2/2}$.

- In 3D, with $4000$ interior and $1200$ boundary points, BFGS terminated successfully after $20015$ iterations. The final maximum error is $5.333 \times 10^{-5}$, the average error $5.250 \times 10^{-6}$ and the $L^2$ error $8.123 \times 10^{-6}$ (their Table 2).
- In 4D, with $4000$ interior and $2400$ boundary points, BFGS stopped with precision loss after $17506$ iterations. At that point the maximum error is $1.553 \times 10^{-3}$, the average error $7.387 \times 10^{-5}$ and the $L^2$ error $1.090 \times 10^{-4}$ (their Table 3).
- In 5D, training failed. BFGS stopped immediately with precision loss, and Adam alone reduced the loss only very slowly. The only procedure that worked was: (1) Adam on the boundary loss $E_b$ alone for up to $1000$ epochs; (2) Adam on the full loss for some thousands of epochs, which decreased much faster after step (1); (3) BFGS, which reduced the loss quickly and then stopped again with precision loss; (4) alternating between Adam and BFGS. Full-batch Adam worked best. The loss started at order $10^7$ and came down to order $1$ fairly quickly, after which convergence was slow, and the approximate solution still differed clearly from the exact one. No error numbers are reported for 5D; the authors only say that the method needs further development (pp. 16–17).

Figure \ref{fig:dimension}a shows the errors in 3D and 4D against the number of iterations. The final $L^2$ error in 4D is about $13$ times the 3D one, and the maximum error about $29$ times; the 4D run did not terminate normally, which slightly penalizes it in this comparison. The paper offers no analysis of the 5D failure. Figure \ref{fig:dimension}b is our own observation, not part of the paper: on $(0,1)^n$ the right-hand side has minimum $1$ at the origin and maximum $(1 + n) e^{n^2/2}$ at the corner $(1, \dots, 1)$, about $1.6 \times 10^6$ for $n = 5$. A right-hand side whose scale grows like this may be one reason why the 5D loss starts so large and BFGS fails at once. This is only a guess; testing it would mean running the same network on a problem whose $f$ does not grow with the dimension.

:::figure{#fig:dimension .invert-dark}
![Higher-dimensional experiments](./dimension.svg)

(a) Errors of the ICNN (blue) in 3D and 4D during training. Line style gives the error: solid for maximum, dashed for $L^2$, dotted for average; the marker gives the dimension: filled circles for 3D, open squares for 4D. Data from Tables 2 and 3 of the paper; the value printed as "7.387-05" in Table 3 is plotted as $7.387 \times 10^{-5}$. Training failed in 5D, and the paper gives no error numbers. (b) Our own calculation of the maximum of the right-hand side for $u = e^{\abs{x}^2/2}$ on $(0,1)^n$ (black solid line, a dot at each $n$ with its value next to it); the minimum is always $1$.
:::

### Number of collocation points

Section 5 of the paper studies three problems: that of Example 4.1, that of Example 4.3, and the function (4.1) on the unit disk. To separate the roles of the two kinds of points, $E_e$ here contains only interior points. The paper does not say which network this section uses; since the boundary points enter the loss only through $E_b$, we infer that it is the ICNN. Each run uses BFGS until convergence or at most $5000$ iterations.

- With $400$ boundary points fixed, the number of interior points starts at $4$ or $5$ and is doubled (their Figures 8–10).
- With $1000$ interior points fixed, the number of boundary points starts at $4$ and is doubled (their Figures 11–13).
- Both are doubled together (their Tables 4–6, Figure \ref{fig:noise}b).

The three studies agree: the average error first drops quickly as points are added, then slows down and oscillates. In their Table 4, for example, the average error is $0.368$ with $4$ boundary and $20$ interior points, already $5.69 \times 10^{-6}$ with $32$ and $160$, and stays between $3 \times 10^{-6}$ and $7 \times 10^{-6}$ after that, ending at $3.05 \times 10^{-6}$ with $1024$ and $5120$. Table 6 decreases more slowly and reaches $5.36 \times 10^{-5}$ at $128$ and $320$. The authors attribute the plateau mainly to the cap of $5000$ iterations, which is often hit before the optimizer terminates when many points are used; they checked that more iterations improve the accuracy. Increasing only one kind of point also changes the ratio between the two, which may hurt convergence (pp. 19–20). So this section shows that a small number of points already gives good results; it does not establish a convergence rate.

There is one inconsistency here that we cannot resolve. The text says that Tables 4, 5 and 6 belong to Example 4.1, Example 4.3 and the disk, in that order, but the captions of Tables 4 and 5 both name the disk problem, and the caption of Table 6 names Example 4.3 (pp. 18 and 21). Figure \ref{fig:noise}b therefore labels the curves by table number only. [TODO: check the captions of Tables 4–6 in the journal version]

## Discussion \label{sec:discussion}

The paper establishes the following. The ICNN is a workable convex ansatz: a network with $563$ parameters reaches absolute errors of order $10^{-5}$ on a smooth 2D problem. For singularities on the boundary, extra weighted boundary points near the singularity help considerably. The method handles an asymmetric convex domain, is insensitive to small noise in the right-hand side, and still gives good results in 3D and 4D. On the theory side, Proposition \ref{prop:stability} and Lemma \ref{lem:aposteriori} give a route to an $L^\infty$ error estimate without the exact solution, and this route only works for convex approximations, which is exactly where the ICNN has an edge over the penalty approach.

The paper leaves the following questions open:

1. The two methods are compared once, on one 2D problem, with different networks, weights, boundary treatments and optimization histories (Section \ref{sec:experiments}). There is no comparison with any classical method either; the authors say explicitly that they did not reproduce the methods of Benamou, Froese and Oberman \cite{benamou2010}, which were tested on some of the same 2D problems (p. 9).
2. Every result is a single run. The authors acknowledge that results vary with the random points and initialization but give no spread. No run times are reported; the conclusion only says, qualitatively, that time per iteration grows little with more points while the number of BFGS iterations grows (p. 27).
3. The a posteriori bound is never evaluated, and its exponent $1/n$ makes it weak in higher dimensions.
4. The 5D failure is not analyzed. Training relies on a hand-tuned alternation between BFGS and Adam, and when to switch and which learning rate to use is given for only a few examples.
5. Outside 2D the penalized MLP has no convexity guarantee, and in 2D its convexity holds only approximately at the collocation points. The paper does not report whether the trained penalized MLP is convex between them.
6. The ICNN satisfies the boundary condition only approximately. In several heat maps the largest error sits near the boundary (for example their Figures 2, 3, 4 and 7); this is our reading of the figures, and the paper does not discuss it.

The future work the authors list includes the more general equation $\det D^2 u = f(x, u, \nabla u)$, in particular prescribed Gaussian curvature and optimal transport (where the boundary condition asks the gradient to map the boundary to the boundary), deep versus shallow networks, estimating and reducing computation time, and better Lipschitz bounds for Section 6 (p. 27).

## Conclusion

Nyström and Vestberg solve the Dirichlet problem for the Monge–Ampère equation with two ansatzes. The penalized MLP keeps exact boundary values and pushes towards convexity through a penalty on the diagonal of the Hessian, which essentially only works in 2D. The ICNN is convex by construction and imposes the boundary condition by a penalty, in any dimension. In the authors' examples, the ICNN reaches errors of order $10^{-5}$ on a smooth 2D problem, handles boundary singularities, a discontinuous right-hand side (with lower accuracy), an asymmetric domain and a noisy right-hand side, and works in 3D and 4D; training fails in 5D. On the theory side, the stability of Alexandrov solutions gives an a posteriori $L^\infty$ estimate for convex approximations, but it scales only like the $1/n$-th power of the residual, and the paper does not apply it to its experiments. As the first work of its kind (to the authors' knowledge), the paper sets out the approach of combining a convex architecture with a residual loss; what it leaves open is a proper comparison, stable training in higher dimensions, and the distance between the theoretical bound and the actual error.

[^typo]: The eigenvalues of a symmetric $2 \times 2$ matrix solve $\lambda^2 - (h_{11} + h_{22})\lambda + \det H = 0$, whose discriminant is $(h_{11} + h_{22})^2 - 4\det H$.
