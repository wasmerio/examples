---
title: "Maths and Code"
date: 2026-10-01
summary: "What a post with formulas and code looks like in Fieldnotes."
math: true
---


Inline maths like \(e^{i\pi} + 1 = 0\) and display maths:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

Long formulas stay inside the column on phones. In a sentence, the composite trapezoidal rule
\(\int_a^b f(x)\,dx \approx \frac{h}{2}\left(f(x_0) + 2f(x_1) + 2f(x_2) + \dots + 2f(x_{n-1}) + f(x_n)\right)\) breaks
across lines like words do; on its own line, a formula too wide to break scrolls sideways:

$$
\left\lVert u - u_h \right\rVert_{L^2(\Omega)} \le C h^{p+1} \left\lvert u \right\rvert_{H^{p+1}(\Omega)} \quad\text{for all}\quad u \in H^{p+1}(\Omega) \cap H^1_0(\Omega),\ h \to 0
$$

Code gets the theme's colours in light and dark mode:

```python
def trapezoid(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + i * h) for i in range(1, n)) + f(b) / 2)
```

> A quote, for good measure.

