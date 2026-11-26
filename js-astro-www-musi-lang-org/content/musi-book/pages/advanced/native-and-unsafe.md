---
title: "Native and unsafe"
description: "Keep native edges clear and small."
group: "Advanced forms"
section: "Advanced forms"
order: 2
slug: "native-and-unsafe"
summary: "`native` declares a host edge. `unsafe` marks code that needs extra care."
examples: "chapter-native"
---

# Native and unsafe

`native` declares a function that lives outside Musi. `unsafe` marks code that needs extra care.

{{snippet:chapter-native}}

Native code is an edge. Keep the edge small. Wrap it in a clear Musi function when the rest of the program should not see the raw call.

{{snippet:native-safe-wrapper}}

`export native` can expose a native declaration when a module must share that edge. Use it with care. The name becomes part of what other files may call.

`pin` belongs near unsafe work. It gives a stable handle for a value while the unsafe block needs it. Do not let that handle escape the small block that uses it.

Unsafe code is like opening a machine panel. It may be needed, but it should be small, named, and easy to inspect.

## Native boundary

Native declarations describe code that Musi does not implement directly.

```musi
native "c" let puts (msg : CString) : Int;
```

Treat a native declaration as an edge. Wrap it in a small Musi function that gives the rest of the program a clear type and policy.

## Unsafe block policy

Use unsafe code only where the operation cannot be expressed safely. Keep the block short, bind the result to a well-named value, and return to ordinary Musi code quickly.

Do not mix domain logic with unsafe setup. Domain rules should stay testable without the unsafe boundary.
