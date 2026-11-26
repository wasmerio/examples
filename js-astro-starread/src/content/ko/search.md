---
title: 검색 기능
categories: [도움말 문서]
date: 2026-06-30 12:58:33
cover: /cover/2d4cf471f4882dc2.avif
---

>이 글은 제 [Vuepress 2 0부터 1까지 보모급 고급 튜토리얼 — 전문 검색 편 (Algolia, meilisearch 포함)](https://blog.csdn.net/passwordgloo/article/details/134687291)에서 발췌한 것입니다



# 검색

### 로컬 검색

기본적으로 로컬 검색을 사용하며, 로컬 오프라인 사용에 적합하고 사용자 설정이 필요하지 않습니다.

### Algolia 검색

>[!important]
>프로덕션 환경에서는 환경 변수 방식으로 설정하는 것을 권장합니다. 민감한 정보가 코드에 노출되는 것을 피하기 위함입니다.

1. `starread.config.ts`를 편집하여 Algolia 검색을 선택하세요

```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 검색 서비스 제공자: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. 루트 디렉토리에 `.env` 파일을 생성하고 편집하세요. 민감한 정보를 서버에 제출하지 마세요

>[!note]
>Algolia 검색에는 Algolia 애플리케이션 ID, 검색 키, 인덱스 이름 및 관리자 API 키가 필요합니다.

>[!tip]
>Algolia 계정이 없다면 먼저 가입하고 애플리케이션을 생성해야 합니다. 튜토리얼은 [Vuepress 2 0부터 1까지 보모급 고급 튜토리얼 — 전문 검색 편 (Algolia, meilisearch 포함)](https://blog.csdn.net/passwordgloo/article/details/134687291)을 참고하세요

```txt
PUBLIC_ALGOLIA_APP_ID=귀하의 Algolia 애플리케이션 ID
PUBLIC_ALGOLIA_SEARCH_KEY=귀하의 Algolia 검색 키
PUBLIC_ALGOLIA_INDEX_NAME=귀하의 인덱스 이름
ALGOLIA_WRITE_API_KEY=귀하의 쓰기 API 키 (인덱스 업로드용)
```

3. 인덱스를 Algolia에 푸시

`pnpm algolia`를 실행하여 로컬 인덱스를 Algolia에 푸시하세요
