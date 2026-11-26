---
title: Search Function
categories: [Help Documentation]
date: 2026-06-30 12:58:33
cover: /cover/2d4cf471f4882dc2.avif
---

>This article is excerpted from my [Vuepress 2 From 0 to 1 Nanny-level Advanced Tutorial — Full-text Search Chapter (including Algolia, meilisearch)](https://blog.csdn.net/passwordgloo/article/details/134687291)



# Search

### Local Search

Local search is used by default, suitable for local offline use, no user configuration required.

### Algolia Search

>[!important]
>In production environments, it is recommended to use environment variables for configuration to avoid exposing sensitive information in the code.

1. Edit `starread.config.ts` to select Algolia search

```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // Search service provider: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. Create and edit the `.env` file in the root directory, please do not submit sensitive information to the server

>[!note]
>Algolia search requires your Algolia application ID, search key, index name and admin API key.

>[!tip]
>If you don't have an Algolia account, you need to register first and create an application. See the tutorial [Vuepress 2 From 0 to 1 Nanny-level Advanced Tutorial — Full-text Search Chapter (including Algolia, meilisearch)](https://blog.csdn.net/passwordgloo/article/details/134687291)

```txt
PUBLIC_ALGOLIA_APP_ID=Your Algolia Application ID
PUBLIC_ALGOLIA_SEARCH_KEY=Your Algolia Search Key
PUBLIC_ALGOLIA_INDEX_NAME=Your Index Name
ALGOLIA_WRITE_API_KEY=Your Write API Key (for index upload)
```

3. Push index to Algolia

Run `pnpm algolia` to push the local index to Algolia
