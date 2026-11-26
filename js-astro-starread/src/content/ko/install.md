---
title: 테마 설치 가이드
categories: [테마 소개]
description: Star Read는 뛰어나고 간결하며 정교한 Astro 블로그 테마로, 다양한 설치 방식을 제공하고 프로젝트 구조가 명확하며 현대적인 UI, 검색 지원, 반응형 디자인, 테마 전환 등의 기능을 갖추고 있습니다. 또한 검색, 테마 커스터마이징 및 댓글 시스템에 대한 상세한 설정을 제공합니다.
cover: /cover/2c614caca4dd46a2.avif
date: 2026-06-30 12:58:33
---

<div align="center">
  <img src="/logo.png" alt="starread" border="0">
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 중국어 문서 | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astro 블로그 테마

>별빛처럼 찬란하면서도 간결하고 고급스러운 Astro 테마

## 🚀 특징

- 🎨 현대적인 UI 디자인
- 🔍 로컬 인덱스를 자동으로 생성, 로컬 오프라인 검색 및 Algolia 온라인 검색 지원
- 📱 반응형 디자인, 휴대폰, PC에 적응
- 🌙 다크/라이트 테마 자동 전환
- 🏷️ 태그 및 카테고리 지원
- 📊 글 통계 및 작성자 정보 표시

## 📂 프로젝트 구조

```text
/
├── src/
│   ├── components/     # 컴포넌트 파일
│   ├── content/        # 콘텐츠 설정
│   ├── layouts/        # 레이아웃 템플릿
│   ├── pages/          # 페이지 라우트
│   └── styles/         # 스타일 파일
├── public/             # 정적 리소스
└── dist/               # 빌드 출력
```

## 📦 설치

### 방법 1: CLI 도구로 초기화

| 패키지 매니저 | 권장 명령어 |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` 또는 `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (Yarn v2+ 필요) |

>[!note]
>사용자가 지정한 폴더에 테마를 생성할 수 있도록 `create` 명령어를 제공합니다

1. 프로젝트 생성: 사용 중인 패키지 매니저에 따라 다음 명령어 중 하나를 선택하세요:

```bash
# pnpm 사용
pnpm create astro-theme-starread my-blog

# npm 사용
npx create-astro-theme-starread my-blog

# yarn 사용
yarn create astro-theme-starread my-blog

# cnpm 사용
cnpm init astro-theme-starread my-blog
```

2. 프로젝트 디렉토리로 이동:

```bash
cd my-blog
```

3. 의존성 설치:

```bash
pnpm install
```

4. 개발 서버 시작:

```bash
pnpm dev
```

### 방법 2: `astro` 템플릿으로 설치

>[!warning]
>이 방식은 Github 리포지토리에 접근해야 하므로 네트워크 연결을 확인하세요.

| 패키지 매니저 | 명령어 |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 방법 3: 소스 코드 설치

>[!warning]
>이 방식은 Github 리포지토리에 접근해야 하므로 네트워크 연결을 확인하세요.

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>설치가 완료되면 개발 서버를 실행하세요:
```bash
pnpm dev
```

### 방법 4: 기존 Astro 프로젝트에 의존성으로 설치

테마를 의존성으로 기존 Astro 프로젝트에 설치하고 node_modules에서 직접 컴포넌트, 레이아웃 및 페이지를 사용할 수 있습니다.

1. **테마 패키지 설치**:

```bash
# pnpm 사용
pnpm add astro-theme-starread

# npm 사용
npm install astro-theme-starread

# yarn 사용
yarn add astro-theme-starread
```

2. **node_modules에서 직접 컴포넌트 가져와 사용**:

```astro
---
// node_modules의 테마에서 직접 컴포넌트 가져오기
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>내 Astro 블로그</title>
    <!-- 테마 스타일을 사용해야 하는 경우 -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- node_modules의 NavBar 컴포넌트 사용 -->
    <NavBar />
    
    <!-- node_modules의 ThemeToggle 컴포넌트 사용 -->
    <ThemeToggle />
    
    <article>
      <!-- 속성이 있는 ArticleInfo 컴포넌트 사용 -->
      <ArticleInfo 
        title="내 글"
        date="2024-01-01"
        author="작성자 이름"
      />
      <p>글 내용...</p>
    </article>
    
    <aside>
      <!-- 사이드바 컴포넌트 사용 -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **node_modules에서 직접 레이아웃 사용**:

```astro
---
// node_modules의 테마에서 직접 레이아웃 가져오기
import { article as ArticleLayout } from 'astro-theme-starread';

// node_modules의 레이아웃 적용
export const layout = ArticleLayout;

// 귀하의 콘텐츠
export const content = {
  title: "내 블로그 글",
  date: "2024-01-01",
  author: "작성자 이름",
  tags: ["기술", "블로그"]
};
---

<!-- 이 콘텐츠는 node_modules 레이아웃에서 렌더링됩니다 -->
<main>
  <p>이것은 제 블로그 글의 내용입니다. 테마의 글 레이아웃에서 렌더링될 것입니다.</p>
</main>
```

## 🧞 명령어

| 명령어 | 설명 |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 의존성 설치 |
| `pnpm dev`               | 로컬 개발 서버 시작 `localhost:4321` |
| `pnpm preview`           | 로컬에서 빌드 결과 미리보기 |
| `pnpm algolia`           | Algolia 검색에 데이터 푸시 |
| `pnpm release`           | 버전 관리 (버전 번호 업데이트, 커밋 생성 등) |

## 🔍 검색

[검색](/search)으로 이동

## ⚙️ 커스텀 설정

[커스텀 설정](/configure)으로 이동


## 🔧 Twikoo 댓글

>[!tip]
>twikoo를 활성화하려면 `src/compponents/Comment.astro`의 13번째 줄 `envId`를 귀하의 [twikoo 환경 주소](https://twikoo.js.org/backend.html)로 수정하세요.

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// 귀하의 환경 주소
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikoo 로드에 실패했습니다. twikoo 로컬 위치 또는 CDN 주소를 확인하세요');
    }
  });
</script>
```
