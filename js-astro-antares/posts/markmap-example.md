---
title: 'Markmap Example'
titleIcon: https://markmap.js.org/favicon.png
titleColor: '#D19028|#F8E71C'
tags: [ markmap ]
categories: [ 'Astro', 'Demo' ]
description: |
  This theme comes with the [remark-markmap](https://github.com/coderxi1/remark-markmap) integration installed and configured in your plugins/index.js file.  
  本主题附带 remark-markmap 集成，并在你的 plugins/index.js 文件中配置。
---

:::note{type=info}
This theme comes with the [remark-markmap](https://github.com/coderxi1/remark-markmap) integration installed and configured in your `plugins/index.js` file.  
本主题附带 [remark-markmap](https://github.com/coderxi1/remark-markmap) 集成，并在你的 `plugins/index.js` 文件中配置。
:::

# 效果

````markmap
---
title: markmap
style: |
  #${id} {
    height: 300px;
    width: 100%;
  }
  @media (min-width: 1280px) {
    #${id} {
      height: 600px;
    }
  }
options:
  colorFreezeLevel: 2
---

## Links

- [Website](https://markmap.js.org/)
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim
- [markmap-vscode](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) for VSCode
- [eaf-markmap](https://github.com/emacs-eaf/eaf-markmap) for Emacs

## Features

Note that if blocks and lists appear at the same level, the lists will be ignored.

### Lists

- **strong** ~~del~~ *italic* ==highlight==
- `inline code`
- [x] checkbox
- Katex: $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$ <!-- markmap: fold -->
  - [More Katex Examples](#?d=gist:af76a4c245b302206b16aec503dbe07b:katex.md)
- Now we can wrap very very very very long text based on `maxWidth` option
- Ordered list
  1. item 1
  2. item 2

### Blocks

```js
console.log('hello, JavaScript')
```

| Products | Price |
|-|-|
| Apple | 4 |
| Banana | 2 |

![](https://markmap.js.org/favicon.png)
````

# 源码

`````markdown title=markmap-example.md
---
title: 'Markmap Example'
tags: [ markmap ]
categories: [ 'Astro', 'Demo' ]
description: |
  This theme comes with the [remark-markmap](https://github.com/coderxi1/remark-markmap) integration installed and configured in your plugins/index.js file.  
  本主题附带 remark-markmap 集成，并在你的 plugins/index.js 文件中配置。
---

:::note{type=info}
This theme comes with the [remark-markmap](https://github.com/coderxi1/remark-markmap) integration installed and configured in your `plugins/index.js` file.  
本主题附带 [remark-markmap](https://github.com/coderxi1/remark-markmap) 集成，并在你的 `plugins/index.js` 文件中配置。
:::

````markmap
---
title: markmap
style: |
  #${id} {
    height: 300px;
    width: 100%;
  }
  @media (min-width: 1280px) {
    #${id} {
      height: 600px;
    }
  }
options:
  colorFreezeLevel: 2
---

## Links

- [Website](https://markmap.js.org/)
- [GitHub](https://github.com/gera2ld/markmap)

## Related Projects

- [coc-markmap](https://github.com/gera2ld/coc-markmap) for Neovim
- [markmap-vscode](https://marketplace.visualstudio.com/items?itemName=gera2ld.markmap-vscode) for VSCode
- [eaf-markmap](https://github.com/emacs-eaf/eaf-markmap) for Emacs

## Features

Note that if blocks and lists appear at the same level, the lists will be ignored.

### Lists

- **strong** ~~del~~ *italic* ==highlight==
- `inline code`
- [x] checkbox
- Katex: $x = {-b \pm \sqrt{b^2-4ac} \over 2a}$ <!-- markmap: fold -->
  - [More Katex Examples](#?d=gist:af76a4c245b302206b16aec503dbe07b:katex.md)
- Now we can wrap very very very very long text based on `maxWidth` option
- Ordered list
  1. item 1
  2. item 2

### Blocks

```js
console.log('hello, JavaScript')
```

| Products | Price |
|-|-|
| Apple | 4 |
| Banana | 2 |

![](https://markmap.js.org/favicon.png)
````
`````