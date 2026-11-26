# How to Use the Project Template

A starter template is provided at `src/content/projects/_template.md`.

## Quick Start

1. **Copy** the template:
   ```
   src/content/projects/_template.md → src/content/projects/your-project.md
   ```

2. **Create** the media folder:
   ```
   public/images/projects/your-project/
   ```

3. **Fill in** required frontmatter:
   - `title` — English project title
   - `description` — One-sentence summary (start with a verb)
   - `pid` — Next available project ID
   - `date` — ISO date (YYYY-MM-DD)

4. **Add images** to your media folder:
   - `logo.png` — Project icon
   - `cover.png` — Primary screenshot (optional but recommended)

5. **Write content** in both `<div class="lang-en">` and `<div class="lang-de">`

6. **Set** `ready: true` when done

7. **Build** to verify: `npm run build`

## Template Sections

The template includes these sections with guidance comments:

### Required
- **Context** — What is this project? (2–4 sentences)
- **Problem** — What challenge does it solve?
- **Solution** — What you built and how (bullet points)
- **Outcome** — Results and impact
- **Tech Stack** — Technologies used

### Optional (delete if unused)
- Architecture
- Screenshots
- Deployment
- Security & Access Control
- Monitoring & Observability
- Lessons Learned

## Writing Tips

- **Description**: Start with a verb — "Built", "Designed", "Developed"
- **Context**: Assume no domain knowledge — set the scene
- **Problem**: Be specific — what was broken, missing, or painful?
- **Solution**: Focus on YOUR decisions, not just features
- **Outcome**: Mention impact — adoption numbers, time saved, published artifacts
- Keep sections 3–6 bullet points or 2–4 paragraphs max

## Example

A filled-out example is at `src/content/projects/_example-filled.md` (with `ready: false` so it won't render).

## Template Files

| File | Purpose |
|------|---------|
| `_template.md` | Blank starter — copy for each new project |
| `_example-filled.md` | Complete reference showing all fields in use |

Both files have `ready: false` and will never appear on the site.
