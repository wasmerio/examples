# 从 Hexo Butterfly 迁移

本主题在设计时就考虑了 Hexo Butterfly 博客的迁移：Front Matter 不用改，文章地址、标题锚点、订阅地址都能保持不变，标签外挂可以用脚本一次转换。按下面的步骤操作，一般一两个小时就能完成。

> [!TIP]
> 迁移过程中保留原来的 Hexo 仓库，等新站上线稳定之后再归档。整个过程都可以回滚。

## 1. 准备新仓库

```bash
git clone https://github.com/<you>/astro-butterfly.git my-blog
cd my-blog
pnpm install
rm -r src/content/posts/*          # 删除示例文章
```

## 2. 搬运内容

| Hexo | 本主题 |
| --- | --- |
| `source/_posts/**/*.md` | `src/content/posts/`（目录结构可以原样保留） |
| `source/about/index.md` 等页面 | `src/content/pages/about/index.md` |
| `source/img/`、`source/` 下的其他静态文件 | `public/` |
| `source/link/index.md` + `_data/link.yml` | `src/content/pages/link/index.md`，友链改用 `::site{…}` 卡片 |

如果你想直接读取原来的 `source/_posts`，不移动文件，也可以修改 `src/content.config.ts` 中 `posts` 的 `base`：

```ts
loader: glob({ base: './source/_posts', pattern: '**/*.md', deferRender: true }),
```

Front Matter 里的这些字段都能直接读取：`title`、`date`、`updated`、`abbrlink`、`tags`、`categories`、`cover`、`top_img`、`description`、`comments`/`comment`。日期支持 Hexo 的各种写法，按 `site.timezone` 解析。

## 3. 转换标签外挂

先提交一次 git，这样转换结果可以用 `git diff` 逐行检查：

```bash
pnpm migrate:tags src/content          # 改写文件
pnpm migrate:tags --check src/content  # 列出剩余的 {% %}，没有剩余时退出码为 0
```

| Hexo 写法 | 转换结果 |
| --- | --- |
| `{% note info %}` … `{% endnote %}`（以及 success / primary / warning / danger） | `> [!NOTE]` 等 GitHub 提示块 |
| 带图标、颜色、`modern` 等的 note | `:::note{.blue .flat icon="fas fa-bullhorn"}` |
| `{% tip warning faa-horizontal animated %}` | `:::tip{type=warning .faa-horizontal .animated}` |
| `{% folding green, 标题 %}` | `:::details[标题]{.green}` |
| `{% tabs %}` / `<!-- tab 名称 -->` | `::::tabs` / `:::tab[名称]` |
| `{% span red, 文字 %}` | `:span[文字]{.red}` |
| `{% checkbox green checked, 文字 %}`、`{% radio %}` | `:checkbox[文字]{.green checked}`、`:radio[…]` |
| `{% psw 文字 %}` | `:spoiler[文字]` |
| `{% bubble 词, "解释", "#颜色" %}` | `:tooltip[词]{tip="解释" color="#颜色"}` |
| `{% del 文字 %}` | `~~文字~~` |
| `{% image url, alt=… %}` | `![alt](url)` |
| `{% site … %}` | `::site{…}` |
| `{% meting "id" "netease" "playlist" %}` | `::music{id=… server=netease type=playlist}` |

- 代码块里的 `{% %}` 不会被改动。
- 嵌套的容器（比如标签页里的折叠块）会自动加上足够的冒号。
- 转换不了的写法会在输出中列出行号，需要手动处理。

> [!WARNING]
> 本主题的"更新于"会跟随 git 提交，所以搬家和转换这些提交**不能被算作内容更新**，否则所有文章都会显示为今天更新，订阅和"最近更新"列表也会跟着乱掉。两步就能处理：
>
> 1. 在 `src/config.ts` 里把 `dates.gitSince` 设为搬家完成的时间。更早的 git 历史全部不算数，以 Front Matter 里的 `updated` 为准。
> 2. 之后再有批量修改（比如再跑一次转换、整体格式化），把那次提交的完整 SHA 写进 `.git-blame-ignore-revs`。
>
> 如果旧仓库里有"提交时自动改写 `updated`"的 git 钩子，可以删掉了。

## 4. 对照配置

| Butterfly 配置 | `src/config.ts` |
| --- | --- |
| `_config.yml` 的 `title` `subtitle` `author` `url` `timezone` | `site` |
| `menu` | `nav` |
| `social` | `social` |
| `avatar.img`、`index_img`、`default_top_img`、`cover.default_cover` | `site.avatar`、`site.topImg`、`site.defaultCover` |
| `aside.card_announcement`、`card_author.button` | `aside.announcement`、`aside.followMe` |
| `twikoo.envId` | `comments.twikoo.envId` |
| `busuanzi` | `features.busuanzi` |
| `translate` | `features.translate` |
| `noticeOutdate.limit_day` | `features.outdatedNoticeDays` |
| `photofigcaption` | `features.photoCaption` |
| `activate_power_mode` | `features.powerMode` |
| `post_copyright` | `copyright` |
| hexo-butterfly-clock | `clock`（和风天气 key） |
| hexo-tag-aplayer / 注入的 APlayer | `music` |
| hexo-butterfly-envelope | `type: envelope` 的页面 + `envelope` |
| Algolia / 本地搜索 | 不需要配置，Pagefind 内置 |

## 5. 保持链接不变

**文章地址**

本主题的文章地址是 `/posts/:abbrlink/`，对应 Hexo 的 `permalink: posts/:abbrlink/`。如果你以前用的是别的格式，可以重命名 `src/pages/posts/[abbrlink].astro` 来匹配，或者在托管平台上配置重定向。

**标题锚点**

锚点按 Hexo 的规则生成（包括同名标题的 `-1` 后缀），站外指向 `#某一节` 的链接继续有效。

**标签和分类**

`/tags/<名称>/`、`/categories/<路径>/` 与 Hexo 的规则一致。

**订阅**

地址仍然是 `/atom.xml`。订阅阅读器靠条目的 `<id>` 判断是不是同一篇文章。如果旧站 `_config.yml` 里的 `url` 和新的 `site.url` 不同（最常见的是 `http://` 变成了 `https://`），把旧值填进 `feed.idOrigin`，订阅者就不会收到一大堆"新文章"：

```ts
export const feed = { idOrigin: 'http://blog.example.com' };
```

**核对**

构建之后，可以拿线上旧站的 sitemap 对比一遍：

```bash
pnpm build
curl -s https://你的域名/sitemap.xml | grep -o '<loc>[^<]*' | sed 's|<loc>https\?://[^/]*||; s|index.html$||' | sort > old.txt
grep -o '<loc>[^<]*' dist/sitemap.xml | sed 's|<loc>https\?://[^/]*||' | sort > new.txt
comm -23 old.txt new.txt     # 旧站有、新站没有的地址
```

## 6. 清理旧的 Service Worker

如果旧站用了 `hexo-offline`、`hexo-swpp` 或 Butterfly 的 PWA，老访客的浏览器里还装着旧的 Service Worker，可能会一直显示缓存的旧页面。在 `public/` 下放一个与旧文件**同名**的脚本（通常是 `sw.js` 或 `service-worker.js`）：

```js
// 清空旧缓存、注销自己，并刷新已打开的页面
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
  })());
});
```

浏览器每次访问都会检查这个地址，拿到新版本后就会自行清理。保留几个月即可。

## 7. 评论与统计

- **Twikoo**：评论按页面路径存储。文章地址不变，旧评论就都还在，不需要任何迁移。
- **不蒜子**：全站访客数和总访问量会接着旧数据累计。注意，旧站在默认的浏览器 Referer 策略下只会上报域名，所以每篇文章显示的其实都是首页的计数；本主题会上报完整的文章地址，因此迁移后每篇文章的阅读量从各自的真实值开始。
- **Algolia**：本主题用 Pagefind，不再需要 Algolia。如果旧配置里提交过 `adminApiKey`，请到 Algolia 后台作废它。

## 8. 上线

按 [README 的部署说明](../README.md#deploying) 构建并发布 `dist/`。如果仍然部署到原来的托管平台，记得先把构建命令改成 `pnpm build`，输出目录改成 `dist`。
