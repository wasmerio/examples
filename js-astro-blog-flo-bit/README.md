<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [minimalistic blog template](https://github.com/flo-bit/blog-template) Astro theme by flo-bit, copied from commit `ea782c7241901acabbdcfe0295fa2dc5372f76fc` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-blog-flo-bit.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [flo-bit](https://github.com/flo-bit), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/18bd5c7e-3f45-4485-b4e8-6f0a45ca931d">
  <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/98d51208-2332-43e9-9ffb-787597644862">
  <img alt="Screenshot of blog template, main page." src="https://github.com/user-attachments/assets/98d51208-2332-43e9-9ffb-787597644862">
</picture>

[LIVE DEMO](https://flo-bit.dev/blog-template/)

# astro blog template

minimalistic but opinionated blog template using [astro](https://astro.build/) and [svelte](https://svelte.dev/). aims to be super easy to deploy and use, with a focus on performance and SEO, ease-of-use and design.

See a [live demo here](https://flo-bit.dev/blog-template/) (also doubles as a tutorial on how to use this template).

Features:

- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data (automatically generated)
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown support
- ✅ Pagination
- ✅ Syntax highlighting (+ copy button)
- ✅ Dark and light mode with toggle button or auto-detect
- ✅ Search included
- ✅ Tags for posts
- ✅ Super easy to deploy as a static site
- ✅ Includes some prebuilt components for you to use
- ✅ Easy to edit by editing the markdown directly
- ✅ Comments and likes via bluesky

## tutorials

the demo blog doubles as a tutorial on how to use this template:

- [quick start with github pages](https://flo-bit.dev/blog-template/posts/how-to-use)

- [adding content](https://flo-bit.dev/blog-template/posts/adding-content)

- [comments and likes via bluesky](https://flo-bit.dev/blog-template/posts/comments-via-bluesky)

## quick start with github pages in 5 minutes

1. Fork [the repository of this blog](https://github.com/flo-bit/blog-template) 

- Either name your fork `<github-username>.github.io` if you want your blog to live at `<github-username>.github.io` 

- Or choose any other repo name and it will live at `<github-username>.github.io/<repo-name>`

2. In your repository settings, set up github pages to deploy using github actions (_SETTINGS_ -> _PAGES_ -> _SOURCE_: **Github Actions**)

3. Set up your blog info in `src/config.ts`, most importantly the `SITE` and `BASE` variables:

- `SITE`: set to `https://<github-username>.github.io`
- `BASE`: if repo name is `<github-username>.github.io` set to `/`, otherwise set to `/<repo-name>`

4. Once you push your changes to main your blog should be live in about 1-2 minutes at 
`<github-username>.github.io` or `<github-username>.github.io/<repo-name>`

5. Set up more info in `src/config.ts` (see [all options here](https://flo-bit.dev/blog-template/posts/configuring-the-blog))

- `SITE_TITLE` is the title of your blog, and will be shown in the header and in search results
- `SITE_DESCRIPTION` is the description of your blog, and will be shown e.g. in search results
- `SITE_FAVICON` is the emoji that will be shown as favicon of your blog (will be shown in the header and as favicon)
- `NAME` is the name of the author of the blog, will be shown in the footer as `(c) <YEAR> <NAME> - LICENSE`
- `BLUESKY_IDENTIFIER` is your bluesky handle (without the `@`), this is needed for likes and comments to work 
(see [comments via bluesky](https://flo-bit.dev/blog-template/posts/comments-via-bluesky))
- `SOCIAL_LINKS` set your social media links here, e.g. `{ BLUESKY_URL: "https://bsky.app/profile/flo-bit.dev" }` 
will be shown in the footer of the blog

6. Edit `about.mdx` in `src/content/info/` to add your own about page.

7. Remove all files from `src/content/blog/` and add your own blog posts there. Time to write your first blog post! 
(see [adding content](https://flo-bit.dev/blog-template/posts/adding-content) for more info)

8. Anytime you push to the main branch, your blog will automatically be updated (should usually take less than 2 minutes). 
You can also go to the github actions tab to check the progress/status.

If you run into any issues, feel free to [open an issue](https://github.com/flo-bit/blog-template/issues) or 
[contact me on bluesky](https://bsky.app/profile/flo-bit.dev)

## Notes

Search currently only works in production mode (i.e. when running `npm run build`) not in dev mode (`npm run dev`).

## Credits

Adopted from the default astro blog template when running `npm create astro@latest`.

## License

MIT.
