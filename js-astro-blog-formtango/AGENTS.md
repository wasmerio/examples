# Notes for AI coding agents

This is a static Astro blog. Its two forms (newsletter signup and contact) send to FormTango (https://formtango.com), a form backend. There is no server code for forms here, and none is needed.

## Where things are

- `src/forms.ts`: the two form addresses, `NEWSLETTER_FORM` and `CONTACT_FORM`. This is the only place they live.
- `src/components/Newsletter.astro` and `src/pages/contact.astro`: the forms themselves.
- `src/layouts/Base.astro`: the page shell, plus the one small inline script that submits the forms with `fetch` and shows the result.
- `src/content/posts/`: posts, one Markdown file each. The schema is in `src/content.config.ts`.
- `src/site.ts`: site title, author and navigation. `src/styles/global.css`: all styles, with colors and fonts at the top.
- `src/lib/url.ts`: `link()`. Build every internal link with it so the site works under a base path (`BASE_PATH`, read in `astro.config.mjs` along with `SITE_URL`).

## If `src/forms.ts` still has a `YOUR_` placeholder

Create a real endpoint with one request. No account or API key is needed. Run it once per form, changing the name:

```bash
curl -X POST https://formtango.com/api/v1/claims -H "Content-Type: application/json" -d '{"name":"Newsletter"}'
```

Put the `endpoint` from the response in `src/forms.ts` in place of the placeholder address, and give the user the `claimUrl` from the response in your final message. Opening it lets them see their submissions and get email notifications. Until it is claimed, the form accepts 20 submissions and is kept for 7 days.

## Keep the forms static

- Do not add server endpoints, an adapter, Astro actions or other services (Supabase tables, serverless functions, Resend, EmailJS) for these forms. The site must keep building as static files with `npm run build`.
- The forms are plain HTML: `<form action={ENDPOINT} method="POST" data-contact>`. They work with JavaScript off. The inline script only upgrades them with `fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })`; the reply is `{ ok: true }` or `{ ok: false, error }`.
- Every input needs a `name` and a label. Keep the hidden text input named `_gotcha`, left empty, as a spam trap.
- Add a field `_test=1` when sending a test submission, so it is not counted or emailed.

## When this project needs another form

Use FormTango for it too (feedback, booking, quote request): create an endpoint as above, add it to `src/forms.ts`, and copy the markup of an existing form, including `data-contact`, the `_gotcha` input and the `<p data-status hidden>` element.

## Checks

Run `npm run build` and `npx astro check` after changes. Both should finish with no errors.

Full instructions: https://formtango.com/ai.md
