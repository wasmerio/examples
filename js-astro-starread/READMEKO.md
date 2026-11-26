<div align="center">
 <img src="/public/logo.png" alt="starread" border="0">
  <p>
     <img src="https://img.shields.io/npm/v/astro-theme-starread?logo=npm" alt="NPM Version">
    <img src="https://img.shields.io/npm/dy/astro-theme-starread?logo=npm&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fastro-theme-starread
" alt="NPM Downloads">
    <img src="https://img.shields.io/github/last-commit/passwordgloo/astro-theme-starread?logo=github&labelColor=purple&link=https%3A%2F%2Fgithub.com%2Fpasswordgloo%2Fastro-theme-starread
" alt="Last Commit">
    <img src="https://img.shields.io/github/v/tag/passwordgloo/astro-theme-starread?logo=git" alt="GitHub Tag">
    <img src="https://img.shields.io/github/license/passwordgloo/astro-theme-starread?logo=github" alt="License">
</p>
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMECN.md">中文文档</a> | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 한국어 문서 | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Astro 블로그 테마

>별과 같은 빛나는 품질을 지닌 우아하면서도 간결한 Astro 테마입니다

## 🚀 특징

-🎨 현대화 ui 디자인
-🔍 자동 로컬 생성을 지지하 며 현지 오프 라인 검색과 algolia 인터넷 검색
-📱 디자인에 호응 해 적정 배치 휴대전화 · pc
-🌙 짙은 옅은 색의 주제/자동 전환
-🏷 ️ 라벨과 분류 지지
-글 📊 통계와 저자 정보 전시

## 📂 프로젝트 구조

```text
/
├── src/
│   ├── components/     # 컴포넌트 파일
│   ├── content/        # 콘텐츠 설정
│   ├── layouts/        # 레이아웃 템플릿
│   ├── pages/          # 페이지 라우트
│   └── styles/         # 스타일 파일
├── public/             # 정적 자산
└── dist/               # 빌드 출력
```

## 🚀 특징

- 🎨 현대적인 UI 디자인
- 🔍 로컬 검색(Pagefind) 및 Algolia 검색 지원
- 📱 반응형 디자인
- 🌙 다크/라이트 테마 전환
- 🏷️ 태그 및 카테고리 지원
- 📊 글 통계 및 작성자 정보 표시

## 📦 설치

### 방법 1: CLI 도구를 통해 초기화

| 패키지 관리자   | 권장 명령어                                  |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` 또는 `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (Yarn v2+ 필요) |

>[!note]
>사용자가 지정한 폴더에 테마를 생성할 수 있도록 `create` 명령어를 제공합니다

1. 프로젝트 생성: 사용 중인 패키지 관리자에 따라 다음 명령어 중 하나를 선택하세요：

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

2. 프로젝트 디렉토리로 이동：

```bash
cd my-blog
```

3. 의존성 설치：

```bash
pnpm install
```

4. 개발 서버 시작：

```bash
pnpm dev
```

### 방법 2: `astro` 템플릿 사용하여 설치

>[!warning]
>이 방법은 Github 저장소에 접근해야 하므로 네트워크 연결이 원활한지 확인하세요.

| 패키지 관리자   | 명령어                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 방법 3: 소스 코드에서 설치

>[!warning]
>이 방법은 Github 저장소에 접근해야 하므로 네트워크 연결이 원활한지 확인하세요.

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>설치가 완료되면 개발 서버를 실행하세요：
```bash
pnpm dev
```

### 방법 4: 기존 Astro 프로젝트에 의존성으로 설치

테마를 기존 Astro 프로젝트에 의존성으로 설치하고 node_modules에서 직접 컴포넌트, 레이아웃 및 페이지를 사용할 수 있습니다.

1. **테마 패키지 설치**: 

```bash
# pnpm 사용
pnpm add astro-theme-starread

# npm 사용
npm install astro-theme-starread

# yarn 사용
yarn add astro-theme-starread
```

2. **node_modules에서 직접 컴포넌트 가져와서 사용**:

```astro
---
// node_modules의 테마에서 컴포넌트를 직접 가져옵니다
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>내 Astro 블로그</title>
    <!-- 테마 스타일을 사용하려면 -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- node_modules의 NavBar 컴포넌트 사용 -->
    <NavBar />
    
    <!-- node_modules의 ThemeToggle 컴포넌트 사용 -->
    <ThemeToggle />
    
    <article>
      <!-- 속성을 가진 ArticleInfo 컴포넌트 사용 -->
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
// node_modules의 테마에서 레이아웃을 직접 가져옵니다
import { article as ArticleLayout } from 'astro-theme-starread';

// node_modules에서의 레이아웃 적용
export const layout = ArticleLayout;

// 내용
export const content = {
  title: "내 블로그 글",
  date: "2024-01-01",
  author: "작성자 이름",
  tags: ["기술", "블로그"]
};
---

<!-- 이 내용은 node_modules의 레이아웃에서 렌더링됩니다 -->
<main>
  <p>이것은 내 블로그 글의 내용입니다. 테마의 글 레이아웃에서 렌더링됩니다.</p>
</main>
```

## 🧞 명령어

| 명령어                   | 설명                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 의존성 설치                                   |
| `pnpm dev`               | 로컬 개발 서버 `localhost:4321` 시작            |
| `pnpm preview`           | 로컬에서 빌드 결과 미리보기                       |
| `pnpm algolia`           | Algolia 검색에 데이터 푸시                       |
| `pnpm release`           | 버전 관리 (버전 번호 업데이트, 커밋 생성 등)        |

## 🔍 검색

### 로컬 검색

기본값은 로컬 검색이며 사용자 설정 없이 로컬 오프라인에서 사용할 수 있습니다.

### Algolia 검색

>[!important]
>프로덕션 환경에서는 코드에 민감한 정보가 노출되지 않도록 환경 변수를 통한 구성을 권장합니다.

1. `starread.config.ts`를 편집하여 Algolia 검색을 선택하세요
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 검색 서비스 제공자: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. 루트 디렉토리에 `.env` 파일을 생성하고 편집하세요

>[!note]
>Algolia 검색에는 Algolia 애플리케이션 ID, 검색 키, 인덱스 이름 및 관리자 API 키가 필요합니다.

>[!tip]
>Algolia 계정이 없는 경우 먼저 등록하고 애플리케이션을 생성해야 합니다.

```txt
PUBLIC_ALGOLIA_APP_ID=귀하의 Algolia 애플리케이션 ID
PUBLIC_ALGOLIA_SEARCH_KEY=귀하의 Algolia 검색 키
PUBLIC_ALGOLIA_INDEX_NAME=귀하의 인덱스 이름
ALGOLIA_WRITE_API_KEY=귀하의 쓰기 API 키 (인덱스 업로드용)
```

3. Algolia에 인덱스 푸시

`pnpm algolia`를 실행하여 로컬 인덱스를 Algolia에 푸시하세요

## ⚙️ 사용자 정의 구성

루트 디렉토리의 `starread.config.ts` 파일을 수정하여 웹사이트 제목, 네비게이션 메뉴, 작성자 정보, 사이드바 구성 요소 표시 등 테마 구성을 사용자 정의할 수 있습니다.

예제 구성 항목：
```typescript
// 웹사이트 제목 변경
site: {
  title: '내 블로그',
  // ...기타 구성
}

// 네비게이션 메뉴 사용자 정의
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...기타 메뉴 항목
]
```

## 🔧 Twikoo 댓글 설정

Twikoo 댓글 시스템을 활성화하려면 `src/components/Comment.astro` 파일의 13행에 있는 `envId` 값을 귀하의 [Twikoo 환경 주소](https://twikoo.js.org/backend.html)로 수정해 주세요.

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
      console.error('Twikoo 로드에 실패했습니다. Twikoo의 로컬 위치 또는 CDN 주소를 확인해 주세요');
    }
  });
</script>
```