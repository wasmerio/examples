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
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 Русская документация
</div>

# Star Read - Тема для блога Astro

>Блестящая, но при этом простая и изысканная тема Astro со звездным качеством

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
└── dist/               # Результат сборки
```

## 🚀 Характеристики

- 🎨 модернизац пользовательск интерфейс
- 🔍 автоматическ создан местн индексирова, поддержива местн отключ поисков связа с Algolia
- 📱 реактивн дизайн, доступн мобильн телефон, PC
- 🌙 темн/светл тем автоматическ переключен
- 🏷 ️ значк и классификац поддержа
- 📊 стат статистик и автор информац показа

## 📦 Установка

### Метод 1: Инициализация через CLI-инструмент

| Менеджер пакетов | Рекомендуемая команда                          |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` или `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (требуется Yarn v2+) |

>[!note]
>Мы предоставляем команду `create` для удобного создания темы в указанной папке

1. Создание проекта: в зависимости от используемого менеджера пакетов выберите одну из следующих команд：

```bash
# Использовать pnpm
pnpm create astro-theme-starread my-blog

# Использовать npm
npx create-astro-theme-starread my-blog

# Использовать yarn
yarn create astro-theme-starread my-blog

# Использовать cnpm
cnpm init astro-theme-starread my-blog

```

2. Перейти в каталог проекта：

```bash

cd my-blog

```

3. Установить зависимости：

```bash
pnpm install
```

4. Запустить сервер разработки：

```bash
pnpm dev
```

### Метод 2: Установка с использованием шаблона `astro`

>[!warning]
>Этот метод требует доступа к репозиторию Github, убедитесь в стабильном интернет-соединении.

| Менеджер пакетов | Команда                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### Метод 3: Установка из исходного кода

>[!warning]
>Этот метод требует доступа к репозиторию Github, убедитесь в стабильном интернет-соединении.

```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>После завершения установки запустите сервер разработки：
```bash
pnpm dev
```

### Метод 4: Установка в существующий проект Astro в качестве зависимости

Вы можете установить тему в существующий проект Astro в качестве зависимости и напрямую использовать ее компоненты, макеты и страницы из node_modules.

1. **Установка пакета темы**：

```bash
# С использованием pnpm
pnpm add astro-theme-starread

# С использованием npm
npm install astro-theme-starread

# С использованием yarn
yarn add astro-theme-starread
```

2. **Прямое импортирование и использование компонентов из node_modules**：

```astro
---
// Прямое импортирование компонентов из темы в node_modules
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>Мой блог Astro</title>
    <!-- При необходимости использовать стили темы -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- Использование компонента NavBar из node_modules -->
    <NavBar />
    
    <!-- Использование компонента ThemeToggle из node_modules -->
    <ThemeToggle />
    
    <article>
      <!-- Использование компонента ArticleInfo с атрибутами -->
      <ArticleInfo 
        title="Моя статья"
        date="2024-01-01"
        author="Имя автора"
      />
      <p>Содержание статьи...</p>
    </article>
    
    <aside>
      <!-- Использование боковых компонентов -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **Прямое использование макетов из node_modules**：

```astro
---
// Прямое импортирование макета из темы в node_modules
import { article as ArticleLayout } from 'astro-theme-starread';

// Применение макета из node_modules
export const layout = ArticleLayout;

// Ваш контент
export const content = {
  title: "Моя статья в блоге",
  date: "2024-01-01",
  author: "Имя автора",
  tags: ["технологии", "блог"]
};
---

<!-- Этот контент будет отображаться в макете из node_modules -->
<main>
  <p>Это содержание моей статьи в блоге. Оно будет отображаться в макете статьи темы.</p>
</main>
```
## 🧞 Команды

| Команда                 | Описание                                       |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | Установить зависимости                         |
| `pnpm dev`               | Запустить локальный сервер разработки `localhost:4321` |
| `pnpm preview`           | Предварительный просмотр результата сборки локально |
| `pnpm algolia`           | Отправить данные в поиск Algolia                |
| `pnpm release`           | Управление версиями (обновление номера версии, создание коммитов и т.д.) |

## 🔍 Поиск

### Локальный поиск

По умолчанию используется локальный поиск, удобный для локального использования без конфигурации пользователя.

### Поиск Algolia

>[!important]
>В рабочей среде рекомендуется использовать настройку через переменные окружения, чтобы избежать раскрытия конфиденциальной информации в коде.

1. Отредактируйте `starread.config.ts` и выберите поиск Algolia
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // Провайдер сервиса поиска: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. В корневом каталоге создайте и отредактируйте файл `.env`

>[!note]
>Для поиска Algolia требуется идентификатор приложения Algolia, ключ поиска, имя индекса и ключ API администратора.

>[!tip]
>Если у вас нет аккаунта Algolia, вам нужно сначала зарегистрироваться и создать приложение.

```txt
PUBLIC_ALGOLIA_APP_ID=Идентификатор вашего приложения Algolia
PUBLIC_ALGOLIA_SEARCH_KEY=Ключ поиска Algolia
PUBLIC_ALGOLIA_INDEX_NAME=Название вашего индекса
ALGOLIA_WRITE_API_KEY=Ключ API для записи (для загрузки индекса)
```

3. Отправить индекс в Algolia

Запустите `pnpm algolia` для отправки локального индекса в Algolia

## ⚙️ Настройка

Вы можете настроить тему, изменив файл `starread.config.ts` в корневом каталоге, включая заголовок сайта, меню навигации, информацию об авторе, отображение компонентов боковой панели и т.д.

Пример конфигурации：
```typescript
// Изменить заголовок сайта
site: {
  title: 'Мой блог',
  // ...дополнительные настройки
}

// Настроить меню навигации
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...дополнительные пункты меню
]
```

## 🔧 Настройка комментариев Twikoo

Чтобы включить систему комментариев Twikoo, измените значение `envId` в строке 13 файла `src/components/Comment.astro` на адрес [вашей среды Twikoo](https://twikoo.js.org/backend.html).

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
      console.error('Не удалось загрузить Twikoo, проверьте местное расположение Twikoo или адрес CDN');
    }
  });
</script>
```



