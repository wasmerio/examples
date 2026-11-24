---
title: "Aether Features"
date: 2018-12-19T10:35:35-05:00
description: "Hugo combined with the Aether theme turns easy to write markdown into powerful web pages.  KaTeX, Highlight.js, and Hugo provides the ability to create mathmatical symobols, equations, highlighted code, tables, lists, and much more."
categories: ["Features"]
dropCap: true
displayInMenu: false
displayInList: true
draft: false
resources:
- name: featuredImage
  src: "mdd-iphone.jpg"
  params:
    description: "An iphone with a website featuring the aether theme"
---


Hugo combined with the Aether theme turns easy to write markdown into powerful web pages.  KaTeX, Highlight.js, and Hugo provides the ability to create mathmatical symobols, equations, highlighted code, tables, lists, and much more.

For each feature below, the first line is the markdown and the second line is the result after Hugo, KaTeX, and Highlight.js process the markdown.  You can find many more features in the Hugo documentation.

## LaTeX style math typsetting with KaTeX

```md
{{</* raw */>}}
\[u(t) = K_p e(t) + K_i \int_{0}^{t} e(\tau) d\tau + K_d \frac{de(t)}{dt} \]
{{</* /raw */>}}
```

{{< raw >}}
\[u(t) = K_p e(t) + K_i \int_{0}^{t} e(\tau) d\tau + K_d \frac{de(t)}{dt} \]
{{< /raw >}}

## Code (Supports many programming languages and formats)

````md
```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```
````

```javascript
var s = "JavaScript syntax highlighting";
alert(s);
```

## Inline code

```md
Here is `var s = "Hello World"` inline code
```

Here is `var s = "Hello World"` inline code

