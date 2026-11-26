# Why add a `security.txt`

A `security.txt` file provides a standardized way for security researchers to contact you and report vulnerabilities responsibly (RFC 9116).

## Why it matters

- Creates a clear, well-known disclosure path for bug reports.
- Reduces lost reports caused by unclear contact points.
- Signals operational maturity and security awareness.
- Aligns with RFC 9116 conventions used across the web.

## Minimum useful setup

```ts title="astro.config.mjs"
eminence({
  securityTxt: {
    contact: "mailto:security@example.com",
    expires: "1 year",
    policy: "https://example.com/security-policy", // optional but recommended
  },
});
```

- At least one `contact` (`mailto:` or `https://`).
- A realistic `expires` you can maintain (use a duration string like `"1 year"` so the date moves forward on each rebuild).
- Optional `policy` URL pointing to your disclosure policy page.

## Operational guidance

- Keep the contacts monitored — a stale alias is worse than no security.txt.
- Rotate `expires` before it lapses. RFC 9116 requires the date to be in the future.
- Avoid publishing addresses you cannot read or respond to.

## Silence the recommendation when you intentionally skip

```ts
eminence({ securityTxt: false });
```

## Cross-references

- Generation feature: [../integration/security-txt.md](../integration/security-txt.md).
- <https://www.rfc-editor.org/rfc/rfc9116>.
- <https://securitytxt.org/>.
