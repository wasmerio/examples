---
title: Rudeus 主题样式预览
description: 本页用于展示 Rudeus 主题的基本 Markdown 样式
pubDate: 2026-01-07
category: 基础使用
tags: [主题, 预览]
image: https://i.cdn.crrashh.com/2026/0114/bc5f9542790ed032
---

> 封面图 Pixiv ID：123999588

# Hello, world!

## 段落及行内样式

这是使用 **Astro** 构建的博客框架。这是使用 _Astro_ 构建的博客框架。这是使用 **_Astro_** 构建的博客框架。这是使用 ~~Astro~~ 构建的博客框架。这是使用 `Astro` 构建的博客框架。

本项目的开源地址：[crrashh1542/astro-theme-rudeus](https://github.com/crrashh1542/astro-theme-rudeus)

回到[文档主页](/)

（注：站内链接为当前标签内打开，站外链接为新标签内打开）

## 列表

1. 中央大陆
    - 阿斯拉王国
    - 西隆王国
    - 王龙王国
    - 剑之圣地
2. 米里斯大陆
    - 米里斯圣国
    - 德路迪亚村
3. 魔大陆
    - 米格路德族聚落
    - 利卡里斯城
    - 涅克罗斯要塞

## 图片

![Pixiv ID 121853651](https://i.cdn.crrashh.com/2026/0114/9337fa99f225e30c)
作品 Pixiv ID：121853651

## 引用

> 所以，该结束了。
>
> 这个会令我想一直沉浸在其中的梦。开朗又温柔的，塞妮丝的梦。
>
> 我举手朝向塞妮丝，碰了她的头。
>
> 「妈妈，一直以来谢谢你。」
>
> 然后将灌注全力的岩砲弹，击向塞妮丝。
>
> ……
>
> 总觉得做了非常悲伤的梦。

## 表格

| 名字       | 代表色  | 寿命 |
| ---------- | ------- | ---- |
| Rudeus     | 橙黄色  | 74   |
| Sylphiette | 绿/白色 | 150+ |
| Eris       | 红色    | 74   |
| Roxy       | 蓝色    | 200+ |
| Orsterd    | 白色    | ?    |

## 代码块

```javascript
export default function () {
    console.log('Hello, world!')
}
```

## 任务列表

- [x] 和七星交谈
- [ ] 给艾莉丝写信
- [x] 怀疑人神但不要与人神为敌

## 自定义 HTML

**注：以下内容搜集自网络资源站，仅用于测试自定义 HTML 功能，若侵权请联系删除。**

### 音频播放（APlayer）

<div id="ap-0"></div>
<link rel="stylesheet" href="https://lf3-cdn-tos.bytedcdn.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.css" />
<script>
    let scriptA = document.createElement('script')
    scriptA.src = 'https://lf3-cdn-tos.bytedcdn.com/cdn/expire-1-M/aplayer/1.10.1/APlayer.min.js'
    scriptA.onload = () => {
        new APlayer({
            container: document.getElementById('ap-0'),
            lrcType: 3,
            loop: 'none',
            audio: [
                {
                    name: 'spiral',
                    artist: 'LONGMAN',
                    cover: 'https://i.cdn.crrashh.com/2026/0114/47fdbcc3a278e0ab',
                    url: 'https://nos.netease.com/ysf/f4ec70e402ef149dd606d1a068dfa464.mp3',
                    lrc: 'https://nos.netease.com/ysf/475a9271c275162b06e98de8e3afb653.lrc'
                },
                {
                    name: '夜的第七章',
                    artist: '周杰伦',
                    cover: 'https://i.cdn.crrashh.com/2026/0114/3808056776778770',
                    url: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_5673241091_1767601729441_qdqqd_mpyue3.mp3',
                    lrc: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_5677168484_1767601765484_qdqqd_mmo7nr.lrc'
                },
                {
                    name: '我想part2',
                    artist: '法老/杨秋儒',
                    cover: 'https://i.cdn.crrashh.com/2026/0114/b7ff948991202701',
                    url: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1767776336713_qdqqd_s8tikn.mp3',
                    lrc: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1767776244109_qdqqd_qajl5u.lrc'
                },
                {
                    name: '夜に駆ける',
                    artist: 'YOASOBI',
                    cover: 'https://i.cdn.crrashh.com/2026/0114/aff4bd391546f5b7',
                    url: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_885190757_1767602419737_qdqqd_bgfe3k.mp3',
                    lrc: 'https://s3plus.meituan.net/opapisdk/op_ticket_1_5677168484_1767602492030_qdqqd_l5zivl.lrc'
                }
            ]
        })
    }
    document.head.appendChild(scriptA)
</script>

### 视频播放（DPlayer）

<div id="dp-0"></div>
<script>
    let scriptD = document.createElement('script')
    scriptD.src = 'https://lf3-cdn-tos.bytedcdn.com/cdn/expire-1-M/dplayer/1.26.0/DPlayer.min.js'
    scriptD.onload = () => {
        new DPlayer({
            container: document.getElementById('dp-0'),
            screenshot: true,
            video: {
                url: 'https://i.cdn.crrashh.com/2026/0114/599c54bbd3241eba',
                type: 'hls',
                pic: 'https://i.cdn.crrashh.com/2026/0114/e08ef7794c3a9a1e',
            }
        })
    }
    document.head.appendChild(scriptD)
</script>

~~父亲节特辑说是~~

注：由于路由的加载情况特殊，如果需要从外部引入 JS 脚本，请不要使用以下方式：

```html
<script src="path/to/foo.js"></script>
<script>
    console.log(foo)
</script>
```

因为这会导致每次重载页面的时候，下方的 `<script>` 同时加载，导致其中部分来自 `src` 中的变量无法读取。以下是正确姿势：

```html
<script>
    // 通过 JS 动态创建 script 标签
    let script = document.createElement('script')
    script.src = 'path/to/foo.js'
    // 等到加载完再执行程序体
    script.onload = () => {
        console.log(foo)
    }
</script>
```
