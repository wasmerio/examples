<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [ASTRObash](https://github.com/jjunlob074/ASTRObash) Astro theme by jjunlob074, copied from commit `78388c7860e9b7e7b2b3778e41ee98d6f0d17893` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-astr-obash.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [jjunlob074](https://github.com/jjunlob074), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# ASTRObash: Linux Terminal Simulation with Astro, React, and Tailwind CSS

ASTRObash is a project that simulates a Linux terminal, allowing users to execute commands like `ls`, `pwd`, `cat`, and `open-image`. It offers an interactive and dynamic terminal-like interface, built with Astro for static site generation, React for interactive components, and Tailwind CSS for styling.

## Features

- **Command Simulation**:
  - `ls`: List directory contents.
  - `pwd`: Display the current directory.
  - `cat`: View file contents.
  - `open-image`: Open and view images in a modal.

- **Directory Navigation**: Navigate directories and manage file paths easily.

- **Responsive Design**: A clean and responsive terminal interface using Tailwind CSS.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/jjunlob074/ASTRObash.git
    ```

2. Navigate to the project folder:
    ```sh
    cd ASTRObash
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

    The application will be accessible at [http://localhost:4321](http://localhost:4321).

## Available Commands

| Command                 | Action                                      |
| :---------------------- | :------------------------------------------ |
| `npm install`           | Install dependencies.                       |
| `npm run dev`           | Start the development server.              |
| `npm run build`         | Build the project for production.          |
| `npm run preview`       | Preview the production build.              |

## Learn More

For more details, visit the [official documentation](https://docs.astro.build).
