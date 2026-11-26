# cloverta-blog项目结构设计

## 1. 总体设计

- 网站包括中文版、英文版
  - 将网站的标题（Half Price! 半价便当同好会！）、背景文字（HP BEN-TO、Half Price）、导航栏、页脚的声明等非写作内容分别制作i18n的ts文件，供网站的两个版本使用。（首页和其他页面的介绍、关于页面中的介绍等另行规定）
  - 中文和英文的路由分别是`blog.cloverta.top/zh/`和`blog.cloverta.top/en/`
- 网站的用户创作内容（首页和其他页面的介绍、关于页面中的介绍、博文等）均使用markdown。要区分中文和英文的两个版本。统一放在一个目录中管理，且每个md文件对应的内容需明确。
- 网站是基于[SanYeCao-blog](https://github.com/ClovertaTheTrilobita/SanYeCao-blog)的重构，本地路径[SanYeCao-blog](~/Projects/SanYeCao-blog)。关于评论区remark42的API等徐遵循原项目，以保持兼容性。
- 尽可能地使用Tailwind等库，保持代码干净，避免重复造轮子。

## 2. 首页

- 和效果图一致。效果图中的一些轻微的几px的不对齐需要帮我修正。Header和Footer在最终网站中应该无论在哪个页面都在顶部和底部的同一位置。
- 点击“最新博文”下的“查看更多>>>”跳转归档页。
- 点击“栏目更新”下的“查看更多>>>”跳转栏目页。
- 点击“最近评论”下的“展开更多”，应当展开更多的4个评论。
- 页脚的GitHub icon对应的链接指向[github.com/ClovertaTheTrilobita/](https://github.com/ClovertaTheTrilobita/)，邮件icon对应[邮件链接](mailto:cloverta@petalmail.com)，"source code"对应的链接指向[ClovertaTheTrilobita/astro-blog-template](https://github.com/ClovertaTheTrilobita/astro-blog-template)
- 鼠标放上对应的导航栏选项会有动画：字体放大的同时下方从左到右延伸出装饰线条

## 3. 栏目

- 用户的每条短的栏目贴文应以单独的md文件放在某一目录中集中保存
  - 例如“便当&饭团！便利店熟食评鉴”栏目下的每一篇文章，应放在`.../<lang>/.../bento/post1.md`、`.../<lang>/.../bento/post2.md`并在`.../bento/`目录的根目录用ts定义好栏目的内容（如标题等）。（`<lang>`表示可能是`zh/`或`en/`）
  - 在栏目页点击"查看帖子>>>"时，套用普通博文的模板进入博文页。
  - 如果有更好的想法可以暂停并跟我提出来。
- 栏目页的rss和首页的博文rss分开。

## 4. 博文页

- 与原项目保持相近即可。但是视觉上要符合设计图。
- 需要分为zh和en两个版本，和原项目相似。
- 优化原项目中繁杂的css代码。

## 5. 友链页

- 鼠标悬浮在友链卡片上时会有浮起特效，下面的蓝色矩形稍微分离呈阴影特效。

## 6. 标签页

- 和原项目保持相近即可。但是视觉元素上需要更符合现在的设计。

## 7. 关于页

- 由用户自定义markdown渲染。
- 需要分为zh和en两个版本

## 8. 归档页

- 和设计图相同即可，需要根据markdown文件中定义的时间自动分类。
- 仅包含博文，不包括栏目中的帖子。

## 9. 黑夜模式

- 遵循设计图的配色。