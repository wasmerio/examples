<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [DevBlog](https://github.com/Devsebastian44/DevBlog) Astro theme by Devsebastian44, copied from commit `6ebee379147cd969e6f1c57a43d59c57d8d13e13` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-dev-blog.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
- **Environment variables:** The theme's example env file lists `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [Devsebastian44](https://github.com/Devsebastian44), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 📝 DevBlog

![Astro](https://img.shields.io/badge/Astro-6.x-BC52EE?style=flat&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat&logo=github-actions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat&logo=opensourceinitiative&logoColor=white)

> 🌐 **Live:** [devblog44.vercel.app](https://devblog44.vercel.app)
>
> ⚠️ **Disclaimer:** This project is for educational and ethical cybersecurity purposes only.

---

## 🧠 Overview

**DevBlog** es una plataforma de contenido técnico de alto rendimiento construida
con **Astro 6** en modo híbrido (SSR + SSG), orientada a publicaciones sobre
programación, ciberseguridad, ciencia de datos e inteligencia artificial. Combina
la generación estática de contenido para máxima velocidad y SEO con capas dinámicas
de interacción en tiempo real respaldadas por **Supabase** como Backend-as-a-Service.

El proyecto integra un sistema completo de autenticación de usuarios (registro,
login, sesión persistente), interacciones sociales anónimas para visitantes sin
cuenta (likes, marcadores, comentarios vía `localStorage`), y un sistema de
actividad personalizada por usuario. La base de datos PostgreSQL de Supabase se
gestiona con **Prisma ORM** para migraciones y tipado del esquema, mientras que
las políticas **RLS (Row-Level Security)** garantizan que cada usuario solo acceda
y modifique sus propios datos.

El stack de desarrollo incluye tipado estricto con **TypeScript 5**, linting con
**ESLint** configurado para Astro y TypeScript, formateo con **Prettier**, y tests
E2E con **Playwright**. El proyecto sigue una arquitectura moderna centrada en
**GitHub** como repositorio principal y fuente de verdad.

---

## ⚙️ Features

- **Renderizado híbrido SSR + SSG** con Astro 6 y Vite: las páginas de artículos
  se generan estáticamente en build time para máxima velocidad, mientras que las
  rutas dinámicas (perfil, actividad) se sirven con SSR.
- **Sistema de autenticación completo** vía Supabase Auth: registro con email,
  login seguro, gestión de sesión persistente y página de actividad personalizada
  por usuario autenticado.
- **Interacciones para usuarios invitados** — Visitantes sin cuenta pueden dar
  likes, guardar favoritos y escribir comentarios, con estado rastreado localmente
  vía `localStorage` sin necesidad de registro.
- **Panel lateral interactivo por artículo** con contadores en tiempo real de
  likes, comentarios y marcadores, actualizado mediante el SDK de Supabase en
  el cliente.
- **Danger Zone — eliminación de cuenta** con flujo anti-caché implementado
  mediante funciones RPC personalizadas en Supabase para garantizar borrado
  completo y seguro de todos los datos del usuario.
- **Políticas RLS (Row-Level Security)** en PostgreSQL que aseguran a nivel de
  base de datos que cada usuario solo puede leer y modificar sus propios registros,
  sin depender únicamente de validaciones del lado del cliente.
- **Gestión del esquema con Prisma ORM** en la carpeta `prisma/`, permitiendo
  migraciones versionadas y tipado automático de las entidades de la base de datos.
- **Diseño premium futurista** con estética dark, glassmorphism, transiciones
  suaves, tipografía Aldrich y sistema de diseño construido sobre Tailwind CSS 4
  con el plugin `@tailwindcss/typography` para renderizado de contenido Markdown.
- **Tests E2E con Playwright** (`@playwright/test`) configurados como dependencia
  de desarrollo para validar flujos críticos de usuario.
- **Pipeline de calidad completo** con scripts `lint`, `lint:fix`, `format`,
  `format:check` y `type-check` ejecutables desde `package.json`.
- **Docker-ready** con `.dockerignore` configurado para containerización del
  entorno de producción.
- **Contenido temático** cubriendo programación, ciberseguridad, ciencia de
  datos e inteligencia artificial.

---

## 🛠️ Tech Stack

| Categoría         | Tecnología                         | Versión |
| ----------------- | ---------------------------------- | ------- |
| Framework web     | Astro (SSR/SSG híbrido)            | 6.1.3+  |
| Lenguaje          | TypeScript                         | 5.9+    |
| Estilos           | Tailwind CSS + Typography          | 4.x     |
| Build tool        | Vite (vía Astro)                   | —       |
| BaaS / Auth       | Supabase (PostgreSQL + Auth + RLS) | 2.93+   |
| ORM / Migraciones | Prisma                             | —       |
| Linting           | ESLint + @typescript-eslint        | —       |
| Formateo          | Prettier                           | —       |
| Type checking     | TypeScript `tsc --noEmit`          | —       |
| Tests E2E         | Playwright                         | 1.59+   |
| Despliegue        | Vercel                             | —       |
| Contenedor        | Docker (`.dockerignore`)           | —       |
| Node versioning   | `.nvmrc`                           | —       |
| Licencia          | MIT                                | —       |

---

## 📦 Installation

### Prerrequisitos

- **Node.js** (versión fijada en `.nvmrc`)
- **npm** actualizado
- Una cuenta en **Supabase** con un proyecto creado y las tablas del esquema
  aplicadas mediante Prisma

### 1. Clonar el repositorio

```bash
git clone https://github.com/devsebastian44/DevBlog.git
cd DevBlog
```

### 2. Usar la versión correcta de Node

```bash
nvm use
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y completa tus credenciales de Supabase:

```bash
cp .env.example .env
```

```env
# .env — nunca incluir en el repositorio
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 5. Aplicar el esquema de base de datos (Prisma)

```bash
# Para entorno de desarrollo
npx prisma db push
# o para entornos de producción
npx prisma migrate deploy
```

---

## ▶️ Usage

### Servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

> El puerto por defecto de Astro es `4321`.

### Build de producción

```bash
npm run build
npm run preview   # Previsualizar el build localmente
```

### Comandos de calidad de código

```bash
# Verificar errores de linting
npm run lint

# Corregir errores de linting automáticamente
npm run lint:fix

# Formatear todos los archivos
npm run format

# Verificar formato sin modificar
npm run format:check

# Verificar tipos TypeScript
npm run type-check
```

### Tests

El proyecto utiliza **Playwright** para pruebas E2E. Los tests están configurados para ejecutarse de forma aislada.

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con UI interactiva
npx playwright test --ui
```

### Despliegue en Vercel

1. Conecta el repositorio a un proyecto en [Vercel](https://vercel.com).
2. Añade las variables de entorno en `Settings → Environment Variables`:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
3. Vercel detecta automáticamente Astro y configura el build (`astro build`).
4. Redespliega tras cualquier cambio en las variables de entorno.

---

## 📁 Project Structure

```
DevBlog/
│
├── src/                          # Código fuente principal de la aplicación
│   ├── pages/                    # Rutas de Astro (SSR + SSG)
│   │   ├── index.astro           # Página de inicio / listado de posts
│   │   ├── blog/
│   │   │   └── [slug].astro      # Página dinámica de artículo individual
│   │   ├── auth/                 # Rutas de autenticación (login, registro)
│   │   ├── profile/              # Perfil y página "Mi Actividad"
│   │   └── api/                  # Endpoints de Astro (server-side)
│   ├── components/               # Componentes reutilizables de Astro/TS
│   │   ├── blog/                 # Componentes específicos de artículos
│   │   │   └── PostSidebar.astro # Panel lateral con likes, comentarios, bookmarks
│   │   ├── auth/                 # Formularios de login y registro
│   │   └── ui/                   # Componentes de UI genéricos (glassmorphism)
│   ├── layouts/                  # Layouts base de la aplicación
│   ├── lib/
│   │   └── supabase.ts           # Inicialización y cliente de Supabase JS SDK
│   └── styles/                   # Estilos globales CSS
│
├── prisma/                       # ORM y esquema de base de datos
│   └── schema.prisma             # Definición de modelos y relaciones PostgreSQL
│
├── public/                       # Assets estáticos (imágenes, favicon, fonts)
│
├── docs/                         # Documentación del proyecto
│   └── Logo.png                  # Logo oficial de DevBlog
│
├── diagrams/                     # Diagramas de arquitectura técnica
│
├── .vscode/                      # Configuración de editor recomendada
│
├── .dockerignore                 # Exclusiones para build de Docker
├── .editorconfig                 # Configuración consistente entre editores
├── .env.example                  # Plantilla de variables de entorno
├── .eslintrc.json                # ESLint con @typescript-eslint strict
├── .gitattributes                # Normalización de line endings
├── .gitignore                    # Exclusiones de Git
├── .nvmrc                        # Versión de Node.js fijada
├── .prettierrc                   # Formato: singleQuote, semi, printWidth 80
├── astro.config.mjs              # Configuración de Astro + Tailwind vía Vite
├── tsconfig.json                 # Configuración del compilador TypeScript
├── package.json                  # Dependencias y scripts del proyecto
├── LICENSE                       # Licencia MIT
└── README.md                     # Documentación principal
```

---

## 🔐 Security

### Row-Level Security (RLS) en Supabase

Todas las tablas de interacción del usuario (likes, comentarios, marcadores,
datos de perfil) tienen políticas RLS activas en PostgreSQL que garantizan, a
nivel de base de datos, que un usuario autenticado solo pueda leer y modificar
sus propios registros. Esto proporciona una capa de seguridad independiente
de la lógica de cliente.

### Danger Zone y eliminación de cuenta

El flujo de eliminación de cuenta está implementado mediante **funciones RPC
personalizadas en Supabase** en lugar de llamadas directas de cliente, lo que
previene condiciones de carrera y garantiza el borrado completo y transaccional
de todos los datos asociados al usuario (posts, likes, comentarios, marcadores).

### Gestión de credenciales

Las credenciales de Supabase se gestionan exclusivamente mediante variables de
entorno (`.env`), excluidas del repositorio vía `.gitignore`. El archivo
`.env.example` documenta las variables requeridas sin exponer valores reales.
Las variables prefijadas con `PUBLIC_` se exponen al cliente de forma controlada
por Astro; ninguna clave de servicio con permisos elevados debe usarse con este
prefijo.

### Autenticación de usuarios invitados

Las interacciones de usuarios anónimos se rastrean exclusivamente en
`localStorage` del navegador, sin crear registros en la base de datos hasta
que el usuario opte por registrarse. Esto evita la acumulación de datos no
verificados en el backend.

### Linting y type safety

La configuración de ESLint incluye las reglas `@typescript-eslint/no-unused-vars`
como error y `@typescript-eslint/no-explicit-any` como advertencia, reforzando
la seguridad de tipos en toda la codebase. El script `type-check` ejecuta
`tsc --noEmit` para detectar errores de tipado sin emitir archivos.

---

## 🌐 Repository Architecture

Este proyecto está centralizado en **GitHub**, que actúa como la única fuente de verdad y entorno de desarrollo. Aquí se gestiona tanto el código fuente del frontend como las configuraciones de seguridad, base de datos y flujos de trabajo de automatización.

La arquitectura se beneficia de la integración continua para validaciones de calidad y despliegue automático hacia Vercel.

---

## 🤝 Contributing

¡Las contribuciones son bienvenidas! Para colaborar:

1. **Fork** el repositorio.
2. Crea una rama para tu mejora: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios siguiendo las [guías de estilo](docs/CONTRIBUTING.md).
4. Asegúrate de que los tests pasen: `npm test`.
5. Envía un **Pull Request**.

---

## 🚀 Roadmap

## 📄 License

Este proyecto está distribuido bajo la licencia **MIT**.

Puedes usar, copiar, modificar, fusionar, publicar, distribuir y sublicenciar
el software libremente, siempre que se incluya el aviso de copyright original.

Copyright © 2025 **Sebastián Zhunaula** (devsebastian44)

---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <b>Sebastián Zhunaula</b><br/>
      <sub>Full-Stack Developer · Frontend Specialist · Content Creator</sub><br/><br/>
      <a href="https://github.com/devsebastian44">
        <img src="https://img.shields.io/badge/GitHub-devsebastian44-black?style=flat&logo=github" />
      </a>
      <br/>
      <a href="https://devblog44.vercel.app">
        <img src="https://img.shields.io/badge/Blog-devblog44.vercel.app-000?style=flat&logo=vercel" />
      </a>
    </td>
  </tr>
</table>

> Este proyecto forma parte de un portafolio de desarrollo web full-stack,
> demostrando integración moderna de Astro 6, Supabase, Tailwind CSS 4,
> TypeScript estricto y Prisma ORM en una plataforma de contenido técnico
> con autenticación completa, interacciones sociales en tiempo real y
> despliegue en producción sobre Vercel.
