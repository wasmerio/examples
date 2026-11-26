---
title: 搜索功能
categories: [帮助文档]
date: 2026-06-30 12:58:33
cover: /cover/2d4cf471f4882dc2.avif
---

>本文节选自我的[Vuepress 2从0-1保姆级进阶教程——全文搜索篇（含Algolia、meilisearch）](https://blog.csdn.net/passwordgloo/article/details/134687291)



# 搜索

### 本地搜索

默认使用本地搜索，适合本地端离线使用，无需用户配置。

### Algolia搜索

>[!important]
>生产环境中建议使用环境变量方式配置，避免敏感信息暴露在代码中。

1. 编辑 `starread.config.ts` 选择Algolia搜索

```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 搜索服务提供商: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. 根目录创建并编辑 `.env`文件，请勿提交敏感信息到服务器

>[!note]
>Algolia搜索需要您的Algolia应用ID、搜索密钥、索引名称和管理员API密钥。

>[!tip]
>如果您没有Algolia账号，需要先注册并创建一个应用，教程见[Vuepress 2从0-1保姆级进阶教程——全文搜索篇（含Algolia、meilisearch）](https://blog.csdn.net/passwordgloo/article/details/134687291)

```txt
PUBLIC_ALGOLIA_APP_ID=您的Algolia应用ID
PUBLIC_ALGOLIA_SEARCH_KEY=您的Algolia搜索密钥
PUBLIC_ALGOLIA_INDEX_NAME=您的索引名称
ALGOLIA_WRITE_API_KEY=您的写入API密钥（用于索引上传）
```

3. 推送索引到Algolia

运行 `pnpm algolia` 推送本地索引到Algolia
