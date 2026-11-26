---
title: 'Zahit Theme: Step-by-Step Installation Guide'
description: 'Learn how to easily install, configure, and get started with the Zahit theme on your local machine.'
pubDate: '2026-05-17'
tags: ['zahit-guide', 'installation', 'astro']
translationKey: 'zahit-installation'
---

Welcome to the **Zahit** installation guide! Zahit is a raw, flat minimalist Astro v7 theme built on the philosophy that simplicity is depth. In this guide, we will walk you through the process of cloning the repository, installing the required dependencies, and starting the local development environment.

## Prerequisites

Before we begin, make sure you have the following prerequisites installed on your system:

- **Node.js:** Version `22.12.0` or higher is recommended. You can verify your version by running:
  ```bash
  node --version
  ```
- **Git:** Essential for cloning the repository and managing your source code versions.

---

## Step 1: Clone the Repository

To install Zahit, you first need to clone the repository to your local directory. Open your terminal and run the following command:

```bash
git clone https://github.com/kuscadev/Zahit.git
```

Once the cloning process is complete, navigate into the project directory:

```bash
cd Zahit
```

---

## Step 2: Install Project Dependencies

Zahit uses lightweight dependencies like `@astrojs/mdx` for content rendering and `astro-icon` for flat SVG styling. Run the following command in the root folder of the project to install all required packages:

```bash
npm install
```

This command will read the `package.json` file and create the local `node_modules` folder.

---

## Step 3: Run the Development Server

Now that the installation is complete, you can start Astro's rapid local development server:

```bash
npm run dev
```

Your terminal will display the active local URL, which is usually:

```text
  ┃ Local    http://localhost:4321/
```

Open your favorite web browser and navigate to `http://localhost:4321/` to view your live, interactive minimalist environment! Any changes you make to the source code will update automatically in real-time.

---

## Next Steps

Now that your Zahit theme is successfully installed and running, you are ready to configure your profile details and write your first bilingual blog post. 

Proceed to our next guide: **[Zahit Theme: How to Write and Organize Content](/en/blog/usage/)** to learn more about the structure of content collections and dynamic i18n routing.
