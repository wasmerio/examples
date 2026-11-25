# Frequently Asked Questions

Here are quick solutions to the most common questions when configuring and running BlogGPT.

## Why is a post visible in `pnpm dev` missing from the production site?

Check whether the post has `draft: true` in its frontmatter. By default, `posts.showDraftsInDev` is enabled (`true`) so you can preview drafts locally, while `pnpm build` strictly excludes all drafts from the production bundle. Set `draft: false` (or remove the `draft` field) when you are ready to publish. Posts dated after the build time are also excluded; rebuild after their publication time to make them available.

## Why does switching languages show content in the fallback language?

When you switch the UI language, BlogGPT looks for sibling translations with the same folder and base filename; every version must also share the same `slug`. If the requested translation is missing, it tries an unsuffixed version, the default language, and then the remaining configured languages, with a notice when displaying another language. See [Languages and Translations](../content/languages.md).

## Why do local post attachments or images return 404?

If you want to reference images or downloadable files using relative paths like `./diagram.png` or `./notes.pdf`, the post **must** be organized as a [Content Bundle](../content/bundles.md)—meaning the post lives in its own folder as `content/posts/<post-name>/index.md` alongside its attachments. Relative file links inside a standalone `content/posts/my-post.md` file will not be copied as bundle attachments.

## Why are Mermaid diagrams rendered as plain code blocks?

Check two settings:

1. In `blog.config.ts`, make sure `article.mermaid` is set to `true` (default).
2. In the post's frontmatter, make sure `mermaid: false` is not set, and wrap your diagram in a fenced ` ```mermaid ` code block.

## Why doesn't search reflect my latest content edits?

Production search uses **Pagefind**, which creates its static index during `pnpm build`. Rebuild after editing content to update results in `pnpm preview`. In `pnpm dev`, a development-only JSON search endpoint works without a Pagefind build. If results still show old content, refresh the page and search again. Run `pnpm build && pnpm preview` before publishing to verify the production index.

## Why do some UI strings stay in the old language after I edit `blog.config.ts`?

Many text fields in `blog.config.ts` (such as `site.title`, `author.bio`, and `text.*`) accept a `Localized` value—either a single string or a per-locale object like `{ zh: '...', en: '...' }`. If you use a per-locale object and only update the `zh` key, switching to `en` will still display the old `en` value. Update all active locales in the object.

## I changed `author.name`—why does the footer still show the old copyright name?

The sidebar profile card reads `author.name`, whereas the copyright line in the footer reads `footer.author` (configured independently of the profile name). Update `footer.author` in `blog.config.ts` to match your name.

## What is the difference between a post `image` (`cover`) and `shareCover`?

- **`image` (or `cover`)** in frontmatter sets the visual banner image displayed on the post page and in category/post cards.
- **`shareCover`** controls the generated Open Graph image (`1200×630` by default) shown when sharing a link. When enabled, the generated card takes priority over `image`; when disabled, the post cover is used if available.

## Why does a category or tag show its raw slug (e.g., `web-dev`) instead of a proper title?

When you reference a category or tag slug in a post's frontmatter (like `categories: [web-dev]`) without creating a corresponding definition file in `content/categories/web-dev.md`, BlogGPT falls back to displaying the raw slug string. Create `content/categories/web-dev.md` with a `title` field (e.g., `title: Web Development`) to give it a clean display name.

## Why doesn't my custom script in `<head>` run again after clicking a link?

BlogGPT uses client-side navigation for fast page transitions, so the browser does not perform a full page reload when moving between articles. Instead of putting DOM-initialization scripts in `DOMContentLoaded`, export an `onPageLoad` function in `custom/client.ts`—it runs both on initial load and after every client-side navigation. See [Custom Hooks and Extensions](../customization/hooks.md).

## Where should I look when `pnpm dev` or `pnpm build` fails with a config error?

Check the terminal output carefully: BlogGPT validates both `blog.config.ts` and all Markdown frontmatter at build time. Most errors are caused by a missing required field (such as `title` in frontmatter or `site.baseUrl` in `blog.config.ts`) or an invalid enum value (such as a typo in `appearance.defaultTheme`). Refer to the [Configuration Reference](../config/reference.md) and [Frontmatter Reference](../content/frontmatter.md).
