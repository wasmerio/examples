#!/usr/bin/env node

// cli/index.js
const { mkdir, cp, writeFile } = require("fs/promises");
const { join, dirname } = require("path");
const { spawn } = require("child_process");
const { Command } = require("commander");
const program = new Command();

program
  .name("astro-fox")
  .description("CLI for Astro blog template")
  .version("0.1.0");

program
  .command("init <project-name>")
  .description("Initialize a new Astro blog")
  .action(async (projectName) => {
    try {
      console.log(`Creating new Astro blog: ${projectName}`);

      const sourceDir = join(dirname(__filename), "..");
      const targetDir = join(process.cwd(), projectName);

      await mkdir(targetDir, { recursive: true });
      await mkdir(join(targetDir, "src"), { recursive: true });
      await mkdir(join(targetDir, "public"), { recursive: true });
      await mkdir(join(targetDir, "src/content"), { recursive: true });
      await mkdir(join(targetDir, "src/content/blog"), { recursive: true });
      await mkdir(join(targetDir, "src/content/log"), { recursive: true });
      await mkdir(join(targetDir, "src/content/projects"), { recursive: true });

      await cp(
        join(sourceDir, "package.json"),
        join(targetDir, "package.json"),
      );

      await cp(join(sourceDir, "src"), join(targetDir, "src"), {
        recursive: true,
      });

      await cp(join(sourceDir, "public"), join(targetDir, "public"), {
        recursive: true,
      });

      const configFiles = [
        "astro.config.mjs",
        "tailwind.config.mjs",
        "tsconfig.json",
        "eslint.config.mjs",
        ".prettierrc.mjs",
        ".prettierignore",
        "README.md",
        "LICENSE",
      ];

      for (const file of configFiles) {
        await cp(join(sourceDir, file), join(targetDir, file));
      }
      console.log(`
        🦊 Project created successfully!
        cd ${projectName}
        npm run dev
      `);
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  });

// blog 명령어
program
  .command("blog <title>")
  .description("Create a new blog post")
  .option("-d, --description <desc>", "Post description")
  .option("-t, --tags <tags>", "Comma separated tags")
  .action(async (title, options) => {
    try {
      const date = new Date().toISOString().split("T")[0];
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const content = `---
title: ${title}
description: ${options.description || ""}
pubDate: ${date}
tags: ${options.tags ? options.tags.split(",") : []}
---

# ${title}

Write your content here...
`;

      await mkdir("src/content/blog", { recursive: true });
      await writeFile(`src/content/blog/${slug}.md`, content);
      console.log(`Blog post created: src/content/blog/${slug}.md`);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program
  .command("log <title>")
  .description("Create a new log entry")
  .option("-d, --description <desc>", "Log description")
  .option("-t, --tags <tags>", "Comma separated tags")
  .action(async (title, options) => {
    try {
      const date = new Date().toISOString().split("T")[0];
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const content = `---
title: ${title}
description: ${options.description || ""}
pubDate: ${date}
tags: ${options.tags ? options.tags.split(",") : []}
---

# ${title}

Write your log here...
`;
      try {
        await access("src/content/log");
      } catch (error) {
        await mkdir("src/content/log", { recursive: true });
      }
      await writeFile(`src/content/log/${slug}.md`, content);
      console.log(`Log entry created: src/content/log/${slug}.md`);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program
  .command("projects <title>")
  .description("Create a new project entry")
  .option("-d, --description <desc>", "Project description")
  .option("-c, --company <company>", "Company name")
  .option("-s, --start-date <date>", "Start date (YYYY-MM-DD)")
  .option("-e, --end-date <date>", "End date (YYYY-MM-DD)")
  .action(async (title, options) => {
    try {
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const content = `---
title: ${title}
description: ${options.description || ""}
company: ${options.company || ""}
startDate: ${options.startDate || new Date().toISOString().split("T")[0]}
endDate: ${options.endDate || ""}
---

# ${title}

Write your project details here...
`;

      await mkdir("src/content/projects", { recursive: true });
      await writeFile(`src/content/projects/${slug}.md`, content);
      console.log(`Project entry created: src/content/projects/${slug}.md`);
    } catch (error) {
      console.error("Error:", error);
    }
  });

program.parse();
