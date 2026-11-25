# Quick Start Tutorial

See real results in your first 5 minutes.

## Minutes 1-2: Personalize Your Info

Open `.env` and update the following:

```bash
SITE_AUTHOR_NAME="Your Full Name"
SITE_AUTHOR_TITLE="Your Job Title"
SITE_AUTHOR_EMAIL=you@example.com
SITE_AUTHOR_BIO="A short bio about yourself (1-2 sentences)"

SOCIAL_GITHUB=https://github.com/your-username
SOCIAL_LINKEDIN=https://linkedin.com/in/your-username
```

Save the file and refresh your browser. The homepage now displays your name and info!

## Minutes 3-4: Add Your First Project

Create a new file `src/content/projects/my-first-project.mdx`:

```yaml
---
title: "Your Project Name"
role: "Full Stack Developer"
year: 2024
featured: true
outcomeSummary: "Key outcome of this project"
overview: "Brief description of the project"
problem: "What problem did you solve?"
constraints:
  - "Time/budget/resource constraints"
approach: "How did you approach the solution?"
keyDecisions:
  - decision: "Key technical decision"
    reasoning: "Why you made this choice"
    alternatives:
      - "Alternative you considered"
techStack:
  - "React"
  - "Node.js"
impact:
  metrics:
    - label: "Users"
      value: "1000+"
  qualitative: "Positive impact of the project"
learnings:
  - "What you learned from this project"
---

Additional content about the project (optional).
```

## Minute 5: See the Results

1. Make sure dev server is running: `npm run dev`
2. Open [http://localhost:4321](http://localhost:4321)
3. Your new project appears on the homepage (because `featured: true`)
4. Click to view the project detail page

## Removing Sample Content

The theme includes 42 sample files. To start fresh:

```bash
# Remove all sample content
rm -rf src/content/*/*.mdx
```

Or remove by category:

```bash
rm -rf src/content/speaking/*    # If you don't do presentations
rm -rf src/content/decisions/*   # If you don't want decision logs
```

After removing, either:
- Create at least 1 content file in each category you use
- Or hide empty pages by editing navigation in `src/config.ts`

## Next Quick Wins

- **Add a Journey Entry** — Share career milestones in `src/content/journey/`
- **Write a Blog Post** — Share your knowledge in `src/content/writing/`
- **Update Uses Page** — Document your tools in `src/content/uses/`

## Next Steps

- [Content Guide](../03-content/content-guide.md) — Complete guide for all content types
- [Configuration](../02-configuration/configuration.md) — All configuration options
