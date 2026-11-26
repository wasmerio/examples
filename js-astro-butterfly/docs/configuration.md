# 配置

所有配置都在 `src/config.ts` 里，是一个带类型提示的 TypeScript 文件，写错字段名时编辑器和 `pnpm check` 都会提示。修改后开发服务器会自动刷新。

依赖第三方服务的功能（评论、天气、音乐、访问统计）在对应的 key 或 id 为空时会**自动关闭**：相关的 HTML 和脚本都不会出现在页面里，所以刚克隆下来的仓库不填任何东西也能直接构建运行。

- [site：站点信息](#site站点信息)
- [nav：导航菜单](#nav导航菜单)
- [social 与 aside：侧栏](#social-与-aside侧栏)
- [comments：评论](#comments评论)
- [clock：时钟与天气](#clock时钟与天气)
- [music：音乐播放器](#music音乐播放器)
- [dates：更新时间](#dates更新时间)
- [features：可选特效](#features可选特效)
- [其他](#其他)
- [独立页面](#独立页面)
- [修改样式](#修改样式)

## site：站点信息

| 字段 | 说明 |
| --- | --- |
| `url` | 正式域名，不带末尾斜杠。订阅、sitemap、canonical 链接都会用到它，**部署前必须改** |
| `base` | 站点所在的子路径。独立域名填 `'/'`；GitHub 项目页（`https://用户名.github.io/仓库名/`）填 `'/仓库名'`。用自带的 Pages 工作流部署时，这一项会自动设置 |
| `title` / `subtitle` / `description` | 站点标题、副标题、描述（用于搜索引擎与社交分享） |
| `keywords` | `<meta name="keywords">` |
| `author` / `email` | 作者名显示在作者卡片、版权信息和订阅中 |
| `lang` | `<html lang>`。界面文字是简体中文 |
| `timezone` | 解析 Front Matter 日期时使用的时区，比如 `2024-06-01 10:00` 会按这个时区理解 |
| `since` | 页脚 `©` 的起始年份 |
| `publishDate` | 侧栏"已运行时间"的起算日期 |
| `logo` | 网站图标，也用作 PWA 图标 |
| `avatar` | 作者头像 |
| `topImg` | 页面顶部的默认横幅 |
| `defaultCover` | 没写 `cover` 的文章使用的封面 |
| `error404Img` | 404 页面的配图 |

图片有三种写法：

- `src/assets/` 下的路径（如 `/src/assets/avatar.png`）：构建时转成现代格式并按显示尺寸输出，推荐用于位图。
- `public/` 下的路径（如 `/img/avatar.svg`）：原样输出。
- 完整的外部 URL：原样输出。

## nav：导航菜单

```ts
export const nav: NavItem[] = [
  { label: '主页', href: '/', icon: 'fa6-solid:house' },
  {
    label: '更多',
    icon: 'fa6-solid:list',
    children: [{ label: '友链', href: '/link/', icon: 'fa6-solid:link' }],
  },
];
```

- 有 `children` 的项会变成下拉菜单。
- 图标使用 [Iconify](https://icon-sets.iconify.design/) 的名称，前缀可以是 `fa6-solid`、`fa6-regular` 或 `fa6-brands`。图标在构建时内联，不会加载图标字体。

`pagination.home` 和 `pagination.list` 分别控制首页和归档、标签、分类列表每页显示的文章数。

## social 与 aside：侧栏

- `social`：作者卡片下方的圆形图标，`color` 是悬停时的背景色。
- `aside.followMe`：作者卡片里的按钮。
- `aside.announcement`：公告内容，可以写 HTML。
- `aside.recentPosts` / `categories` / `tags` / `archives`：各个侧栏卡片最多显示的条数。

文章页的侧栏显示目录；其他页面显示分类、标签云、归档和网站资讯。

## comments：评论

使用 [Twikoo](https://twikoo.js.org/)。先按官方文档部署好后端，再填入地址：

```ts
export const comments = {
  twikoo: { envId: 'https://twikoo.example.com/' },
  newest: 5, // 侧栏"最新评论"的条数
};
```

- 留空：没有评论区，侧栏也不显示"最新评论"卡片。
- 评论区是懒加载的：页面滚动到评论区附近时才下载 Twikoo 前端（约 120 KB，gzip 后）。从"最新评论"点进某条评论时，会立即加载并跳转到那条评论。
- 归档评论集中在 `/archives/` 总览首页，年份、月份和分页只展示文章列表。
- "最新评论"的结果缓存 10 分钟。
- 单篇文章或页面可以在 Front Matter 里写 `comments: false` 关闭评论。
- 分类和标签总览也遵循这个开关。分别在 `src/content/pages/categories/index.md` 和 `src/content/pages/tags/index.md` 设置 `title` 与 `comments: false` 即可关闭对应总览页的评论。

## clock：时钟与天气

时钟本身不需要任何配置。填入[和风天气](https://dev.qweather.com/)的 Web API key 后，时钟会多出一行天气（温度、风向、湿度、城市）。

访客的位置根据**访客自己的 IP**，在浏览器里按 `ipLookup` 的顺序查询，查到为止：

| 服务 | 覆盖范围 | 需要 key |
| --- | --- | --- |
| `amap` 高德 IP 定位 | 仅中国大陆，城市名为中文 | `amapKey`（Web 服务 key） |
| `ipwho` [ipwho.is](https://ipwho.is/) | 全球 | 不需要（非商业用途免费） |
| `ipsb` [ip.sb](https://ip.sb/) | 全球 | 不需要 |

查到坐标后，用和风天气的 GeoAPI 把地名转成中文（如"日本·东京"），再查询实时天气（全球可用）。所有方式都失败时，使用 `fallback` 里的城市。

| 字段 | 说明 |
| --- | --- |
| `weatherEndpoint` | 可选的自建天气接口，例如 `/api/weather/local`。配置后优先使用它，浏览器无需上游 API key |
| `qweatherKey` | 直连模式的和风天气 key。两种天气配置都留空时只显示时钟 |
| `qweatherHost` / `geoHost` | 和风天气的 API 域名。如果你的账号在控制台里分配了专属域名，填在这里 |
| `amapKey` | 高德 key，可选；不填就跳过 `amap` 这一步 |
| `fixedLocation` | 设为 `true` 时始终显示 `fallback` 城市的天气，不做 IP 定位 |
| `cacheMinutes` | 直连模式的天气缓存时长（分钟）。定位结果缓存 6 小时 |

自建接口接受 GET 请求。自动定位由接口处理；固定城市模式会附带 `lat`、`lon` 查询参数。成功时返回 JSON，例如：

```json
{"city":"杭州市","location":"120.16,30.27","now":{"icon":"100","text":"晴","temp":"24","humidity":"50","windDir":"东风","windScale":"2"}}
```

Worker 模式按接口和位置缓存，最长 10 分钟。

> [!WARNING]
> 直连模式使用的 key 会出现在浏览器里，属于"公开的浏览器 key"。请在各自的控制台里**把 key 限制为只能从你的域名调用**。

## music：音乐播放器

左下角的悬浮 [APlayer](https://aplayer.js.org/)，歌单来自 [Meting API](https://github.com/injahow/meting-api)：

```ts
export const music = {
  global: { id: '你的歌单 id', server: 'netease', type: 'playlist' },
  api: 'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&r=:r',
};
```

- `id` 留空就没有播放器，APlayer 的脚本也不会下载。
- `server` 可选 `netease`、`tencent`、`kugou`、`xiami`、`baidu`；`type` 可选 `playlist`、`song`、`album`、`artist`。
- 默认的 API 是免费的公共实例，稳定性没有保证，还有每日请求上限（超限时播放器会提示接口返回的原因）。歌单在浏览器里缓存一天，但播放歌曲、读歌词和封面仍要请求它。正式使用建议自己部署一个。
- 播放器在站内跳转时不会中断播放。歌词默认隐藏，点歌词按钮显示。

## dates：更新时间

文章的"更新于"取 Front Matter 的 `updated` 和最后一次 git 提交中较晚的那个，规则详见 [写作语法 · 更新时间](./writing.md#更新时间)。

| 字段 | 说明 |
| --- | --- |
| `gitSince` | 早于这个时间（ISO 格式，如 `'2026-01-01T00:00:00+08:00'`）的 git 提交不算作更新。博客从零开始时留空；从 Hexo 等平台搬过来时，填搬家那天 |

## features：可选特效

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `outdatedNoticeDays` | `365` | 文章超过这么多天没有更新时，顶部显示过期提醒；`0` 关闭 |
| `powerMode` | 开 | 在输入框打字时冒出彩色粒子（Butterfly 的 `activate_power_mode`）。`colorful` 彩色、`shake` 抖动、`mobile` 是否在手机上启用 |
| `busuanzi` | `false` | `true` 使用 [原版不蒜子](https://busuanzi.ibruce.info/)，`'busuanzi.cc'` 使用 [3.6.9](https://www.busuanzi.cc/doc.php)，`{ endpoint: 'https://stats.example.com/api/count' }` 使用自建服务。侧栏显示访客数和总访问量，文章页显示阅读量 |
| `translate` | 开 | 右下角设置里的简繁切换按钮。站点内容需要是简体中文 |
| `photoCaption` | 开 | 用图片的 alt 文字生成图片说明 |

开启了"减少动态效果"系统设置的访客不会看到打字粒子等动画。

开启后，首次加载和每次 Astro 站内换页各发送一次异步计数请求。原版使用 Referer 区分文章阅读量，并可能设置第三方 Cookie。3.6.9 使用 POST 发送当前页面的域名和路径，历史计数由各自服务维护。切换前请核对数据。超时或缺失的计数显示为横线。

自建服务接收 `POST` 请求（JSON 正文包含 `path` 和 `request_id`），返回 `site_pv`、`site_uv` 和 `page_pv`。统计服务使用 HTTPS，并且与博客处于同一站点时，浏览器可使用同站 Cookie 去重。跨源部署还需要允许博客的精确 CORS 来源和凭据。

## 其他

- `copyright`：文章末尾版权声明使用的许可协议。
- `envelope`：留言板信封页的图片和文字。
- `footerBadges`：页脚的徽章，可以是 [shields.io](https://shields.io/) 生成的图片；设为空数组则不显示这一行。

## 独立页面

`src/content/pages/<名称>/index.md` 会生成 `/<名称>/` 页面。用 Front Matter 的 `type` 字段选择页面类型：

| `type` | 效果 |
| --- | --- |
| （不写） | 普通 Markdown 页面 |
| `about` | 正文为空时显示一张作者卡片 |
| `link` | 友链页，用 `::site{…}` 卡片列出友链，见 [写作语法](./writing.md#网站卡片) |
| `envelope` | 留言板，带信封动画，下方是评论区 |

其他字段：`title`（页面标题）、`top_img`（顶部横幅）、`comments`（是否显示评论，默认 `true`）。

标签页 `/tags/`、分类页 `/categories/` 和归档页 `/archives/` 会自动生成，不需要创建。

## 修改样式

- 颜色都定义为 CSS 变量，放在 `src/theme/styles/global.css` 开头。浅色和深色模式各有一组，主题色是 `--theme-color`。
- 正文排版在 `content.css`，标签外挂在 `tag-plugins.css`。
- 代码块的配色和字体在 `ec.config.mjs`（Expressive Code 配置）。
- 样式按 `@layer` 分层，自己追加的不分层样式会优先生效，一般不需要写 `!important`。
