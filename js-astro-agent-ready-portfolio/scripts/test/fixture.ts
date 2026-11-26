import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

// A minimal valid content folder. Tests start from it and break one thing.
export const validContent: Record<string, string> = {
  "content/site.ts": `export const site = {
  url: "https://alex.example",
  name: "Alex Rivera",
  title: "Alex Rivera - Engineer",
  description: "Engineer.",
  image: { path: "/images/og.png" },
  profileImage: { path: "/images/me.jpg" },
};
`,
  "content/profile.ts": `export const profile = {
  name: "Alex Rivera",
  role: "Engineer",
  email: "alex@alex.example",
  links: [
    { label: "GitHub", username: "@alex", href: "https://github.com/alex" },
    { label: "Email", username: "alex@alex.example", href: "mailto:alex@alex.example" },
  ],
};
`,
  "content/github-projects.ts": `export const githubProjects = [
  { name: "Tool", href: "https://github.com/alex/tool", page: "tool" },
];
`,
  "content/public/resume.pdf": "pdf",
  "content/public/images/og.png": "png",
  "content/public/images/me.jpg": "jpg",
  "content/posts/first.md": `---
title: First
description: A first post.
published: 2026-01-02
projects: [Tool]
---
Hello.
`,
  "content/projects/tool.md": `---
title: Tool
description: A tool.
repo: https://github.com/alex/tool
updated: 2026-01-02
---
Body.
`,
};

export function makeRoot(overrides: Record<string, string | null> = {}) {
  const root = mkdtempSync(join(tmpdir(), "content-"));
  for (const [file, text] of Object.entries({ ...validContent, ...overrides })) {
    if (text === null) continue;
    const path = join(root, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
  return root;
}

export function run(script: string, args: string[], cwd?: string) {
  const result = spawnSync(
    process.execPath,
    ["--no-warnings", join(import.meta.dirname, "..", script), ...args],
    { cwd, encoding: "utf8" },
  );
  return { code: result.status, out: result.stdout + result.stderr };
}
