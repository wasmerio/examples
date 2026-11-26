---
title: "Packages"
description: "Group files into one project."
group: "Organization"
section: "Organization"
order: 2
slug: "packages"
summary: "A package gives files a home and declares how the project runs."
examples: "chapter-packages"
---

# Packages

A package groups files that belong to one project. It gives the project a home.

{{snippet:chapter-packages}}

Package settings tell tools where to start and how to check the project. App code can then stay focused on app behavior.

Think of a package like a folder for one job: one small tool, one service, or one library.

Keep package names boring and clear. A clear name helps error messages and command output.

## Package purpose

A package gives tools one project boundary. It is where commands can find entry files, source files, tests, and dependencies.

Use one package for one deliverable. A command-line tool, a service, and a library usually deserve separate package boundaries.

## Names and entry points

Package names appear in diagnostics and generated paths, so use plain names.

```text
server
server-cli
server-tests
```

Avoid names that describe a temporary implementation detail. Prefer the thing the package provides.
