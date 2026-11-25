---
title: Tabs and callouts
lead: "Two shortcodes for writing: the same thing in several variants, and a note or warning beside the text."
weight: 3
---


## Tabs

Use tabs for the same content in variants: package managers, operating systems, languages.

```md
{{</* tabs group="install" */>}}
{{</* tab "npm" */>}}
    ```sh
    npm install my-lib
    ```
{{</* /tab */>}}
{{</* tab "pnpm" */>}}
    ```sh
    pnpm add my-lib
    ```
{{</* /tab */>}}
{{</* /tabs */>}}
```

(Without the indentation: it's only there to show the code fences inside.)

{{< tabs group="install" >}}
{{< tab "npm" >}}
```sh
npm install my-lib
```
{{< /tab >}}
{{< tab "pnpm" >}}
```sh
pnpm add my-lib
```
{{< /tab >}}
{{< tab "yarn" >}}
```sh
yarn add my-lib
```
{{< /tab >}}
{{< /tabs >}}
