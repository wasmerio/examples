# Grilling 决策记录

此处保存已经落地的取舍。当前契约以 SPEC 为准。

| 决策树分支 | 压力测试场景 | 结论 |
| --- | --- | --- |
| 项目边界 | 在已有大型博客上继续削减容易误伤原站 | 独立仓库，不迁移其他站点的文章 |
| 导航语义 | 没有汇总页，Blog 点击去哪 | 静态标签，Home 回到文章全集 |
| 极简与可发现 | 首页仅 Home 是否找不到其他页面 | 持续可见的小箭头和可访问名称；明确 Home 与展开分开 |
| 目录交互 | JS 失败还能不能换页 | 原生 details/summary，增强只处理关闭与焦点 |
| 正文方案 | 为接近参考是否要 Tailwind/MDX/渲染库 | Astro 内置 Markdown + GFM + Shiki，手写一份 prose CSS 即可 |
| 排版 | 原型比参考疏松且有胶囊 | 实测 65ch/16px/24px 与 28px 正文；移除胶囊、额外页脚和过大空白 |
| 发布模型 | 时区、草稿、未来日期、不合法日期 | 严格日历字符串；draft 唯一发布开关；无定时发布 |
| 可维护扩展 | 新增页面是否要做路由注册系统 | 原生文件路由 + 单一导航数组，承认新增文件这一步，不造插件系统 |
| SEO | 尚无新域名，是否借用旧域名或 example.com | 未配置不输出虚假 canonical；有效 SITE_URL 后输出真实值 |
| 检查与成本 | 小项目是否值得多框架测试/大量 agent | Node 原生测试 + 构建 HTML + 浏览器；一个实现者、每轮两个短审查 |
| 发布范围 | 是否附带 issue、托管或生产域名 | 公开源码与本地预览；不附带部署脚本或生产域名 |
| 配色 | 按本地时间自动切换，还是给读者按钮 | 按钮记住选择，未选择时跟随系统；时钟不能代表阅读环境 |

## 参考测量证据

来源 https://hyoban.cc 和 https://hyoban.cc/folo-database 的实际 computed styles：首页 main 65ch（约 655px），body padding 32px 16px；首页 h1 16/24、font-weight 400；年份列表单行 24px，相邻起点差 36px；介绍 margin-bottom 40px。正文 p 16/28、margin 20px；h2 16/20.8、600、margin 32px 0 8px；pre padding 16px、margin 24px，code 14px；系统字体，不需要下载字体包。
