<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Antares](https://github.com/coderxi1/astro-antares) Astro theme by coderxi1, copied from commit `8070b22183135cb3b26f089f8018c0884666237e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-antares.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [coderxi1](https://github.com/coderxi1), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Antares

基于Astro的博客模板  

**[Github](https://github.com/coderxi1/astro-antares) | [演示页面](https://antares.coderxi.com)**

## 💻 Installation

- Git  
  ```
  git clone https://github.com/coderxi1/astro-antares blog
  ```
- Astro
  ```
  pnpm create astro@latest -- --template coderxi1/astro-antares
  ```

### 💻 Start

- 移动到博客目录下，然后安装依赖并开始开发
```
cd [/path/to/]
pnpm install
pnpm run dev
```

## 🎉 Features

- ✅**Simple style** ：简约！简约！还是TMD简约！
- ✅**Dark Mode** ：夜间模式 `<html class="dark">`
- ✅**Responsive Design** ：基于 `unocss` 的响应式设计，适配不同设备。
- ✅**Attached sitemap** ：自带站点地图/订阅 `rss.xml` `feed.xml` `baidusitemap.xml` `sitemap-index.xml`
- ✅**Easy-to-secondary-develop** ：**快速**、**高效**地创建自定义页面，**自由**地调整侧边栏卡片  
- ✅**Easy-to-use** ：大部分需要改动的配置集成在`src/config.ts`  
- ✅**Post-Frontmatter** ：更丰富的frontmatter，包括**置顶功能**、**加密功能**等。

## 🖥️ Create Page

### .astro
- `src/pages/archives.astro`
  ```astro
  <PageLayout
    title="归档"
    titleIcon="mdi:archive"
    asideCards={['CardRecentPost','CardCategroies','CardTagCloud']}
  >
    <PostListSimple posts={posts}/>
  </PageLayout>
  ```
### .mdx
- `src/pages/archives.mdx`
  ```mdx
  ---
  layout: '@/layouts/PageLayout.astro'
  asideCards: 
    - CardRecentPost
    - CardCategroies
    - CardTagCloud
  title: '归档'
  titleIcon: 'mdi:archive'
  ---

  import posts from '@/content/posts'
  import PostListSimple from '@/components/PostListSimple.astro'

  <PostListSimple posts={posts}/>
  ```

## ⚙ Configuration

### config.ts
- `src/config.ts`
  | **配置**               | **描述**                                                                                    |
  |--------------------|-------------------------------------------------------------------------------------------------|
  | **SITE_INFO**       | 网站的基本信息，如标题、描述等。                                                                  |
  | **POST_PAGE_SIZE**  | 每页显示的文章或内容数量。                                                                      |
  | **DEFAULT_FRONTMATTER** | 默认的文章或页面元数据配置，如标题、日期、标签等。                                             |
  | **SIDEBAR_SETTINGS** | 配置网站侧边栏的显示内容，如导航、搜索框等。                                                      |
  | **ASIDE_CARDS**     | 侧边显示的小卡片或附加信息区域。                                                                   |
  | **NAV_ITEMS**       | 导航栏中的链接项目，如主页、博客等。                                                                  |
  | **FOOTER**          | 页脚部分的内容，如版权信息、网站链接等。                                                              |
  | **FRIEND_LINK**     | 友情链接，指向其他相关网站的链接。                                                                    |

### Post-Frontmatter
- `posts/*.md`
  | 字段        | 内容                                   | 可选     | 描述                            |
  |-------------|---------------------------------------|----------|--------------------------------|
  | title       | `'Antares 文档'`                       | **必需**     | 标题                       |
  | **titleIcon**   | `'/favicon.svg'`                   | 可选     | 标题图标                        |
  | **titleColor**  | `'#0998DF'`                        | 可选     | 标题渐变颜色                    |
  | publishDate | `'2024-12-19'`                         | 可选     | 发布时间 (默认使用文件创建时间)   |
  | updatedDate | `'2024-12-19'`                         | 可选     | 更新时间 (默认使用文件修改时间)   |
  | tags        | `['Astro', 'TagD']`                    | 可选     | 标签                            |
  | categories  | `['Astro', 'Demo']`                    | 可选     | 分类                            |
  | description | `'暂无描述.'`                           | 可选     | 文章描述                        |
  | **top**     | `1`                                     | 可选     | 置顶 (数字越大越靠前)            |
  | **password**| `123456`                                | 可选     | 为文章设置密码                   |
  | **bodyJoin**| `./README.md`                            | 可选     | 提供文件路径 拼接另一个markdown文档 |