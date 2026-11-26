# Astro + Cloudflare Workers security checklist

## Secrets and configuration

- **Never** commit `.env`, API keys, tokens, or private keys.
- Use `wrangler secret put <NAME>` for production secrets.
- `wrangler.jsonc` `vars` are for non-secret config only.
- Do not expose secrets via `import.meta.env` to client bundles — only `PUBLIC_` prefixed vars are client-safe in Astro.
- Regenerate types after binding changes: `pnpm cf-typegen`.

## Server actions (`src/actions/`)

Pattern for new actions:

```ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  myAction: defineAction({
    input: z.object({
      email: z.string().email(),
      message: z.string().min(1).max(5000),
    }),
    handler: async (input) => {
      // validate, authorize, then act — never trust input shape alone
    },
  }),
};
```

- Always define `input` with Zod (or equivalent) — reject before handler logic.
- Authorize inside the handler (user identity, rate limits).
- Return generic errors to clients; log details server-side only.

## SSR and middleware

- `src/middleware.ts` runs on every request — keep it fast and side-effect safe.
- Do not reflect raw user input into redirects without allowlist validation.
- Locale routing via Paraglide middleware — validate custom locale overrides if added.

## Output encoding

| Context         | Approach                                                               |
| --------------- | ---------------------------------------------------------------------- |
| HTML text       | Astro auto-escapes `{var}`; avoid `set:html` with user data            |
| HTML attributes | Use framework bindings; never concatenate user input into `href`/`src` |
| JSON responses  | `JSON.stringify` — do not build JSON with string templates             |
| URLs            | `URL` constructor + allowlist for external redirects                   |

## Svelte client components

- Avoid `{@html userContent}`.
- Sanitize if rich text is required (prefer server-side sanitization).
- Do not store secrets in component state or `localStorage`.

## Headers (when adding middleware or adapter hooks)

Consider for production:

- `Content-Security-Policy` — restrict script/style sources
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disable unused browser features

ponytail: full CSP tuning is site-specific; start with report-only or a minimal policy and tighten.

## Dependencies

- Run `pnpm audit` for known CVEs in dependencies.
- Pin major versions; review new deps for supply-chain risk.
- Prefer platform bindings (KV, R2, D1) over third-party APIs when equivalent.

## Forms

- CSRF token or SameSite=Lax/Strict cookies on session cookies.
- Turnstile widget on public forms if spam is observed.
- Server-side validation mirrors client validation — client-only validation is not security.
- Rate limit submissions at the Worker or platform level for abuse-prone endpoints.

## Workers runtime

- `compatibility_flags`: `nodejs_compat` widens attack surface — only import Node libs when needed.
- `waitUntil` for async side effects — do not block response on non-critical work.
- Do not log request bodies containing passwords or tokens.

## Incident response

Undisclosed vulnerabilities: follow [`.github/SECURITY.md`](../../../.github/SECURITY.md). Do not open public issues for active exploits.
