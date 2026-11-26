![Astro Fox Preview](/public/opengraph.png)

# Astro Fox 🦊

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5.1.3-FF5D01.svg?logo=astro)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2C4F7C.svg?logo=solid&logoColor=white)](https://www.solidjs.com/)
[![Lighthouse Score: 100](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen.svg)](https://developers.google.com/web/tools/lighthouse/)

[English 🇺🇸](README.md)

**Astro Fox**는 빠르고 가볍게 블로그와 포트폴리오를 제작할 수 있는 Astro 템플릿 생성기입니다. CLI를 통해 손쉽게 프로젝트를 시작하고, 블로그, 로그, 프로젝트 섹션을 포함한 개인 사이트를 빠르게 구축할 수 있습니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LimChaeJune/astro-fox)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/LimChaeJune/astro-fox)

## ✨ 특징

- 🚀 **CLI 생성기**: 간단한 명령어로 새 프로젝트 생성 및 설정
- 🎯 **완벽한 성능**: Lighthouse 100/100 점수
- 🔍 **SEO 최적화**: 메타 태그, 오픈 그래프, 사이트맵 등 내장
- 🌓 **다크/라이트 모드**: 시스템 테마 자동 감지 및 수동 전환 지원
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 경험
- 🔎 **통합 검색**: [pagefind](https://pagefind.app/)를 활용한 빠른 콘텐츠 검색
- 📝 **Markdown & MDX**: 편리한 콘텐츠 작성
- 🧩 **모듈화된 컴포넌트**: SolidJS 컴포넌트로 구성
- 💨 **부드러운 애니메이션**: 적절한 전환 효과
- 📊 **RSS 피드**: 자동 생성되는 RSS 피드

## ✅ 성능

![Lighthouse Score 100/100](/public/lighthouse.png)

모든 카테고리(성능, 접근성, 모범사례, SEO)에서 완벽한 Lighthouse 점수를 획득했습니다.

## 🚀 시작하기

### CLI로 시작하기

```bash
# npm으로 전역 설치
npm install -g @cj.lim/astro-fox

# 새 프로젝트 생성
astro-fox init my-blog

# 프로젝트 폴더로 이동
cd my-blog

# 개발 서버 시작
pnpm run dev
```

### 직접 클론으로 시작하기

Astro Fox는 기본적으로 pnpm을 사용하지만, 모든 주요 패키지 매니저(npm, yarn, pnpm)를 지원합니다.
하나의 패키지 매니저를 선택하고 아래 명령어들에서 일관되게 사용하세요.

```bash
# 저장소 클론
git clone https://github.com/LimChaeJune/astro-fox

# 프로젝트 폴더로 이동
cd astro-fox

# 의존성 설치 (원하는 패키지 매니저 선택)
pnpm install

# 개발 서버 시작
pnpm run dev

# 프로덕션 빌드
pnpm run build
```

### 사용 가능한 스크립트

어떤 패키지 매니저를 선택하든 다음 스크립트들을 사용할 수 있습니다:

```bash
# 개발 서버 시작
pnpm run dev

# 프로덕션용 빌드
pnpm run build

# 빌드 결과물 미리보기
pnpm run preview

# ESLint 실행
pnpm run lint

# ESLint 문제 자동 수정
pnpm run lint:fix

# Prettier로 코드 포맷팅
pnpm run format

# Prettier로 포맷팅 확인
pnpm run format:check
```

## 📝 프로젝트 구조

```
/
├── cli/                  # CLI 도구
├── public/
│   ├── fonts/            # 웹 폰트
│   └── js/               # 클라이언트 스크립트
├── src/
│   ├── app/
│   │   ├── components/   # 앱 공통 컴포넌트
│   │   ├── layouts/      # 레이아웃 컴포넌트
│   │   └── styles/       # 전역 스타일
│   ├── components/
│   │   ├── blog/         # 블로그 관련 컴포넌트
│   │   ├── log/          # 로그 관련 컴포넌트
│   │   ├── project/      # 프로젝트 관련 컴포넌트
│   │   ├── common/       # 공통 UI 컴포넌트
│   │   └── about/        # 소개 페이지 컴포넌트
│   ├── content/
│   │   ├── blog/         # 블로그 글 (Markdown/MDX)
│   │   ├── log/          # 로그 글 (Markdown/MDX)
│   │   └── projects/     # 프로젝트 정보 (Markdown/MDX)
│   └── pages/            # Astro 페이지
│       ├── index.astro   # 홈페이지
│       ├── blog/         # 블로그 페이지
│       │   ├── index.astro           # 블로그 목록 페이지
│       │   └── [...slug].astro       # 동적 블로그 포스트 페이지
│       ├── log/          # 로그 페이지
│       │   ├── index.astro           # 로그 목록 페이지
│       │   └── [...slug].astro       # 동적 로그 항목 페이지
│       ├── projects/     # 프로젝트 페이지
│       │   ├── index.astro           # 프로젝트 목록 페이지
│       │   └── [...slug].astro       # 동적 프로젝트 상세 페이지
│       └── about/        # 소개 페이지
│           └── index.astro           # 소개 페이지
└── package.json
```

### [...slug]를 이용한 동적 라우팅

`[...slug].astro` 파일들은 Astro에서 동적 라우팅을 구현하는 데 사용됩니다.

## 📖 CLI 사용 가이드

Astro Fox는 CLI로 새 프로젝트를 시작하고 콘텐츠를 만들 수 있습니다.

```bash
# @cj.lim/astro-fox 설치
npm install -g @cj.lim/astro-fox

# 새 프로젝트 생성
astro-fox init <프로젝트-이름>

# 새 블로그 포스트 생성
astro-fox blog "새 포스트 제목" -d "간단한 설명" -t "태그1,태그2"

# 새 로그 항목 생성
astro-fox log "오늘의 로그" -d "오늘 한 일" -t "업무,학습"

# 새 프로젝트 항목 생성
astro-fox projects "프로젝트 알파" -d "프로젝트 상세 정보" -c "내 회사" -s "2024-01-01" -e "2024-12-31"

# 도움말 보기
astro-fox --help

# 버전 확인
astro-fox --version
```

## 🔧 커스터마이징

### 콘텐츠 작성

모든 블로그 글은 `src/content/blog`에 Markdown 또는 MDX 파일로 저장됩니다. 각 글은 다음과 같은 frontmatter가 필요합니다:

```markdown
---
title: "포스트 제목"
summary: "짧은 설명"
date: 2024-04-07
tags: ["astro", "web development"]
categories: "카테고리"
image: "이미지 경로" # optional
draft: true # optional
---

본문 내용...
```

frontmatter 스키마는 `src/content/config.ts`에서 Astro의 Content Collections API를 사용하여 정의됩니다. 이 파일에서 스키마 정의를 확인할 수 있습니다.

### 로그 및 프로젝트

- 로그는 `src/content/log`에 저장됩니다.
- 프로젝트는 `src/content/projects`에 저장됩니다.

### 스타일링

이 템플릿은 TailwindCSS를 사용합니다. `tailwind.config.mjs`를 수정하여 테마를 커스터마이징할 수 있습니다.

## 🛠️ 주요 설정 파일

다음 파일들은 사이트를 개인화하기 위해 수정해야 합니다.

### Astro 설정 -`astro.config.mjs`

```js
export default defineConfig({
  site: "https://yourdomain.com", // 자신의 도메인으로 교체
  build: {
    format: "file", // build 형태
    inlineStylesheets: "auto", // css 최적화
  },
});
```

### 파비콘 이미지 - `public/favicon.svg`

### 콘텐츠 컬렉션 스키마 - `src/content/config.ts`

### 색상, 폰트 및 디자인 요소 - `tailwind.config.mjs`

## 🚢 배포하기

Astro Fox는 정적 사이트 생성(SSG)을 기반으로 하며, 아래와 같은 다양한 호스팅 서비스에 쉽게 배포할 수 있습니다:

- **Vercel**: Git 저장소 연결 후 자동 배포
- **Netlify**: Git 저장소 연결 또는 drag-and-drop으로 배포
- **Cloudflare Pages**: Git 저장소 연결 후 자동 배포

## 🙏 감사의 말

테마는 [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)에서 영감을 받았습니다.

## 📜 라이센스

MIT
