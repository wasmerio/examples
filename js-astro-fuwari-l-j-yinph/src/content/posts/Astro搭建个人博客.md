---
title: Astro搭建个人博客
published: 2024-09-02
description: 该博客会详细介绍如何使用Cloudflare和Netlify来进行个人博客的部署。（保姆级教程！）
image: 'https://pic.imgdb.cn/item/66cec50ad9c307b7e94d8e24.png'
tags: [Astro]
category: '技术Tech'
draft: false 
---

大家好，我是零界。

今天给大家带来一篇关于如何使用Astro快速搭建个人博客的文章。

直接进入正题：

## 一、准备工作

- 在<a href="https://astro.build/themes/">Astro</a>挑选一个自己心仪的博客模板
- 安装<a href="https://nodejs.cn/">nodejs</a>
- 一个<a href="https://github.com/">GitHub</a>账号，并建一个仓库
- 一个<a href="https://dash.cloudflare.com/">Cloudflare</a>账号
- 一个<a href="https://www.netlify.com/">Netlify</a>账号
- 最好下载<a href="https://code.visualstudio.com/">VS Code</a>，方便以后修改博客

:::note[注意！]
Astro每个主题就是一个项目，为了避免频繁迁移项目，请先选好自己要使用的主题。
:::

## 二、下载代码并配置

在Astro，我们可以看到很多博客模板。这里我挑了<a href="https://astro.build/themes/details/frosti/">Frosti</a>来使用，并作为例子给大家介绍一下。

![Frosti](https://s3.bmp.ovh/imgs/2024/08/28/868cd18a7a788f27.png)

点击进入，我们点按钮“get started”，进入Frosti的GitHub仓库。（如打不开可在网上下载加速器<a href="https://steampp.net/">Watt Toolkit</a>）

![Frosti](https://s3.bmp.ovh/imgs/2024/08/28/e0b37c4c4f600ccb.png)

然后点击仓库中“Code”按钮，点击“Download ZIP”下载Frosti的源码。

如果你会使用git，可以直接使用`git clone`

![下载Frosti源码](https://s3.bmp.ovh/imgs/2024/08/28/ab46924cc60b2d6a.png)

最终都会下载了一个压缩包，你可以解压到任意位置。

打开解压后的代码文件夹中按Win+ R，输入`cmd`，打开命令行。输入代码`npm install`，等待安装完成.

```cmd
npm install
```

![安装依赖](https://s3.bmp.ovh/imgs/2024/08/28/527ebe3f2d0594aa.png)

等它安装完毕，没有报错，接着输入`npm run dev`，等待项目启动。

```cmd
npm run dev
```

![项目启动](https://s3.bmp.ovh/imgs/2024/08/28/01d1140f0e8f5264.png)

想要进行后续修改，我们可以使用VS Code。

![VS Code](https://s3.bmp.ovh/imgs/2024/08/28/b859cad1c10517e5.png)

![](https://s3.bmp.ovh/imgs/2024/08/28/4b1c93f3b8d77ef7.png)

然后进行修改就可以了。如有不明白的地方可以联系本作者或项目开发者。

以下是一般需要修改的文件：

- `src/const.ts` 常量、配置文件
- `src/content/blog` 博客所在的文件夹
- `src/pages/` 页面所在的文件夹（如Home, About等等）
- `public/profile.webp` 头像图片

## 三、上传至Github仓库

还记得我开头说要有Github账号并建一个仓库不？（不记得快去看开头！）

我们打开Github，点击右上角的加号，选择New repository（即第一个选项）。

接下来看图操作即可：

![新建仓库](https://s3.bmp.ovh/imgs/2024/08/28/ff51b1fd113930fd.png)

仓库建好后，点击“Add file”按钮，并点“Upload files”，进入上传页面。

![](https://s3.bmp.ovh/imgs/2024/08/28/22430615356614d2.png)

接着，选中你的文件，上传上去。稍等片刻，点击下方按钮“Commit changes”即可。

![](https://s3.bmp.ovh/imgs/2024/08/28/70a037d31eac5701.png)

然后，你的代码文件就上传上去了！

当然，会使用git的也可以自行使用`git push`上传。

## 四、开始部署

### ①使用Netlify

Netlify是一个静态网站托管平台，还是Astro官方部署合作伙伴，可以很方便、快捷地将你的代码部署到网上。

直接用Github登录后，会弹出一个页面。根据自己实际情况填写即可。弄好后点击“Continue to deploy”。

![Netlify](https://s3.bmp.ovh/imgs/2024/08/28/beba8a0cc13dca36.png)

完成后，会让你连接仓库。我们选择Github。

![](https://s3.bmp.ovh/imgs/2024/08/28/8b1a60eb460693fc.png)

随后会弹出你要链接的仓库。点击我们上传后的仓库即可。Netlify会自动检测你的仓库，并自动部署。

稍等片刻，Netlify会自动部署你的网站。

部署好后，Netlify会自动生成一个链接，点击即可访问你的网站。

你可以在左边菜单栏中找到“Site configuration”，点“Change site name”即可更改域名。

![](https://s3.bmp.ovh/imgs/2024/08/28/be28a3bcc5441c18.png)

至此，我们的博客就搭建好了！

### ②使用Cloudflare

同样，我们也可以用Github登录Cloudflare，（但是我一开始不知道，用邮箱创建账号😂）然后点“Workers和Pages”。

![](https://s3.bmp.ovh/imgs/2024/08/28/6172914b3b4a523d.png)

点击“创建”按钮后，点“Pages”跳到连接仓库的页面

![](https://s3.bmp.ovh/imgs/2024/08/28/b16ed122316049d6.png)

选择放置博客代码的仓库，并点“开始设置”。

![](https://s3.bmp.ovh/imgs/2024/08/28/2c3999804476bee4.png)

接下来看图操作即可：

![](https://s3.bmp.ovh/imgs/2024/08/28/dea5a85c24076aa6.png)

稍等片刻，Cloudflare也会自动部署你的网站。

如果出现下图的情况，那么恭喜你，你的博客已经部署完成了！

![](https://pic.imgdb.cn/item/66ceb09fd9c307b7e9326cda.png)

后续想要修改内容，只需要上传到Github仓库，Cloudflare和Netlify会自动检测并更新你的网站。

## 五、结语

部分文字来源于<a href="https://yaoqx.netlify.app/blog/2024-08-15/">Astro + Cloudflare pages 快速搭建个人博客</a>，在此声明。

希望这篇文章能帮助你们！如果你有任何问题，欢迎在评论区留言。

OK，以上就是今天要讲的内容。大家喜欢就点个赞吧，我会尽快更新！ヾ(•ω•`)o！