---
title: "Paper reading: An adaptive Deep Ritz framework for second-order fully nonlinear partial differential equations"
description: "A close reading of the adaptive Deep Ritz framework of Caboussat, Leclercq and Peruso, which splits a fully nonlinear PDE into a pointwise nonlinear projection and a linear variational problem solved by Deep Ritz. We go through the method, its theoretical basis, every experiment with the reported numbers, and what the results do and do not show."
date: 2026-10-20
tags: [PDE, Monge–Ampère, PINN]
draft: false
ai: true
macros:
  bx: '\mathbf{x}'
  by: '\mathbf{y}'
---

## Introduction \label{sec:intro}

The most direct way to solve the Monge–Ampère equation with a neural network is a PINN: put the residual $\det D^2 u_\theta - f$ and a boundary term into the loss and train once. On the one hand, this is simple to implement, and on smooth problems it is indeed fast. On the other hand, the whole nonlinearity is handed to the optimizer at once, with the determinant of the Hessian and the boundary term competing in one loss, and training can become unstable when the problem gets harder. Besides, the loss knows nothing about convexity of the solution, as discussed in the [previous post](../mae-convexity-branch/).

The preprint of Caboussat, Leclercq and Peruso \cite{caboussat2026} takes another route. It reuses the least-squares splitting from the finite element literature \cite{caboussat2013}: introduce a matrix field $P \approx D^2 u$ and alternate between a pointwise nonlinear projection and a linear variational problem. The second problem has a natural energy form, so the authors solve it with the Deep Ritz method \cite{e2018}, use an input convex neural network (ICNN) \cite{amos2017} when the solution must be convex, and resample the collocation points adaptively from the local defect.

The rest of this post is organized as follows. Section \ref{sec:problem} states the problem and why it is hard. Section \ref{sec:method} describes every component of the method. Section \ref{sec:theory} collects the theoretical facts the paper relies on. Section \ref{sec:setup} gives the common experimental setup, and Sections \ref{sec:dirichlet} and \ref{sec:ot} go through the Dirichlet and optimal transport experiments one by one. Section \ref{sec:discussion} discusses what the results show and what they do not. All numbers come from the paper (arXiv v2, 29 September 2026). All figures are our own and none is taken from the paper: three are drawn from the paper's formulas or tables, and one is our own illustration.

## The problem and why it is hard \label{sec:problem}

The paper considers second-order fully nonlinear equations: find $u : \Omega \to \R$ with

$$
F(D^2 u, \nabla u, u, \bx) = 0, \qquad \bx \in \Omega \subset \R^d,
$$

where $F$ is nonlinear in at least one entry of $D^2 u$, together with a Dirichlet condition. "Fully nonlinear" means that the nonlinearity acts on the highest-order derivatives. The paper lists four examples, with $\lambda_i$ the eigenvalues of $D^2 u$:

- the Monge–Ampère equation, $F = \det D^2 u - f$;
- the Pucci equation, $F = \alpha \sum \lambda_+(D^2 u) + \sum \lambda_-(D^2 u) - f$ with $\alpha > 1$, where $\lambda_+$ and $\lambda_-$ are the positive and negative eigenvalues;
- the $\sigma_2$ equation, $F = \sigma_2(D^2 u) - f$ with $\sigma_2(D^2 u) = \sum_{i<j} \lambda_i \lambda_j$;
- the Minkowski (prescribed Gauss curvature) equation, $F = \det D^2 u - K(\bx)(1 + \abs{\nabla u}^2)^{(d+2)/2}$ with $K > 0$.

The authors name two difficulties. First, well-posedness is subtle: existence and uniqueness usually need extra structure, such as convexity of the solution or monotonicity of the operator. For Monge–Ampère, convexity is exactly what selects the solution (see the [previous post](../mae-convexity-branch/)). Second, these equations are in non-divergence form and have no weak formulation, so the variational methods used for linear and semilinear equations (finite elements, Deep Ritz) do not apply directly. A direct PINN avoids the second difficulty, since it only evaluates the strong residual at collocation points; but it asks the network to satisfy the full nonlinear equation at every point, and convexity still has to be handled separately.

## Method \label{sec:method}

### Least-squares splitting \label{sec:split}

Start with the Dirichlet problem $F(D^2 u) = 0$ in $\Omega$, $u = \varphi$ on $\partial\Omega$. With a matrix field $P : \Omega \to \R^{d \times d}_{\mathrm{sym}}$, the problem is rewritten in the coupled form

$$
D^2 u = P, \qquad F(P) = 0 \quad \text{in } \Omega, \qquad u = \varphi \quad \text{on } \partial\Omega,
$$

and then as a least-squares problem with a nonlinear constraint,

$$
\begin{equation}
  (u, P) = \operatorname*{arg\,min}_{\substack{v \in H^2(\Omega) \cap H^1_\varphi(\Omega) \\ Q \in L^2(\Omega; \R^{d\times d}_{\mathrm{sym}})}} \Bigl\{ J(v, Q) \ \text{s.t.}\ F(Q) = 0 \Bigr\}, \qquad J(v, Q) = \frac12 \int_\Omega \abs{D^2 v - Q}^2 ,
  \label{eq:ls}
\end{equation}
$$

where $\abs{\cdot}$ is the Frobenius norm and $H^1_\varphi(\Omega) = \{ v \in H^1(\Omega) : v = \varphi \text{ on } \partial\Omega \}$. Minimizing \eqref{eq:ls} directly is cumbersome, so a block coordinate descent separates the nonlinearity from the differential operator: given $u^0$, for $n \ge 0$ solve successively

$$
\begin{equation}
  P^n = \operatorname*{arg\,min}_{Q} \bigl\{ J(u^n, Q) \ \text{s.t.}\ F(Q) = 0 \bigr\}, \qquad
  u^{n+1} = \operatorname*{arg\,min}_{v \in H^2(\Omega) \cap H^1_\varphi(\Omega)} J(v, P^n).
  \label{eq:split}
\end{equation}
$$

The two subproblems are of a very different nature. The first is nonlinear but local: at each point $\bx$ it asks for the symmetric matrix closest to $D^2 u^n(\bx)$ in the Frobenius norm that satisfies $F(Q) = 0$. When the constraint is rotation invariant (Monge–Ampère, Pucci and $\sigma_2$ all are), it reduces to a small problem in the eigenvalues of $Q$. The paper uses existing pointwise solvers (its references [24, 26, 30]); in the timing experiments this step takes at most about $0.12\%$ of the CPU time of one variational update. The second subproblem does not depend on $F$ and is linear. Its strong form is a fourth-order biharmonic-type equation, and in finite element implementations it is the computational bottleneck. The starting point of the paper is that, since this problem is already given in variational form, Deep Ritz can solve it directly.

In \eqref{eq:split} the paper writes the constraint only as $F(Q) = 0$, that is, $\det Q = f$ for Monge–Ampère. In two dimensions this set contains both positive definite and negative definite matrices ($\det(-Q) = \det Q$), which are exactly the convex and concave branches of the [previous post](../mae-convexity-branch/). The original finite element version of the method \cite{caboussat2013} takes the constraint set $\{ q : \det q = f,\ q_{11} > 0,\ q_{22} > 0 \}$ (its eq. (2.5)), which keeps only the positive definite branch. The 2026 paper does not write this condition; convexity is carried by the network instead: for Monge–Ampère-type problems the network is an ICNN, whose output is convex as long as its weights satisfy the nonnegativity constraint.

The initial guess solves a Poisson problem,

$$
\Delta u^0 = 2\sqrt{f} \quad \text{in } \Omega, \qquad u^0 = \varphi \quad \text{on } \partial\Omega .
$$

The reason given is that in two dimensions, if the eigenvalues of $D^2 u$ are close, $\lambda_1 \approx \lambda_2$, then $\Delta u = \lambda_1 + \lambda_2 \approx 2\lambda_1 \approx 2\sqrt{\det D^2 u} = 2\sqrt{f}$. This initial guess is itself trained with Deep Ritz.

### Equations that depend on the gradient \label{sec:general}

In the Gauss curvature equation and in optimal transport, $F$ also depends on $\nabla u$. The paper simply freezes the gradient at the previous iterate and replaces the projection step by

$$
P^n = \operatorname*{arg\,min}_{Q} \bigl\{ J(u^n, Q) \ \text{s.t.}\ F(Q, \nabla u^n) = 0 \bigr\},
$$

leaving the variational step unchanged. For the Gauss curvature problem

$$
\det D^2 u = K (1 + \abs{\nabla u}^2)^{(d+2)/2} \quad \text{in } \Omega, \qquad u = \varphi \quad \text{on } \partial\Omega,
$$

ellipticity requires $u$ to be convex. The authors report that they used this explicit-gradient form in all their experiments and systematically observed numerical convergence; an alternative is an auxiliary variable $\mathbf{b} \approx \nabla u$, as in \cite{liu2024}.

For optimal transport with quadratic cost, Brenier's theorem (Theorem \ref{thm:brenier}) says that the optimal map is the gradient of a convex potential, $T = \nabla u$, where

$$
\det D^2 u = \frac{\mu_0}{\mu_1(\nabla u)} \quad \mu_0\text{-a.e. in } X, \qquad \nabla u(\partial X) = \partial Y .
$$

The right-hand side depends on $\nabla u$, so the projection step again uses the frozen gradient. The hard part is the second condition, the transport boundary condition: it is not a Dirichlet condition but asks $\nabla u$ to map the boundary of the source onto the boundary of the target. Its treatment is given in Section \ref{sec:otbc}.

### The Deep Ritz step and the networks \label{sec:ritz}

The variational step in \eqref{eq:split} is linear, and the paper notes that it is well-posed because $\int_\Omega \abs{D^2 \cdot}^2$ is a norm on $H^2(\Omega) \cap H^1_0(\Omega)$. Networks do not satisfy the boundary condition in general, so it is imposed weakly by a penalty, and the integrals are discretized by Monte Carlo. With $n_c$ interior points $\{\bx_{c,i}\}$ and $n_b$ boundary points $\{\bx_{b,i}\}$, both sampled uniformly, the loss at outer iteration $n$ is

$$
\begin{align*}
  L(v) &= L_{\mathrm{PDE}}(v) + \lambda\, L_{\mathrm{BC}}(v), \\
  L_{\mathrm{PDE}}(v) &= \frac{1}{n_c} \sum_{i=1}^{n_c} \abs{D^2 v(\bx_{c,i}) - P^n(\bx_{c,i})}^2, \\
  L_{\mathrm{BC}}(v) &= \frac{1}{n_b} \sum_{i=1}^{n_b} \bigl( v(\bx_{b,i}) - \varphi(\bx_{b,i}) \bigr)^2 ,
\end{align*}
$$

and $u^{n+1}_{NN}$ is its minimizer. Compared with the PINN loss there is no determinant and no nonlinearity at all here: the network only fits its Hessian to a given matrix field $P^n$. The authors prefer Deep Ritz to a PINN for this step because the problem is variational in the first place, no higher derivatives are needed (the strong form of the biharmonic problem would need fourth derivatives), and no extra regularity is assumed.

Two kinds of networks are used. Problems without a convexity requirement (Pucci) use a plain fully connected network. Problems with convex solutions use an ICNN \cite{amos2017},

$$
\begin{align*}
  \bx_1 &= \sigma(L^{(0)} \bx + b^{(0)}), \\
  \bx_l &= \sigma(W^{(l-1)} \bx_{l-1} + L^{(l-1)} \bx + b^{(l-1)}), \qquad 2 \le l \le L, \\
  y &= W^{(L)} \bx_L + L^{(L)} \bx + b^{(L)},
\end{align*}
$$

where the $W^{(l)}$ have nonnegative entries, the passthrough matrices $L^{(l)}$ are unconstrained, and $\sigma$ is convex and increasing. Convexity follows from two elementary facts: nonnegative combinations of convex functions are convex, and an increasing convex function of a convex function is convex. The passthrough layers matter: nonnegative weights make it hard for hidden units to reproduce the identity, and the direct connections from the input restore part of the expressive power. The concrete choices in the paper are:

- unless stated otherwise, $4$ hidden layers with $10$ neurons each;
- for the ICNN, the softplus activation $\sigma(x) = \log(1 + e^x)$, which is smooth, increasing and strictly convex; the paper says that, to guarantee $W^{(l)} \ge 0$, the weights are initialized by squaring them element-wise, and it does not say how nonnegativity is kept during training;
- a two-stage optimizer: Adam for pre-training, then L-BFGS for refinement, with the settings in Table \ref{tab:optim}. Early outer iterations use up to $70$ L-BFGS epochs, later ones as few as $4$, on the grounds that the previous iterate is a good initialization for the next Deep Ritz solve.

:::table{#tab:optim}
| Setting | Value |
| :-- | :-- |
| Main optimizer | L-BFGS |
| Line search | strong Wolfe |
| L-BFGS history size | 25 |
| Max iterations per call | 20 |
| Gradient tolerance (L-BFGS) | $10^{-7}$ |
| Batch size | full batch |

Training settings of the Deep Ritz solvers, from Table 1 of the paper. The learning rate and number of steps of the Adam stage are not reported.
:::

### Adaptive sampling \label{sec:adaptive}

The accuracy of Deep Ritz also depends on how well Monte Carlo approximates the integral, and uniform sampling is wasteful when the integrand is concentrated. The paper starts from importance sampling: for any strictly positive probability density $q$ on $\Omega$,

$$
\int_\Omega \abs{D^2 v - P^n}^2 \,\mathrm{d}\bx = \mathbb{E}_{X \sim q} \Bigl[ \frac{\abs{D^2 v(X) - P^n(X)}^2}{q(X)} \Bigr],
$$

so the estimator built from independent samples of $q$ is unbiased. Formally, the variance-minimizing density is proportional to the defect $d(\bx) := \abs{D^2 v(\bx) - P^n(\bx)}^2$, with $v$ the network at the time of the update. Evaluating $d$ at all collocation points is too expensive, so, following Nabian et al. \cite{nabian2021}, the density is approximated by a piecewise constant function:

1. draw $S \ll n_c$ random seeds $X_1, \dots, X_S$, which split $\Omega$ into Voronoi cells $C_1, \dots, C_S$ by nearest-neighbor assignment;
2. sample $n_s = n_c\, d(X_s) / \sum_{j=1}^S d(X_j)$ points uniformly in cell $C_s$;
3. approximate the PDE term by the weighted sum

$$
\widetilde{L}_{\mathrm{PDE}}(v) = \sum_{s=1}^{S} \frac{\abs{C_s}}{n_s} \sum_{i=1}^{n_s} \abs{D^2 v(X_{s,i}) - P^n(X_{s,i})}^2, \qquad X_{s,i} \sim U(C_s),
$$

where the cell volumes $\abs{C_s}$ are estimated from a uniform Monte Carlo sample. Each density update needs Hessians at only $S$ seeds plus one nearest-neighbor assignment. Figure \ref{fig:voronoi} illustrates the rule with an indicator of our own choosing. The authors also state the limitation: the piecewise constant approximation of the ideal density can be coarse, and its quality depends on the number of seeds.

:::figure{#fig:voronoi .invert-dark}
![Uniform sampling and Voronoi-stratified adaptive sampling](./voronoi_sampling.svg)

Illustration of the adaptive sampling rule (our demonstration, not a result of the paper). Small grey dots are collocation points, thin grey lines are Voronoi cell edges, and blue circles are the seeds. (a) $3000$ uniform collocation points. (b) Voronoi cells of $30$ seeds; the number of points in each cell is proportional to the indicator at its seed (rounded). The indicator here is $\abs{D^2 u}^2$ of the exact solution $e^{r^2/2}$ ($\alpha = 1$), chosen only because it grows towards $(1,1)$; the paper uses the defect $\abs{D^2 v - P^n}^2$ of the current network.
:::

### Transport boundary condition \label{sec:otbc}

For optimal transport, the Dirichlet penalty is replaced by a penalty on the transport boundary condition, following the earlier convex PINN work of two of the authors \cite{caboussat2025}. It uses

$$
\nabla u(\partial X) = \partial Y \iff d_H\bigl(\nabla u(\partial X), \partial Y\bigr) = 0,
$$

where $d_H(A, B) = \max\{ \sup_{a \in A} \operatorname{dist}(a, B), \sup_{b \in B} \operatorname{dist}(b, A) \}$ is the Hausdorff distance. The two suprema correspond to the inclusions $\nabla u(\partial X) \subseteq \partial Y$ and $\partial Y \subseteq \nabla u(\partial X)$. With points $\{\bx_{X,i}\}_{i=1}^{n_{bX}}$ on the source boundary and $\{\by_{Y,j}\}_{j=1}^{n_{bY}}$ on the target boundary, the discrete boundary term is

$$
\begin{align*}
  L_{\mathrm{OT}}(v) &= \frac{1}{n_{bX}} \sum_{i=1}^{n_{bX}} \operatorname{dist}\Bigl( \nabla v(\bx_{X,i}),\ \{\by_{Y,j}\}_{j} \Bigr)^2 + \frac{1}{n_{bY}} \sum_{j=1}^{n_{bY}} \operatorname{dist}\Bigl( \{\nabla v(\bx_{X,i})\}_{i},\ \by_{Y,j} \Bigr)^2 ,
\end{align*}
$$

and the total loss is $L_{\mathrm{PDE}} + \lambda L_{\mathrm{OT}}$. The first term corresponds to $\nabla v(\partial X) \subseteq \partial Y$ (the paper describes it as penalizing deviations from injectivity) and the second to $\partial Y \subseteq \nabla v(\partial X)$ (described as enforcing surjectivity). The formulation is general but computationally demanding. The authors also note that when source and target are the same square, the transport condition is equivalent to a Neumann condition and could be simplified, but they do not pursue this.

### The algorithm in short

Put together, one solve goes as follows.

1. Train the initial guess by Deep Ritz on the Poisson problem $\Delta u^0 = 2\sqrt{f}$ (the Pucci equation uses the same problem, which the paper says corresponds to $f = 0$, $\alpha = 1$; for optimal transport, take $\nabla u^0$ to be the identity map).
2. For $n = 0, 1, 2, \dots$: solve the projection pointwise at the collocation points to get $P^n(\bx_{c,i})$; starting from the previous network, minimize the Deep Ritz loss with Adam and then L-BFGS to get $u^{n+1}_{NN}$, resampling the collocation points with the Voronoi rule during training.
3. At the end of each outer iteration, compute the $L^2$, $H^1$ and $H^2$ errors against the exact solution (this is how the error curves in the experiments are produced).

## What the theory says \label{sec:theory}

This is a methods-and-experiments paper, and it contains no new theorem. The mathematical facts it relies on can be listed as follows, with the hypotheses as the paper states them.

:::proposition[Consistency of the splitting]{#prop:consistent}
(\cite[Sec. 2]{caboussat2026}) If $u \in H^2(\Omega)$ solves the Dirichlet problem $F(D^2 u) = 0$, $u = \varphi$, then $(u, P) = (u, D^2 u)$ solves the coupled problem $D^2 u = P$, $F(P) = 0$, $u = \varphi$.
:::

This goes in one direction only. Whether the iteration \eqref{eq:split} converges, and to which solution, is not proved in the paper; it refers to the finite element analysis in its references [10, 28, 29], where [28] is a 2026 work of Peruso and Sorella on the convergence of this splitting. We have not read these, so we do not restate their results. [TODO: read Peruso–Sorella 2026 and add the assumptions and statement of the convergence result for the splitting.]

:::proposition[Well-posedness of the variational step]{#prop:wellposed}
(\cite[Sec. 4.2]{caboussat2026}) The variational step $\min \{ \int_\Omega \abs{D^2 v - P^n}^2 : v \in H^2(\Omega),\ v|_{\partial\Omega} = \varphi \}$ is well-posed, because $\int_\Omega \abs{D^2 \cdot}^2$ is a norm on $H^2(\Omega) \cap H^1_0(\Omega)$.
:::

The paper does not state what it needs on $\Omega$, but a bounded Lipschitz domain is enough. For $v \in H^2(\Omega) \cap H^1_0(\Omega)$, integration by parts and the Poincaré inequality give $\norm{\nabla v}^2 = -\int_\Omega v \Delta v \le C_P \norm{\nabla v} \, \norm{\Delta v}$, and $\abs{\Delta v} \le \sqrt d\, \abs{D^2 v}$ pointwise, so $\norm{v}_{H^2(\Omega)} \le C \norm{D^2 v}_{L^2(\Omega)}$ and the two norms are equivalent. If $\varphi$ is moreover the trace of an $H^2(\Omega)$ function, the variational step is an $L^2$ projection onto the closed subspace $D^2(H^2(\Omega) \cap H^1_0(\Omega))$, so the minimizer exists and is unique. Networks generally do not lie in $H^2(\Omega) \cap H^1_\varphi(\Omega)$, so what is actually solved is the penalized problem; with a smooth enough activation, the network class lies in $H^2(\Omega)$. The paper gives no estimate of the error caused by the network approximation and the penalty.

:::theorem[Brenier]{#thm:brenier}
(As stated in \cite[Sec. 3]{caboussat2026}.) Let $\mu_0, \mu_1$ be absolutely continuous probability measures on $\R^d$ with compact supports $X, Y$, and with densities bounded above and below on their supports. Then, for the quadratic cost $c(\bx, \by) = \frac12 \abs{\bx - \by}^2$: (i) there is a unique optimal transport map $T$; (ii) there is a convex potential $u : X \to \R$ with $T = \nabla u$ $\mu_0$-a.e., and $u$ satisfies $\det D^2 u = \mu_0 / \mu_1(\nabla u)$ $\mu_0$-a.e. together with the transport boundary condition $\nabla u(\partial X) = \partial Y$.
:::

Strictly speaking, this combines two results. Brenier's theorem itself \cite[Theorem 4.22]{figalli2017} gives (i) and $T = \nabla u$. For the equation to hold in the Alexandrov or classical sense, one needs Caffarelli's regularity theory, which requires a convex target \cite[§4.6.1]{figalli2017}; the boundary condition $\nabla u(\partial X) = \partial Y$ further needs $\nabla u$ to be a homeomorphism up to the boundary, for instance when the densities are smooth and both domains are smooth and uniformly convex \cite[Remark 4.25]{figalli2017}. The disk and the ellipse of Section 7.1 of the paper satisfy these conditions; the square of Section 7.2 is convex but has corners.

:::proposition[Importance sampling]{#prop:is}
(\cite[Sec. 4.3]{caboussat2026}) For a strictly positive probability density $q$ on $\Omega$ and independent samples $X_i \sim q$, the estimator $\frac{1}{n_c} \sum_i \abs{D^2 v(X_i) - P^n(X_i)}^2 / q(X_i)$ is unbiased for $\int_\Omega \abs{D^2 v - P^n}^2$; formally, the variance-minimizing density is $q^\star = d / \int_\Omega d$ with $d = \abs{D^2 v - P^n}^2$.
:::

The Voronoi estimator $\widetilde{L}_{\mathrm{PDE}}$ actually used samples uniformly inside each cell; for given seeds, exact cell volumes and at least one point per cell ($n_s \ge 1$), it is unbiased too. But $n_s = n_c\, d(X_s) / \sum_j d(X_j)$ is generally not an integer, and cells with a small defect may receive no point. The paper says neither how $n_s$ is rounded nor how empty cells are treated, and Figures 6 and 10 of the paper do show large regions without collocation points.

Finally, ICNN convexity (Section \ref{sec:ritz}) holds for every parameter value with $W^{(l)} \ge 0$. An ICNN guarantees convexity, though, not a positive lower bound on the Hessian, so it does not guarantee uniform convexity.

## Experimental setup \label{sec:setup}

All experiments are two-dimensional and implemented in PyTorch. Error curves in the paper are averages over $10$ independent runs, with the 5th–95th percentile band shaded, and errors are computed only at the end of each outer iteration. Table \ref{tab:tests} lists all test problems.

:::table{#tab:tests}
| Paper sec. | Equation | Domain | Exact solution or data | Network | Interior / boundary points |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 6.1 | Monge–Ampère | $[0,1]^2$ | $u = e^{(\alpha/2)(x^2+y^2)}$, $\alpha = 1, 4$ | ICNN | 3000 / 300 |
| 6.2 | Monge–Ampère | $[0,1]^2$ | $u = -\sqrt{R^2 - (x^2+y^2)}$, $R = \sqrt2 + 0.01$ | ICNN | 3000 / 300 |
| 6.3 | Monge–Ampère | unit disk | $f = 1$, $g = 0$, $u = \frac12(x^2+y^2-1)$ | ICNN | 3000 / 300 |
| 6.4 | Pucci | $[0,1]^2$ | $u = -((x+1)^2+(y+1)^2)^{(1-\alpha)/2}$, $\alpha = 2, 3, 5$ | fully connected (softplus) | 3000 / 300 |
| 6.5 | Gauss curvature | $[0,1]^2$ | $u = \abs{\bx - \mathbf{b}}^2$, $\mathbf{b} = (\frac12, \frac12)$ | ICNN | 3000 / 300 |
| 7.1 | optimal transport | disk $\to$ ellipse | uniform densities, $\nabla u_{ex}$ known | ICNN | 1000 / 1000 |
| 7.2 | optimal transport | $[0,1]^2$ | three Gaussian-type densities | ICNN | not reported |

All test problems, from Sections 6 and 7 of the paper. The network column follows the rule of Section 5 of the paper (ICNN for problems with convex solutions); the paper does not say so separately for Section 7.
:::

The boundary penalty weight is $\lambda = 100$ in the first Monge–Ampère test and $\lambda = 1000$ for Pucci; it is not reported for the other tests. The PINN baseline follows Nyström and Vestberg \cite{nystrom2023}, and the captions of Figures 3 and 7 of the paper say that it uses the same total number of epochs. Beyond that, the PINN architecture, loss weights and optimizer settings are not reported. [TODO: check whether the Nyström–Vestberg PINN uses an ICNN or a trace penalty, and its network and optimizer settings, to judge how strong the 2/10 baseline is.]

## Dirichlet experiments \label{sec:dirichlet}

### Exponential solution \label{sec:exp}

The first test is Monge–Ampère on $\Omega = [0,1]^2$ with exact solution $u = e^{(\alpha/2)(x^2+y^2)}$. A direct computation gives $D^2 u = u\,(\alpha I + \alpha^2 \bx \bx^\top)$, hence

$$
f = \det D^2 u = \alpha^2 (1 + \alpha r^2)\, e^{\alpha r^2}, \qquad r = \abs{\bx}.
$$

$\alpha = 1$ is the standard benchmark; $\alpha = 4$ gives sharper gradients. Figure \ref{fig:data} shows why $\alpha = 4$ is much harder: along the diagonal, $f$ grows from $16$ at the origin to about $4.3 \times 10^5$ at $(1,1)$, a factor of about $2.7 \times 10^4$, and the largest Hessian eigenvalue grows from $4$ to about $2.0 \times 10^3$, whereas for $\alpha = 1$, $f$ only grows from $1$ to about $22$. (These numbers are our own, computed from the formula.)

:::figure{#fig:data .invert-dark}
![Right-hand side and largest Hessian eigenvalue of the three Monge–Ampère tests](./exact_data.svg)

Data of the three tests of Sections 6.1 and 6.2, computed from the exact solutions. Black solid line: $\alpha = 1$; black dashed line with open squares: $\alpha = 4$; black dotted line with open triangles: the solution of Section 6.2. (a) Right-hand side. (b) Largest eigenvalue of the Hessian. For $\alpha = 4$, $f$ spans more than four orders of magnitude and the largest eigenvalue nearly three; the solution of Section 6.2 blows up near $(1,1)$.
:::

The results are as follows.

- For $\alpha = 1$, the paper says that the PINN converges faster and Deep Ritz varies less (Figure 3 of the paper). Judging from that figure, on this test the final $L^2$ and $H^2$ error curves of the PINN lie below those of Deep Ritz without adaptive sampling, while the PINN loss shows clear recurring spikes. With adaptive sampling, the Deep Ritz errors decrease faster and end lower; the curves for $S = 30, 60, 150$ seeds nearly coincide, from which the authors conclude that more seeds beyond moderate values bring little (Figure 4 of the paper). The pointwise error plots show the error dropping faster with adaptive sampling (Figure 5 of the paper).
- For $\alpha = 4$, the authors report that the PINN becomes considerably less robust while Deep Ritz stays stable (Figure 7 of the paper). Judging from that figure, the PINN error band is wide and its mean error curves lie more than an order of magnitude above those of Deep Ritz (read from the plot, order of magnitude only). The gain from adaptive sampling is larger than for $\alpha = 1$ (Figures 8 and 9 of the paper), and the collocation points gather near $(1,1)$, where the solution and its derivatives vary fastest (Figure 10 of the paper).

The only quantitative comparison in the paper is Table \ref{tab:cost}: each method is run $10$ times, and the wall-clock time to bring the relative Hessian error below $5\%$ is recorded; runs that never reach the threshold enter the mean with the time at the cap. Figure \ref{fig:cost} plots the numbers.

:::table{#tab:cost}
| Method | $\alpha$ | Successes | Mean time (min) | Speed-up vs. Deep Ritz |
| :-- | :-: | --: | --: | --: |
| Deep Ritz | 1 | 10/10 | 6.01 | 1.00× |
| PINN | 1 | 10/10 | 1.61 | 3.72× |
| Adaptive Deep Ritz, $S = 30$ | 1 | 10/10 | 2.22 | 2.71× |
| Adaptive Deep Ritz, $S = 60$ | 1 | 10/10 | 2.11 | 2.84× |
| Adaptive Deep Ritz, $S = 150$ | 1 | 10/10 | 2.32 | 2.59× |
| Deep Ritz | 4 | 6/10 | 9.21 | 1.00× |
| PINN | 4 | 2/10 | 9.39 | 0.98× |
| Adaptive Deep Ritz, $S = 30$ | 4 | 10/10 | 3.58 | 2.57× |
| Adaptive Deep Ritz, $S = 60$ | 4 | 10/10 | 3.94 | 2.33× |
| Adaptive Deep Ritz, $S = 150$ | 4 | 9/10 | 4.12 | 2.24× |

Number of runs reaching a $5\%$ relative Hessian error, and mean wall-clock time, on the exponential test; data from Table 2 of the paper. Failed runs count with the time at the cap; the paper reports neither the cap nor the hardware.
:::

:::figure{#fig:cost .invert-dark}
![Success count and mean wall-clock time of each method](./table2.svg)

The numbers of Table \ref{tab:cost}, data from Table 2 of the paper. ADR stands for adaptive Deep Ritz. Colour marks the method: purple for Deep Ritz, green for the PINN, blue for ADR; hatched open bars are $\alpha = 1$, solid bars $\alpha = 4$. (a) Runs out of 10 with relative Hessian error below $5\%$. (b) Mean wall-clock time, with failed runs counted at the cap.
:::

The table says two things. For $\alpha = 1$ every method reaches the threshold and the PINN is fastest, $1.61$ minutes on average, less than a third of standard Deep Ritz; adaptive Deep Ritz takes about $2.1$ to $2.3$ minutes, slightly slower than the PINN. For $\alpha = 4$ the picture reverses: the PINN reaches the threshold in only $2$ runs, standard Deep Ritz in $6$, and adaptive Deep Ritz in $9$ to $10$, in about $3.6$ to $4.1$ minutes, a speed-up of roughly $2.2$ to $2.6$ over standard Deep Ritz. Since failed runs are timed at the cap, the PINN's $9.39$ minutes at $\alpha = 4$ mostly measures failure, not its actual convergence speed. Assuming one common cap $C$ for all runs, its range can be recovered: the PINN has $8$ failures and $2$ successes with times $t_1, t_2 \in (0, C]$, so $8C + t_1 + t_2 = 93.9$ gives $9.39 \le C < 11.74$ minutes (our own computation).

### A solution with sharp gradients \label{sec:sharp}

The second test has the exact solution

$$
u = -\sqrt{R^2 - (x^2 + y^2)}, \qquad R \ge \sqrt2 ,
$$

for which we compute $f = R^2 / (R^2 - r^2)^2$. For $R > \sqrt2$, $u \in C^\infty(\overline\Omega)$; at $R = \sqrt2$ the gradient is singular at $(1,1)$ and $u \notin H^2(\Omega)$. The paper takes $R = \sqrt2 + 0.01$, so that $f$ grows along the diagonal from about $0.49$ to about $2.5 \times 10^3$ (Figure \ref{fig:data}, our computation). The PINN and Deep Ritz reach comparable accuracy, with less variability for Deep Ritz (Figure 11 of the paper); adaptive sampling improves Deep Ritz further, is insensitive to the number of seeds (Figure 12), and makes the pointwise error smaller and more uniform (Figure 13). There is no timing comparison like Table \ref{tab:cost} for this test.

### The unit disk \label{sec:disk}

The third test takes $f = 1$, $g = 0$ on the unit disk, with exact solution $u = \frac12(x^2 + y^2 - 1)$. This is the convex solution $u_+$ of the [previous post](../mae-convexity-branch/) shifted by $-\frac12$; with the same boundary data, $-u = \frac12(1 - x^2 - y^2)$ also solves the equation and is the concave branch. An ICNN output is always convex, so the architecture rules out the concave solution. The authors use this test to show that curved boundaries need no change to the method (Figure 14 of the paper). They state that adaptive sampling reduces the pointwise error and spreads it more evenly (Figure 15 of the paper); in that figure, however, both rows share one color scale and look much alike in the later iterations.

### The Pucci equation \label{sec:pucci}

For the Pucci equation the projection uses the solver of \cite{caboussat2019}. Since convexity is not required, the network is a plain fully connected network with softplus activation, and $\lambda = 1000$. The exact solution is

$$
u = -\bigl((x+1)^2 + (y+1)^2\bigr)^{(1-\alpha)/2}, \qquad \alpha = 2, 3, 5 .
$$

A short computation, not in the paper, explains the setup. With $\rho = \abs{\bx + (1,1)}$, $u = -\rho^{1-\alpha}$ is radial; its radial eigenvalue is $u'' = -\alpha(\alpha-1)\rho^{-\alpha-1} < 0$ and its tangential eigenvalue is $u'/\rho = (\alpha-1)\rho^{-\alpha-1} > 0$, so $\alpha \lambda_+ + \lambda_- = 0$, i.e. $f = 0$. The solution is a saddle at every point, neither convex nor concave, which is why an ICNN cannot be used here. The method is reported to be stable and accurate for $\alpha = 2, 3, 5$ (Figure 16 of the paper). There is no PINN comparison for this test.

### The Gauss curvature equation \label{sec:gauss}

The last Dirichlet test is the Minkowski problem (in two dimensions the exponent is $(d+2)/2 = 2$):

$$
\det D^2 u = K(\bx)(1 + \abs{\nabla u}^2)^2 \quad \text{in } \Omega = [0,1]^2, \qquad K(\bx) = \frac{4}{(1 + 4\abs{\bx - \mathbf{b}}^2)^2}, \qquad \mathbf{b} = (\tfrac12, \tfrac12),
$$

with boundary data $g = \abs{\bx - \mathbf{b}}^2$ and exact solution $u = \abs{\bx - \mathbf{b}}^2$ (here $D^2 u = 2I$ and $\abs{\nabla u}^2 = 4\abs{\bx - \mathbf{b}}^2$, which is easy to check). Despite the gradient dependence, convergence is similar to the previous equations (Figure 17 of the paper), and adaptive sampling clearly reduces and evens out the pointwise error (Figure 18). There is no PINN comparison here either.

## Optimal transport experiments \label{sec:ot}

### Disk to ellipse

The source is the unit disk $X$ and the target the ellipse $Y = \{ (y_1 - 3.5)^2 / 2^2 + y_2^2 / 0.5^2 < 1 \}$, both with uniform density $1/\pi$ (the ellipse has area $\pi \cdot 2 \cdot 0.5 = \pi$, so both are probability densities). The exact solution is

$$
u_{ex}(\bx) = x_1^2 + \frac14 x_2^2 + \frac72 x_1 - \frac{5}{16}, \qquad \nabla u_{ex}(\bx) = \Bigl( 2x_1 + \frac72,\ \frac12 x_2 \Bigr),
$$

with $\det D^2 u_{ex} = 2 \cdot \frac12 = 1$, matching the ratio of the densities. Figure \ref{fig:ot} draws this map. The initial guess has $\nabla u^0$ equal to the identity, and the loss uses $1000$ interior and $1000$ boundary points. Figure 19 of the paper shows the error decreasing faster with adaptive sampling (the $L^2$ error is computed after removing the mean, since the potential is defined up to a constant). Figure 20 of the paper pushes forward $10^6$ uniform samples after $30$ outer iterations and compares the result with the exact target; the two are very close.

:::figure{#fig:ot .invert-dark}
![Exact optimal transport map from the unit disk to the ellipse](./ot_map.svg)

The exact map $\nabla u_{ex}$ of the test in Section 7.1, drawn from the formula given in the paper: black solid lines are the boundaries of the disk and the ellipse, the polar grid of the disk (thin grey lines) is mapped to a grid in the ellipse, and black dots and arrows show a few sample points and their images.
:::

### Gaussian-type densities

The second group of tests lives on $\Omega = [0,1]^2$, in increasing difficulty:

1. a Gaussian source $f_1 = c_1 \exp(-\abs{\bx - \bx_0}^2 / (2\sigma^2))$, $\bx_0 = (0.25, 0.75)$, $\sigma^2 = 0.25$, to the uniform target;
2. an anisotropic bimodal source $f_2$ with modes at $(0.5, 0.2)$ and $(0.5, 0.8)$, $\sigma_{xx}^2 = 0.25$, $\sigma_{yy}^2 = 0.015625$, to the uniform target;
3. the same bimodal source $f_2$ to a Gaussian target centred at $(0.5, 0.5)$ with $\sigma_g = 0.2$.

All densities are truncated to $\Omega$ and normalized. Figure 21 of the paper shows histograms of $10^6$ pushed-forward samples over the outer iterations, up to iterations $8$, $20$ and $80$ for the three tests. The authors observe a loss of accuracy along the line $y = 0.5$ in the last two tests: this line separates the two modes of the bimodal source and seems especially hard to approximate. The third test is the hardest and needs the most outer iterations. This section has histograms only and no error numbers; the text says the figure compares runs with and without adaptive sampling, but Figure 21 has a single row per test, and we cannot tell which variant it shows.

## What the results show \label{sec:discussion}

First, what they do show. On the exponential test, Table \ref{tab:cost} gives fairly clear evidence about robustness: on the easy problem the direct PINN is fastest, on the hard one its success rate drops to $2/10$, while the splitting with adaptive Deep Ritz stays at $9/10$ to $10/10$. At least on this test, the average behavior of a direct PINN can be good while its failure rate rises sharply as the problem gets harder; when evaluating a neural solver, success rates and percentiles over repeated runs say more than a single best run. We think the splitting is more robust here mainly because each Deep Ritz subproblem is a linear least-squares problem, with the nonlinearity and the constraint moved into the pointwise projection, and because the previous iterate is a good starting point for the next one; the paper has no experiment that separates these factors, though. Besides, the same framework covers Monge–Ampère, Pucci, Gauss curvature and optimal transport by changing only the projection solver and the network type, and the experiments do show this.

Then, what they do not show. The authors state that in the harder transport configurations, localized inaccuracies may persist despite more outer iterations, and they list higher dimensions and other nonlinearities as future work. Beyond that, we note the following.

- All experiments are two-dimensional, and the $\sigma_2$ equation listed in the paper is never tested.
- There are few quantitative results. Apart from Table \ref{tab:cost}, the paper reports no final error numbers, only error curves and pointwise error plots, and the relative Hessian error is not defined. Our descriptions of the paper's figures are therefore mostly qualitative.
- The PINN takes part only in Sections 6.1 and 6.2, and the timing comparison covers only the exponential test. The PINN architecture, whether it uses a convex network, its loss weights and its optimizer settings are not reported, so we cannot judge how much the $2/10$ depends on the baseline implementation.
- The conclusion says that Deep Ritz solves the linear variational problems more efficiently than traditional finite elements, but the paper contains no finite element timing or accuracy comparison. The timings also come without hardware or cap.
- Convergence of the splitting rests on the cited finite element literature. Which branch of $\{\det Q = f\}$ the projection lands on is not stated; convexity is guaranteed only by the ICNN, and how $W^{(l)} \ge 0$ is kept during training is not stated either. An ICNN gives convexity but not uniform convexity.
- Details of the adaptive sampling are missing: the rounding of $n_s$, the treatment of empty cells, and the update frequency are not stated in the text (Figures 6 and 10 of the paper show the resampled points every $10$ epochs).

## Summary

The paper carries the least-squares splitting from finite elements over to neural networks: the nonlinearity appears only in a pointwise projection, the network solves only a linear Deep Ritz problem, convexity comes from an ICNN, and collocation points are redistributed over Voronoi cells. On the exponential Monge–Ampère test, this is slightly slower than a PINN in the easy case and succeeds much more often in the hard case, and adaptive sampling cuts the time to threshold to less than half that of standard Deep Ritz. The same framework also handles the Pucci equation, the Gauss curvature equation and optimal transport with a transport boundary condition. All experiments are two-dimensional, however, the quantitative comparison is a single table, the PINN baseline is underspecified, and there is no convergence proof. How the method behaves in three or more dimensions, how it compares with a stronger PINN baseline and with finite elements, and whether the splitting provably converges are the questions we would most like answered after reading it.
