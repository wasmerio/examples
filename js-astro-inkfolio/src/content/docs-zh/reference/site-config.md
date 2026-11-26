---
title: site.config.yaml 参数表
order: 1
description: 每个键、类型和默认值。哪里不对先来这页查。
---

一个文件控制全站。下面是 YAML 类型；“—” 表示没有默认值，不写就不存在。

## site

| 键                     | 类型         | 默认                    |
| ---------------------- | ------------ | ----------------------- |
| `name`                 | string       | —                       |
| `nameZh`               | string       | 回落到 `name`           |
| `tagline`              | string       | `""`                    |
| `taglineZh`            | string       | 回落到 `tagline`        |
| `description`          | string       | `""`                    |
| `descriptionZh`        | string       | 回落到 `description`    |
| `url`                  | string       | `https://example.com`   |
| `author`               | string       | `""`                    |
| `authorZh`             | string       | 回落到 `author`         |
| `email`                | string       | `""`                    |
| `telegram`             | string       | `""`                    |
| `contactEndpoint`      | string       | `""`（表单回落 mailto） |
| `greeting`             | string       | `""`                    |
| `greetingZh`           | string       | 回落到 `greeting`       |
| `avatar`               | string       | `""`                    |
| `defaultLanguage`      | `en` \| `zh` | `en`                    |
| `showLanguageSwitcher` | boolean      | `true`                  |

## nav 与 navCta

| 键                         | 类型   | 默认                   |
| -------------------------- | ------ | ---------------------- |
| `nav[].label`              | string | —                      |
| `nav[].labelZh`            | string | —（中文站隐藏该项）    |
| `nav[].href`               | string | —                      |
| `nav[].items[]`            | list   | —（有它就变下拉）      |
| `nav[].items[].sub`        | string | `""`                   |
| `navCta.label` / `labelZh` | string | `""`                   |
| `navCta.href`              | string | `""`（空则不渲染按钮） |

## footerColumns 与 footer

| 键                                  | 类型                 | 默认                  |
| ----------------------------------- | -------------------- | --------------------- |
| `footerColumns[].title` / `titleZh` | string               | —                     |
| `footerColumns[].links[]`           | `{label, href}` 列表 | —                     |
| `footer.note` / `noteZh`            | string               | `""`                  |
| `footer.copyrightName`              | string               | `site.name`           |
| `footer.authorUrl`                  | string               | `""`                  |
| `footer.authorLabel`                | string               | `""`                  |
| `footer.artLight` / `artDark`       | string               | `""`（1600×529 WebP） |

## theme、promoBanner、analytics、seo

| 键                                        | 类型                        | 默认                 |
| ----------------------------------------- | --------------------------- | -------------------- |
| `theme.accent`                            | string                      | `#ff6b01`            |
| `theme.defaultMode`                       | `auto` \| `light` \| `dark` | `auto`               |
| `theme.radius`                            | string                      | `12px`               |
| `promoBanner.enabled`                     | boolean                     | `true`               |
| `promoBanner.dismissible`                 | boolean                     | `true`               |
| `promoBanner.text` / `textZh`             | string                      | `""`                 |
| `promoBanner.link`                        | string                      | `""`                 |
| `analytics.umami.enabled`                 | boolean                     | `false`              |
| `analytics.umami.scriptUrl` / `websiteId` | string                      | `""`                 |
| `analytics.googleAnalytics.enabled`       | boolean                     | `false`              |
| `analytics.googleAnalytics.measurementId` | string                      | `""`                 |
| `analytics.clarity.enabled`               | boolean                     | `false`              |
| `analytics.clarity.projectId`             | string                      | `""`                 |
| `consent.enabled`                         | boolean                     | `true`               |
| `consent.storageKey`                      | string                      | `inkfolio-consent`   |
| `consent.text` / `textZh`                 | string                      | `""`                 |
| `consent.link`                            | string                      | `""`                 |
| `consent.accept` / `reject`               | string                      | `Accept` / `Decline` |
| `seo.titleTemplate`                       | string                      | `{title}`            |
| `seo.defaultDescription`                  | string                      | `site.description`   |
| `seo.ogImage`                             | string                      | `""`                 |
| `seo.twitterHandle`                       | string                      | `""`                 |
| `seo.structuredData`                      | boolean                     | `true`               |
| `seo.robots`                              | string                      | `index,follow`       |

## mcp

| 键                                  | 类型    | 默认                                          |
| ----------------------------------- | ------- | --------------------------------------------- |
| `mcp.enabled`                       | boolean | `false`（环境变量 `MCP_ENABLED=true` 可覆盖） |
| `mcp.endpoint`                      | string  | `""` → `https://<site.url 主机>/mcp`          |
| `mcp.name`                          | string  | `<site.name> MCP`                             |
| `mcp.sources[].host`                | string  | —                                             |
| `mcp.sources[].items`               | number  | —（显示横杠）                                 |
| `mcp.sources[].desc.en` / `desc.zh` | string  | —                                             |
| `mcp.tools[].name`                  | string  | —                                             |
| `mcp.tools[].args`                  | string  | `""`                                          |
| `mcp.tools[].desc.en` / `desc.zh`   | string  | —                                             |

## 配置管不到的文件

| 文件                     | 内容               |
| ------------------------ | ------------------ |
| `src/data/projects.yaml` | 项目卡片           |
| `src/data/tools.yaml`    | `/nav/` 目录       |
| `src/data/friends.yaml`  | 友链               |
| `src/data/log.json`      | 活跃度数据（生成） |
| `public/icons/*.svg`     | 按文件名引用的图标 |
| `public/footer/*.webp`   | 页脚大图，1600×529 |
