<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Shoal](https://github.com/formgong/shoal-astro-theme) Astro theme by formgong, copied from commit `454447b533b35d3b05bbe8e6650bccbb9323d746` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-shoal.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: wrangler.jsonc.
- **Environment variables:** The theme's example env file lists `PUBLIC_FORMGONG_ACCESS_KEY`. The demo builds and runs without them; set them in the app's settings to turn on the features that use them.
- **Credit:** theme by [formgong](https://github.com/formgong), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Shoal

A free Astro theme for real estate agents: a full-screen photo hero, six photo tiles for your services, an agent section, area guides, short notes and a contact form that really sends.

**Live demo:** https://shoal.formgong.com · **No build step?** Download `shoal-html.zip` from the [latest release](https://github.com/formgong/shoal-astro-theme/releases/latest): plain HTML files, replace `fk_your_access_key` and `https://example.com` with your own and upload them anywhere.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/formgong/shoal-astro-theme) [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fformgong%2Fshoal-astro-theme&project-name=shoal&repository-name=shoal&env=PUBLIC_FORMGONG_ACCESS_KEY&envDescription=Your%20Formgong%20access%20key%20%28fk_...%29.%20Create%20a%20free%20form%20to%20get%20one.&envLink=https%3A%2F%2Fformgong.com%2Fnew%3Fname%3Dshoal)

Each button copies the theme to your GitHub, builds it and asks for one value: your Formgong access key (`fk_…`), free at https://formgong.com/new. The form works from the first deploy. Then set `url` in `src/config.ts` to your domain.

The demo agent is **Dana Whitlock**, a fictional realtor on the fictional Kestrel Sound islands. Everything on the site is sample content: phone numbers use the 555-01xx range reserved for fiction, and every email and link uses `example.com`.

- **One file to rebrand.** Name, phone, office, service tiles, island guides, notes and the form key live in `src/config.ts`.
- **Quiet motion.** Headings and captions rise into view once as you scroll, the header hides on the way down and comes back white on the way up, and the service tiles lift their title and darken on hover. No animation library.
- **A contact form that never fakes success.** It shows "Thank you" only when the form backend answers `success: true`. Errors and lost connections show an error. Without JavaScript it still works as a plain HTML form. It opens from the header, the floating "Let's Connect" button and every call to action.
- **Fast and accessible.** Static pages, two self-hosted fonts (Newsreader and Metropolis), one small script. Native `<dialog>` for the form and the menu, visible focus, `prefers-reduced-motion` respected.

Built with Astro 7 and plain CSS.

## Quick start

```bash
npm create astro@latest -- --template formgong/shoal-astro-theme
cd shoal
cp .env.example .env   # then put your access key in .env
npm run dev
```

## Set up the form

1. Create a free form at https://formgong.com/new and copy its access key (`fk_…`).
2. Put it in `.env` as `PUBLIC_FORMGONG_ACCESS_KEY=fk_…`, or in `src/config.ts` under `formgong.accessKey`.
3. Send one test message from your deployed site. It arrives in your Formgong inbox, on Telegram at once if you connect it, and by email.

The key is public by design: it only lets visitors send messages to your form. Spam is filtered with a hidden honeypot field.

**The Formgong credit links your review page.** With a real access key, the build asks Formgong once (`POST https://formgong.com/api/review-page` with the key and your site's `url`). Formgong makes a public review page for your site the first time, where your clients can read and leave reviews, and the "Formgong" link next to the form points there. You can switch the page off in the Formgong dashboard (Reviews → your site → Settings), or change the link in `src/components/ContactForm.astro`. With the placeholder key or another form backend nothing is sent and the link goes to formgong.com.

## Edit the content

- `src/config.ts`: everything on the home page, the island guides (`areas`) and the notes (`notes`).
- `public/img/`: the photographs. Keep the file names or change them in `src/config.ts`.
- `src/pages/about.astro`, `buying.astro`, `selling.astro`: the longer pages.

## Deploy

`npm run build` produces a static site in `dist/` that any static host can serve. Set `url` in `src/config.ts` first so canonical links, the sitemap and the form redirect point at your domain. On Vercel or Netlify, set `PUBLIC_FORMGONG_ACCESS_KEY` in the project's build environment variables: the key is read at build time. The Deploy to Cloudflare button stores it as a Worker secret instead, and `worker.js` puts it into the form as each page is served.

## Photos

The photographs in `public/img/` are from [Unsplash](https://unsplash.com) and are under the [Unsplash License](https://unsplash.com/license), **not** the MIT licence of the code: free to use, but not to sell on their own. Replace them with photos of your own listings and area. Thank you to the photographers:

- `hero.webp`: [Daniel R.](https://unsplash.com/photos/boats-speeding-through-a-blue-ocean-with-islands-ZdbrRlQqPWc)
- `tile-kitchen.webp`: [Jennie Wilson](https://unsplash.com/photos/a-kitchen-with-a-center-island-and-two-stools-ItvZqtoDjgc)
- `tile-living.webp`: [Mahdis Mousavi](https://unsplash.com/photos/view-of-a-living-room-and-fireplace-inOX4reNle8)
- `tile-aerial.webp`: [Keymini](https://unsplash.com/photos/a-house-nestled-among-trees-beside-a-vibrant-blue-lake-SifYeCZHacM)
- `tile-porch.webp`: [Brian Lundquist](https://unsplash.com/photos/2-white-plastic-armchairs-on-brown-sand-during-daytime-eOZ39hS-wYk)
- `tile-dining.webp`: [Cindy Fogg](https://unsplash.com/photos/a-dining-room-with-a-table-and-chairs-aq83Sjs8snA)
- `tile-entry.webp`: [Clay Banks](https://unsplash.com/photos/wooden-bench-with-pillows-below-forest-artwork-ka3Gq_CYz-0)
- `area-harbor.webp`: [XIBEI JIA](https://unsplash.com/photos/white-and-blue-boat-on-sea-under-gray-sky-zZZOAreIhmw)
- `area-ferry.webp`: [Uta Scholl](https://unsplash.com/photos/green-and-white-ship-on-sea-under-gray-sky-during-daytime-fNkQB4MgHlI)
- `area-lighthouse.webp`: [Valentin](https://unsplash.com/photos/a-lighthouse-stands-proudly-overlooking-the-ocean-SVjNWsDKEBk)
- `area-meadow.webp`: [Bernd Dittrich](https://unsplash.com/photos/small-pink-flowers-bloom-on-a-cliff-overlooking-the-ocean-tyu80YcNVNY)
- `agent.webp`: [Jakub Żerdzicki](https://unsplash.com/photos/a-hand-holding-a-key-to-a-door-3HfGnyPfWqQ)
- `cta.webp`: [Roger Starnes Sr](https://unsplash.com/photos/white-house-with-front-porch-goydGbh4SgU)
- `blog-ferry.webp`: [Gantavya Bhatt](https://unsplash.com/photos/a-large-boat-traveling-across-a-large-body-of-water-ip-hoUuoihI)
- `blog-inspection.webp`: [Sasun Bughdaryan](https://unsplash.com/photos/magnifying-glass-over-a-wooden-house-model-HvmqfefQwYw)
- `blog-market.webp`: [engin akyurt](https://unsplash.com/photos/a-pile-of-red-apples-sitting-on-top-of-each-other-yiHeWtjXuas)


## More free form tools

- Build a form field by field and copy plain HTML: https://formgong.com/en/tools/html-form-generator/

## License

The code is MIT. Use it for your own site or for clients. The photos are under the Unsplash License (see above). The "Theme Shoal by Formgong" credit in the footer is optional.
