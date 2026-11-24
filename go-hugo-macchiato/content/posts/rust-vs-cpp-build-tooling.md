---
title: "What Rust's Tooling Gets Right (and C++ Still Doesn't)"
date: 2026-06-02
description: "Cargo spoiled me. Notes from building a Go-based build tool for C++ projects."
tags: ["cpp", "rust", "tooling", "go"]
---


Cargo's biggest trick isn't any single feature — it's that dependency resolution, builds, tests,
and publishing all live behind one consistent command.

```rust
fn main() {
    let deps = resolve_dependencies("Cargo.toml").expect("failed to resolve deps");
    for dep in deps {
        println!("resolved: {} = {}", dep.name, dep.version);
    }
}
```

C++ has no equivalent by default — you reach for CMake, then Conan or vcpkg, then whatever
your CI happens to expect. That gap is exactly what pushed me to build a small Cargo-inspired
build tool for C++, written in Go.

{{< note >}}
This isn't a takedown of CMake — it's a genuinely flexible build system generator. The complaint
is about the *absence of an opinionated default*, not about CMake itself.
{{< /note >}}

## A minimal manifest

```toml
[package]
name = "mathlib"
version = "0.1.0"

[dependencies]
fmt = "10.1.1"
```

That's the whole surface area a new contributor needs to understand before they can build the
project. No toolchain files, no `find_package` incantations, no guessing which generator to pass.

Read the follow-up on the actual [build graph resolution](#) once it's written.

