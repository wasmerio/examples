# دليل التأسيس والبناء الشامل: AstroArabia (Arabic-First Web Starter)

دليل تنفيذي شامل لبناء وإطلاق قالب عربي مفتوح المصدر متعدد الأغراض مبني على معمارية **Astro 7** و **Tailwind CSS v4.3**.

---

## 1. التثبيت وتهيئة بيئة العمل

نفّذ الأوامر التالية لإنشاء المشروع وتثبيت الحزم المطلوبة:

```bash
# إنشاء مجلد المشروع
mkdir astroarabia && cd astroarabia

# تهيئة package.json وتثبيت الاعتماديات
npm init -y
npm install astro@^7.2.7 @tailwindcss/vite@^4.3.3 tailwindcss@^4.3.3
npm install @astrojs/mdx@^7.0.8 @astrojs/sitemap@^3.7.1 @astrojs/check@^0.9.10
npm install astro-icon@^1.1.5 @iconify-json/lucide
npm install @fontsource-variable/alexandria@^5.2.0 @fontsource-variable/ibm-plex-sans-arabic@^5.2.0
npm install clsx@^2.1.1 tailwind-merge@^3.6.0 nanostores@^1.4.0 zod@^3.24.1
npm install -D typescript@^5.8.0 pagefind@^1.5.2

```

---

## 2. ملفات الإعداد والتحكم الأساسية

### `package.json`

```json
{
  "name": "astroarabia",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "postbuild": "pagefind --site dist"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.10",
    "@astrojs/mdx": "^7.0.8",
    "@astrojs/sitemap": "^3.7.1",
    "@fontsource-variable/alexandria": "^5.2.0",
    "@fontsource-variable/ibm-plex-sans-arabic": "^5.2.0",
    "@tailwindcss/vite": "^4.3.3",
    "astro": "^7.2.7",
    "astro-icon": "^1.1.5",
    "clsx": "^2.1.1",
    "nanostores": "^1.4.0",
    "pagefind": "^1.5.2",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.3",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}

```

### `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://astroarabia.dev',
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    mdx(),
    sitemap(),
    icon({
      include: {
        lucide: ['*']
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});

```

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}

```

---

## 3. محرك التصميم وخصائص RTL

### `src/styles/global.css`

```css
@import "tailwindcss";
@import "@fontsource-variable/alexandria";
@import "@fontsource-variable/ibm-plex-sans-arabic";

@theme {
  --font-sans: "IBM Plex Sans Arabic Variable", system-ui, -apple-system, sans-serif;
  --font-heading: "Alexandria Variable", system-ui, sans-serif;
  --color-primary-50: #f0fdf4;
  --color-primary-500: #16a34a;
  --color-primary-600: #15803d;
  --color-primary-900: #14532d;
  --color-surface-dark: #0f172a;
  --color-surface-card: #1e293b;
}

@layer base {
  *, ::before, ::after {
    box-sizing: border-box;
  }

  html {
    direction: rtl;
    text-align: start;
    font-family: var(--font-sans);
    letter-spacing: normal;
    line-height: 1.8;
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.35;
  }

  /* الحفاظ على قراءة الأكواد والأرقام الإنجليزية بدون تشويه */
  code, pre, [dir="ltr"] {
    direction: ltr;
    text-align: left;
    unicode-bidi: isolate;
  }
}

```

---

## 4. ملف التحكم العام وأنظمة المحتوى

### مثال اختياري: `src/site.config.ts`

> النسخة المنشورة لا تستخدم هذا الملف حاليًا؛ أضفه فقط إن قررت جمع إعدادات الموقع في مصدر مستقل.

```typescript
export const siteConfig = {
  title: 'AstroArabia | نظام الويب العربي الحديث',
  description: 'قالب عربي عالي الأداء مبني للسرعة، محركات البحث، ودعم RTL الأصلي.',
  siteUrl: 'https://astroarabia.dev',
  defaultLanguage: 'ar',
  author: 'فريق تطوير AstroArabia',
  contact: {
    whatsapp: '966500000000',
    email: 'info@example.com'
  },
  social: {
    twitter: '@astroarabia',
    github: 'https://github.com/almahers/astroarabia'
  }
};

```

### `src/content.config.ts`

```typescript
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string(),
    readingTime: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };

```

---

## 5. الهياكل والمكونات الأساسية (Layouts & UI)

### `src/layouts/BaseLayout.astro`

```astro
---
import '@/styles/global.css';
import { siteConfig } from '@/site.config';

interface Props {
  title?: string;
  description?: string;
  dir?: 'rtl' | 'ltr';
  lang?: string;
}

const {
  title = siteConfig.title,
  description = siteConfig.description,
  dir = 'rtl',
  lang = 'ar'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang={lang} dir={dir} class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={canonicalURL} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
    <slot />
  </body>
</html>

```

### نموذج بديل: `src/components/SiteHeader.astro`

> الهيدر الموجود في القالب هو `src/components/SiteHeader.astro`. المثال التالي يوضح بنية مبسطة يمكن تطويرها، ولا يستبدل المكوّن الحالي مباشرة.

```astro
---
const navItems = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الشركات والخدمات', href: '/agency' },
  { label: 'المنتجات الرقمية', href: '/saas' },
  { label: 'صفحات الهبوط', href: '/landing' },
  { label: 'المدونة', href: '/blog' },
  { label: 'التوثيق', href: '/docs' }
];
---

<header class="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
      <span>AstroArabia</span>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <a href={item.href} class="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors dark:text-slate-300 dark:hover:text-emerald-400">
          {item.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-3">
      <a href="https://github.com/almahers/astroarabia" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900">
        GitHub
      </a>
      <a href="#quote" class="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition shadow-sm">
        ابدأ الآن
      </a>
    </div>
  </div>
</header>

```

### مثال اختياري: `src/components/widgets/Hero.astro`

> الصفحة الرئيسية الفعلية موجودة في `src/pages/index.astro`. أنشئ هذا المكوّن فقط إذا أردت فصل قسم البطل إلى ملف مستقل.

```astro

<section class="relative py-24 lg:py-32 overflow-hidden bg-radial from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-8 dark:text-emerald-300">
      <span>جاهز للعمل مع Astro 7 و Tailwind v4</span>
    </div>

    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
      الجيل القادم من مواقع الويب <br />
      <span class="text-emerald-600 dark:text-emerald-400">العربية فائقة السرعة</span>
    </h1>

    <p class="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10">
      قالب متكامل ومفتوح المصدر، مبني من الصفر ليدعم المحاذاة والخطوط العربية، أعلى درجات السيو المحلي، وتجربة مستخدم لا تقبل المنافسة.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/landing" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
        استعراض النماذج الـ 5
      </a>
      <a href="/docs" class="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-base hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        قراءة التوثيق
      </a>
    </div>
  </div>
</section>

```

### `src/components/WhatsAppFloat.astro`

```astro
---
const phoneNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER || '966500000000';
const message = encodeURIComponent('هلا، أبغى أعرف أكثر عن الخدمة.');
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
---

<aside class="fixed bottom-6 start-6 z-50">
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="تواصل معنا عبر واتساب"
    class="flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-500 text-white font-bold shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-emerald-300"
  >
    <span aria-hidden="true">💬</span>
    <span class="text-sm hidden sm:inline-block">تواصل مباشر</span>
  </a>
</aside>

```

---

## 6. الصفحة الرئيسية المجمعة (`src/pages/index.astro`)

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SiteHeader from '@/components/SiteHeader.astro';
import SiteFooter from '@/components/SiteFooter.astro';
import WhatsAppFloat from '@/components/WhatsAppFloat.astro';
---

<BaseLayout>
  <SiteHeader/>
  <main class="flex-grow">
    <!-- ضع أقسام الصفحة الرئيسية هنا أو استخدم src/pages/index.astro مباشرة. -->
  </main>
  <WhatsAppFloat/>
  
  <SiteFooter/>
</BaseLayout>

```

---

## 7. اختبار المشروع والنشر (Deployment Pipeline)

### الأوامر التنفيذية:

```bash
# 1. فحص الأنواع البرمجية
npx astro check

# 2. بناء المشروع للإنتاج وتوليد فهرس البحث
npm run build

# 3. معاينة المخرجات النهائية محلياً
npm run preview

```

### إعداد النشر التلقائي على Cloudflare Pages:

* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variable:** `NODE_VERSION = 22`
