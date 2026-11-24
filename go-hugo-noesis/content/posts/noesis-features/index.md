---
title: "Noesis Features"
date: 2018-12-19T10:35:35-05:00
description: "Hugo combined with the Noesis theme turns easy-to-write Markdown into polished web pages. KaTeX, Hugo's Chroma highlighter, and Hugo's Markdown renderer support mathematical symbols, equations, highlighted code, tables, lists, and much more."
categories: ["Features"]
displayInMenu: false
displayInList: true
draft: false
resources:
- name: featuredImage
  src: "noesis-iphone.png"
  params:
    description: "An iPhone with a website featuring the noesis theme"
---


Hugo combined with the Noesis theme turns easy-to-write Markdown into polished web pages. KaTeX, Hugo's Chroma highlighter, and Hugo's Markdown renderer support mathematical symbols, equations, highlighted code, tables, lists, and much more.

For each feature below, the first line is the Markdown and the second line is the result after Hugo and KaTeX process it. You can find many more features in the Hugo documentation.

## LaTeX style math typesetting with KaTeX

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

