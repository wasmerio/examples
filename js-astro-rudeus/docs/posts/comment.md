---
title: 为博客配置评论
description: 为本主题配置评论系统的方法和示例
pubDate: 2026-03-19
category: 进阶技巧
tags: [博客, 评论]
---

由于本博客系统暂不决定内置对评论系统的支持，以下介绍 [Artalk](https://artalk.js.org/) 和 [Waline](https://waline.js.org/) 两种常见的评论系统的配置方法。

如果你使用的不是以上两种，也可以参考本文的步骤进行部署。

_（注：由于 Astro 的 ClientRouter 路由加载方式特殊，暂不建议你改动以下提到的组件内的其它代码。）_

### Artalk

首先打开 `src/layouts/BaseLayout.astro`，在 `<!-- 评论系统 -->` 注释后面引入相关前端资源。

```diff
@@ -28,4 +28,6 @@
     <title>{title}</title>
-    <!-- 评论系统 -->
+    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/artalk/2.9.1/Artalk.css">
+    <script is:inline src="https://cdnjs.cloudflare.com/ajax/libs/artalk/2.9.1/Artalk.js"></script>

```

然后打开 `src/components/Comment.astro`，你应该会看到存在以下的 script 标签。

```html
<script is:inline>
    const initComment = () => {
        // 评论系统初始化
    }
    initComment()

    // 注：Astro 视图切换后需重新初始化
    document.addEventListener('astro:page-load', initComment)
    document.addEventListener('astro:after-swap', initComment)
</script>
```

在 `// 评论系统初始化` 注释的函数内，就可以写 Artalk 评论系统初始化函数了。

```diff
@@ -102,4 +102,6 @@
const initComment = () => {
-    // 评论系统初始化
+    if (!document.querySelector('.r-comment')) return
+    Artalk.init({
+        el: '.r-comment',
+        server: 'https://artalk-server.example.com',
+        site: '博客名称',
+    })
}
// ...
```

如果设置正确，那么你应该可以看到评论区已经初始化完成：
![Artalk 初始化完成](https://i.cdn.crrashh.com/2026/0315/01958dddc59900b9)

### Waline

首先，和 Artalk 一样，在 `src/layouts/BaseLayout.astro` 引入前端资源。

```astro
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
```

然后打开 `src/components/Comment.astro`，你应该会看到存在以下的 script 标签。

由于 Waline 的 JS 是通过 ES Module 方式引入的，我们需要先给标签加上 `type="module"` 属性，然后才能引入文件，再在 `// 评论系统初始化` 注释的函数内写 Waline 评论系统初始化函数。

```diff
@@ -102,4 +102,6 @@
-<script is:inline>
+<script is:inline type="module">
+    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js'
+
    const initComment = () => {
-        // 评论系统初始化
+        init({
+            el: '.r-comment',
+            serverURL: 'https://waline-server.example.com',
+        })
    }
    initComment()

    // 注：Astro 视图切换后需重新初始化
    document.addEventListener('astro:page-load', initComment)
    document.addEventListener('astro:after-swap', initComment)
</script>
```

如果设置正确，那么你应该可以看到评论区已经初始化完成：
![Waline 初始化完成](https://i.cdn.crrashh.com/2026/0315/c490f751b0d2c4af)
