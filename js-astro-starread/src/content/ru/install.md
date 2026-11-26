---
title: Руководство по установке темы
categories: [Введение в тему]
description: Star Read — это отличная, лаконичная и изысканная тема блога Astro, которая предлагает несколько способов установки, имеет чёткую структуру проекта, обладает современным интерфейсом, поддержкой поиска, адаптивным дизайном, переключением тем и т.д. Также предоставляется подробная настройка поиска, кастомизации темы и систем комментариев.
cover: /cover/2c614caca4dd46a2.avif
date: 2026-06-30 12:58:33
---

<div align="center">
  <img src="/logo.png" alt="starread" border="0">
  🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 Китайская документация | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>

# Star Read - Тема блога Astro

>Тема Astro, сияющая как звёздный свет, но при этом лаконичная и премиальная

## 🚀 Особенности

- 🎨 Современный дизайн интерфейса
- 🔍 Автоматическое создание локального индекса, поддержка локального офлайн-поиска и онлайн-поиска Algolia
- 📱 Адаптивный дизайн, подходит для телефонов и ПК
- 🌙 Автоматическое переключение тёмной/светлой темы
- 🏷️ Поддержка тегов и категорий
- 📊 Статистика статей и отображение информации об авторе

## 📂 Структура проекта

```text
/
├── src/
│   ├── components/     # Файлы компонентов
│   ├── content/        # Конфигурация контента
│   ├── layouts/        # Шаблоны макетов
│   ├── pages/          # Маршруты страниц
│   └── styles/         # Файлы стилей
├── public/             # Статические ресурсы
└── dist/               # Вывод сборки
```

## 📦 Установка

### Способ 1: Инициализация через CLI-инструмент

| Менеджер пакетов | Рекомендуемая команда |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` или `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (требуется Yarn v2+) |

>[!note]
>Мы предоставляем команду `create` для удобства пользователей при создании темы в указанной папке

1. Создать проект: В зависимости от используемого менеджера пакетов выберите одну из следующих команд:

```bash
# Используя pnpm
pnpm create astro-theme-starread my-blog

# Используя npm
npx create-astro-theme-starread my-blog

# Используя yarn
yarn create astro-theme-starread my-blog

# Используя cnpm
cnpm init astro-theme-starread my-blog
```

2. Перейти в каталог проекта:

```bash
cd my-blog
```

3. Установить зависимости:

```bash
pnpm install
```

4. Запустить сервер разработки:

```bash
pnpm dev
```

### Способ 2: Установка с использованием шаблона `astro`

>[!warning]
>Этот способ требует доступа к репозиторию Github, убедитесь в наличии сетевого подключения.

| Менеджер пакетов | Команда |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### Способ 3: Установка из исходного кода

>[!warning]
>Этот способ требует доступа к репозиторию Github, убедитесь в наличии сетевого подключения.

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>После установки запустите сервер разработки:
```bash
pnpm dev
```

### Способ 4: Установка в качестве зависимости в существующий проект Astro

Вы можете установить тему в качестве зависимости в существующий проект Astro и использовать её компоненты, макеты и страницы напрямую из node_modules.

1. **Установить пакет темы**:

```bash
# Используя pnpm
pnpm add astro-theme-starread

# Используя npm
npm install astro-theme-starread

# Используя yarn
yarn add astro-theme-starread
```

2. **Импортировать и использовать компоненты напрямую из node_modules**:

```astro
---
// Импортировать компоненты напрямую из темы в node_modules
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>Мой блог Astro</title>
    <!-- Если нужно использовать стили темы -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- Использовать компонент NavBar из node_modules -->
    <NavBar />
    
    <!-- Использовать компонент ThemeToggle из node_modules -->
    <ThemeToggle />
    
    <article>
      <!-- Использовать компонент ArticleInfo со свойствами -->
      <ArticleInfo 
        title="Моя статья"
        date="2024-01-01"
        author="Имя автора"
      />
      <p>Содержание статьи...</p>
    </article>
    
    <aside>
      <!-- Использовать компоненты боковой панели -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **Использовать макеты напрямую из node_modules**:

```astro
---
// Импортировать макеты напрямую из темы в node_modules
import { article as ArticleLayout } from 'astro-theme-starread';

// Применить макет из node_modules
export const layout = ArticleLayout;

// Ваш контент
export const content = {
  title: "Моя запись в блоге",
  date: "2024-01-01",
  author: "Имя автора",
  tags: ["Технологии", "Блог"]
};
---

<!-- Этот контент будет отображаться в макете node_modules -->
<main>
  <p>Это содержание моей записи в блоге. Оно будет отображаться в макете статьи темы.</p>
</main>
```

## 🧞 Команды

| Команда | Описание |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | Установить зависимости |
| `pnpm dev`               | Запустить локальный сервер разработки `localhost:4321` |
| `pnpm preview`           | Локально просмотреть результаты сборки |
| `pnpm algolia`           | Отправить данные в поиск Algolia |
| `pnpm release`           | Управление версиями (обновление номера версии, генерация коммитов и т.д.) |

## 🔍 Поиск

Перейти к [Поиску](/search)

## ⚙️ Пользовательская конфигурация

Перейти к [Пользовательской конфигурации](/configure)


## 🔧 Комментарии Twikoo

>[!tip]
>Если вам нужно включить twikoo, измените строку 13 `envId` в `src/compponents/Comment.astro` на ваш [адрес окружения twikoo](https://twikoo.js.org/backend.html).

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// Ваш адрес окружения
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Не удалось загрузить Twikoo, проверьте локальное расположение twikoo или адрес CDN');
    }
  });
</script>
```
