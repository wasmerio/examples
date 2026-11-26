# 修复复核与依赖升级记录

日期：2026-09-07。范围：上一轮 F1–F9 修复后的工作树、依赖升级，以及后续浏览器回归。
开始时已有未提交修改，均保留；本轮没有提交、推送或部署。

## 结论

上一轮修复在升级前后均通过现有回归检查，已检页面与交互未发现阻断性回归。
本轮额外修复了复杂正文横向溢出、内容回归依赖演示封面、发布验证遗漏内容回归的问题。
依赖审计最初报告 13 条通告（8 high、5 moderate），最终审计为 0。
这些是依赖树通告，不等同于 13 个可从静态网站直接利用的漏洞。

## 已完成的升级

版本来自当日 npm registry 的稳定版本元数据，并核对官方发布说明和 peer 依赖。

| 直接依赖 | 升级前 | 升级后 |
| --- | --- | --- |
| Astro | 7.1.3 | 7.3.1 |
| @astrojs/mdx | 7.0.8 | 8.0.0 |
| @astrojs/check | 0.9.9 | 0.9.10 |
| @astrojs/sitemap | 3.7.3 | 3.7.4 |
| astro-seo | 1.1.0 | 1.2.0 |
| Sharp | 0.35.0 | 0.35.4 |
| UnoCSS | 66.7.5 | 66.10.0 |
| Vitest | 4.1.10 | 5.0.0 |

Astro 7.3.1 包含 `astro:assets` 启动/构建修复。MDX 8 将处理委托给 Markdown processor，
当前项目使用默认处理器，无需新增配置；实际 MDX 表达式与表格已构建验证。
来源：[Astro 7.3.1](https://github.com/withastro/astro/releases/tag/astro%407.3.1)、
[MDX 8](https://github.com/withastro/astro/releases/tag/%40astrojs%2Fmdx%408.0.0)、
[Vitest 5 迁移说明](https://vitest.dev/guide/migration/)。

TypeScript 保留 6.0.3：最新稳定版虽为 7.0.2，但
[@astrojs/check 0.9.10 的 peer 约束](https://registry.npmjs.org/@astrojs%2Fcheck/0.9.10)
为 `^5.0.0 || ^6.0.0`。本轮没有放宽 peer 检查强行升级。
其他图标包与 YAML 直接依赖已是查询时的最新稳定版。pnpm 继续使用项目锁定的 11.16.0。

间接依赖同时更新为 `fast-uri 3.1.7`、`undici 7.29.1`、`js-yaml 4.3.2`、
`postcss 8.5.28`、`nanoid 3.3.18`。保留兼容主版本；更新旧 override，并清理对应的过期
发布时间例外。PostCSS/Nanoid 的 override 只针对受影响版本范围。
代表性通告：[PostCSS](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp)、
[Undici](https://github.com/advisories/GHSA-4cwx-7wf7-3272)、
[Fast URI](https://github.com/advisories/GHSA-5jgf-p345-68v8)、
[Nanoid](https://github.com/advisories/GHSA-2v37-7h3g-55p8)、
[JS-YAML](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj)。

## 本轮补充修复

| 问题 | 证据与影响 | 已实施修复 |
| --- | --- | --- |
| P2：宽表格、超长正文令整页溢出 | 320 px 移动视口插入长标识符与十列表格后，页面 scrollWidth 达 3404 px，浏览器缩放了布局 | `src/layouts/Layout.astro:313` 为正文启用长词换行；表格限制宽度并独立横向滚动；`src/scripts/layout-ui.ts:226` 让未指定 tabindex 的表格可键盘聚焦 |
| P2：内容回归依赖演示封面 | 在隔离副本中移除原集合后，原检查因没有 WebP 图片而失败，即使无封面内容合法 | `scripts/check-content-variants.mjs:41` 在副本中创建完整独立样例和测试图片，删除演示文章也不影响测试 |
| P2：发布与模板更新没有执行内容回归 | 原本只在 CI 单独调用 `test:content`；发布和模板更新只运行 `verify` | `package.json` 将内容回归纳入 `verify`，移除 CI 的重复调用；三个流程复用同一入口 |

Astro 7.3.1 的 glob loader 在目录无文件时仍会提前返回，因此保留 `build --force`，
避免清空集合后读取旧内容缓存。没有在本轮删除这一必要保护。

## 升级阶段验证结果

- 升级前完整验证与原内容回归均通过，确认基准状态。
- 升级后完整 `pnpm verify` 通过：13 个测试文件、52 项测试，56 个 Astro 文件检查
  为 0 error / warning / hint，20 页与 29 个优化图片产物构建成功。
- 隔离内容回归通过：嵌套 MDX、项目、课程；MDX 表达式和表格；草稿排除；有/无封面；
  单分类论文库；空集合；空论文库；删除已生成详情页时检查器正确失败。
- Node 24.14.0 临时副本在没有 `node_modules` 与内容缓存的条件下，执行
  `pnpm install --frozen-lockfile --strict-peer-dependencies` 和完整 `pnpm verify`，均通过。
  安装使用 pnpm 包缓存，不代表全程无缓存下载；本机 pnpm 工具目录问题通过临时目录隔离，
  未修改用户全局配置。
- 最终 `pnpm audit --json`：526 个依赖条目，全部严重度均为 0，退出码 0。
- Chromium 浏览器检查实际 320 / 1440 CSS px：浅色项目页、深色教学页、博客封面、
  移动导航、跨页主题、引用弹窗名称、APA 切换、复制反馈、Esc 关闭与焦点返回均通过。
- 复杂正文修复后整页宽度保持 320 px；表格可见宽 288 px、内部宽 1393 px，
  tabindex 为 0，按右方向键后 scrollLeft 为 40；浏览器可访问树仍识别为 table。
- 已检查页面的图片正常加载，控制台未发现 error / warn；抽查字体、CSS 与图片请求成功。
- `git diff --check` 通过。设计扫描仅有既有字号层级提示，实际标题层级明确，未据此重排页面。

界面评分仅针对本次检查范围，不是 WCAG 合规认证：

| 维度 | 分数 | 剩余验证空间 |
| --- | --- | --- |
| 可访问性 | 3/4 | 真实屏幕阅读器、原生浏览器缩放与 Firefox |
| 性能 | 3/4 | 弱网、LCP/CLS 与外部字体的实际影响 |
| 响应式 | 3/4 | 真实设备与更多内容组合 |
| 主题 | 3/4 | 系统高对比度、其他浏览器的透明背景合成 |
| 实现一致性 | 3/4 | 已加入浏览器 CI 配置，首次 Linux CI 运行结果待确认 |
| 合计 | 15/20 | 当前结构可继续沿用，优先补验收覆盖 |

## 下一步优先级

1. **发布验收**：完成 Linux CI 的 Firefox 检查，再在真实 Safari / 手机上验证交互、
   原生文字缩放、触摸滚动与屏幕阅读器。WebKit 引擎覆盖不能代替真实 Safari。
2. **浏览器 CI 首跑**：三引擎自动化已接入；本机 Chromium / WebKit 通过，Firefox 启动
   受 macOS 27 权限问题阻挡。当前没有推送，因此不宣称远程 CI 已通过。
3. **字体与首屏测量**：字体失败回退、资源延迟和 Chromium 限速下的基本交互已验证。
   下一步测真实内容、实际字体加载时的 LCP / CLS，再决定是否自托管字体；当前测试
   附件中的 navigation timing 不是 Core Web Vitals 验收结果。
4. **引用的真实文献验收**：用实际维护的文献核对复杂 LaTeX、特殊文献类型与完整样式。
   当前纯文本引用保留常用论文元数据，不是完整 CSL 排版引擎。

目前没有证据支持重写框架、增加数据库或引入 CMS。新的功能应由实际作者维护与读者查找
任务决定；完成上述验收后，再安排小范围界面 polish。

## 宽正文的可重复浏览器检查

本轮用浏览器 DOM 临时加入代表性正文来隔离 CSS 问题，未修改作者文章。
在本地文章详情页、320 px 视口中运行以下控制台检查；刷新即可恢复内容。

```js
const prose = document.querySelector('.post-body');
const text = document.createElement('p');
text.textContent = 'https://example.com/' + 'LongUnbrokenIdentifier'.repeat(18);
prose.append(text);
const table = document.createElement('table');
table.innerHTML = '<caption>QA wide data table</caption><tbody><tr>' +
  Array.from({length: 10}, (_, i) => `<td>LongColumnName${i}</td>`).join('') +
  '</tr></tbody>';
prose.append(table);
document.dispatchEvent(new Event('astro:page-load'));
console.assert(document.documentElement.scrollWidth <= document.documentElement.clientWidth);
console.assert(table.scrollWidth > table.clientWidth && table.tabIndex === 0);
table.focus();
// 按右方向键后检查：table.scrollLeft > 0。
```

## 后续浏览器回归与修复

新增 `@playwright/test 1.63.0` 开发依赖，复用已有隔离内容脚本；没有添加站点运行时依赖。
`pnpm test:browser` 会创建临时内容副本、构建并启动 Astro 本地预览，执行结束后关闭服务器
并删除副本。浏览器版样例额外提供第二类论文，用于验证筛选；原单分类和空集合检查仍保留。
浏览器与 CI 设置参考 [Playwright 浏览器说明](https://playwright.dev/docs/browsers) 和
[官方 CI 指南](https://playwright.dev/docs/ci)。

### 本轮发现并修复

| 问题 | 复现证据 | 修复 |
| --- | --- | --- |
| 文字放大时详情标题和元数据溢出 | Chromium，320 px 视口，根字号由 16 改为 32 px 后整页宽度达 507 px | 将 `overflow-wrap: anywhere` 从正文扩展到共享布局；分享按钮组允许换行。文章、项目、课程详情均检查不再撑宽页面 |
| 跳转正文链接在未聚焦时露出并遮挡页头 | 放大后链接高 120 px，但原变换仍只有 -80 px，底部落在视口内 64 px | 隐藏位置改为自身高度的 -100%；聚焦后再显示。检查未聚焦时完全移出视口、聚焦时可见、Enter 后正文获得焦点 |
| 新断行规则影响论文编号 | 窄屏截图显示 `01` 在 min-content 网格中被拆成两行 | 共享 `entry-index` 明确保持单行；正文和标题继续允许长词换行 |

### 自动化覆盖

每个引擎执行以下 7 条流程，测试不重试，以免隐藏不稳定行为：

1. 320 px 手机菜单：打开、Esc 关闭与焦点返回、切至桌面后复位、页面导航。
2. 主题：跟随系统、手动覆盖、刷新和跨页后保持选择。
3. 筛选：深链接恢复、刷新、保留其他查询参数与锚点、无效值回退、读屏状态文本。
4. 引用：四种格式、原生复制反馈、Esc / 关闭按钮、焦点返回、重新打开复位。
   Chromium 显式授予测试上下文的剪贴板权限，并读取剪贴板核对实际内容。
5. 复制拒绝：模拟浏览器拒绝写入，在 320 px 深色弹窗中验证错误提示与手动复制焦点。
6. 内容：真实构建的 MDX 表达式、十列表格、长代码、优化图片、嵌套详情、放大文字和跳转链接。
7. 网络和动画：本地资源额外延迟 300 ms、外部字体失败回退、菜单与减少动画的回顶行为。
   Chromium 另设延迟 200 ms、下载 175,000 B/s、上传 75,000 B/s。

所有流程同时捕获脚本异常和本地 HTTP 错误；HTML 报告包含窄屏截图和导航计时，失败时
保存操作轨迹及截图。WebKit 的表格键盘滚动用 150 ms 按键持续时间验证；零持续时间
在独立原生滚动容器中也无法触发滚动，因此调整的是测试输入，没有添加自定义滚动逻辑。

### 验证边界

- 本机 Chromium 153.0.8010.12、WebKit 26.6 的 14 条流程通过。使用 Node 24.14.0。
- Firefox 155.0 在进入页面前退出，报 `Could not find profile folder`；改用 `/private/tmp`
  仍可复现。本机为 macOS 27.0，此现象与 [Mozilla Bug 2060476](https://bugzilla.mozilla.org/show_bug.cgi?id=2060476)
  记录的应用数据权限问题一致。未修改系统权限，也未把这 7 条检查记为通过。
- 默认命令仍运行三种引擎；显式检查可用引擎：
  `pnpm test:browser --project=chromium --project=webkit`。
- CI 配置已加入三引擎安装、浏览器测试及报告保存（14 天）；未推送，Linux CI 的实际结果待确认。
- 单元测试 13 文件 / 52 项通过，Astro 检查 58 文件无错误、警告或提示；生产构建、产物断言、
  单分类和空内容变体均通过。新增依赖后严格 peer / 冻结锁文件安装通过，529 项依赖审计为 0 漏洞。
- 放大测试修改的是根字号，覆盖 rem 文本及间距放大，不等同于所有浏览器的原生 200% 缩放。
  当前没有真实触屏设备、Safari 应用、读屏软件或正式 LCP / CLS 验收结果。
