---
title: "Quote and syntax"
description: "Build syntax as a value."
group: "Advanced forms"
section: "Advanced forms"
order: 3
slug: "quote-and-syntax"
summary: "`quote` builds syntax. Splices insert known syntax pieces."
examples: "chapter-quote-and-syntax"
---

# Quote and syntax

`quote` lets code build syntax as a value.

{{snippet:chapter-quote-and-syntax}}

Use quote when code needs to describe code. This is not normal data modeling. It is for tools and advanced generation.

A splice with `#` inserts a known syntax piece into a quoted form. Think of it like placing a prepared sticker into a form.

Keep quoted syntax small. Generated code is harder to read than direct code.

## Quote shape

A quote builds syntax as a value for tools.

```musi
let nameSyntax := quote {
  let total := 42;
};
```

Use quote when the output is code or code-like structure. Use records and arrays for ordinary data.

## Splice shape

`#` inserts syntax that was prepared outside the quote.

```musi
let delta := quote (2);
let generated := quote {
  let total := 40 + #delta;
};
```

Keep splices named. A named splice tells readers what generated piece is entering the quoted form.
