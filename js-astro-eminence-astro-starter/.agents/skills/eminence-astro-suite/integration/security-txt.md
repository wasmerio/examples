# `securityTxt` — `.well-known/security.txt` generation

Generates `dist/.well-known/security.txt` per **RFC 9116**.

## Minimal usage

```ts title="astro.config.mjs"
eminence({
  securityTxt: {
    contact: "mailto:security@example.com",
    expires: "1 year",
  },
});
```

Output (rendered at build time):

```txt
Contact: mailto:security@example.com
Expires: 2027-06-15T00:00:00.000Z
```

## Options

```ts
type SecurityTxtOptions = {
  contact: string | string[];
  expires: Date | string | SecurityTxtExpiresDuration;
  encryption?: string | string[];
  acknowledgments?: string | string[];
  preferredLanguages?: string | string[];
  canonical?: string | string[];
  policy?: string | string[];
  hiring?: string | string[];
  csaf?: string | string[];
};

type SecurityTxtExpiresUnit =
  "day" | "days" | "month" | "months" | "year" | "years";

type SecurityTxtExpiresDuration = `${number} ${SecurityTxtExpiresUnit}`;
```

| Field                | Type                                           | Required | Description                                                                   |
| -------------------- | ---------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `contact`            | `string \| string[]`                           | yes      | At least one contact. Must start with `mailto:` or be a valid `https://` URL. |
| `expires`            | `Date \| string \| SecurityTxtExpiresDuration` | yes      | Policy expiry. See "Expires resolution" below.                                |
| `encryption`         | `string \| string[]`                           | no       | HTTPS URL(s) to PGP key.                                                      |
| `acknowledgments`    | `string \| string[]`                           | no       | HTTPS URL(s) to researcher acknowledgments page.                              |
| `preferredLanguages` | `string \| string[]`                           | no       | BCP 47 tag(s) joined with `, `.                                               |
| `canonical`          | `string \| string[]`                           | no       | HTTPS URL(s) to the canonical security.txt.                                   |
| `policy`             | `string \| string[]`                           | no       | HTTPS URL(s) to the disclosure policy page.                                   |
| `hiring`             | `string \| string[]`                           | no       | HTTPS URL(s) to security-related job listings.                                |
| `csaf`               | `string \| string[]`                           | no       | HTTPS URL(s) to CSAF provider metadata.                                       |

## Expires resolution

Three input shapes are accepted:

1. **`Date` instance** → serialized as ISO 8601 (UTC).
2. **Duration string** like `"30 days"`, `"6 months"`, `"1 year"`, `"18 months"` — added to the current UTC time at build time.
3. **Any other string** → parsed via `new Date(...)`. Must produce a valid date.

Unit values accepted in duration strings: `day`, `days`, `month`, `months`, `year`, `years` (case-insensitive). Amount must be a positive integer ≥ 1.

## Example: full policy

```ts
eminence({
  securityTxt: {
    contact: [
      "mailto:security@example.com",
      "https://example.com/security/contact",
    ],
    expires: "6 months",
    encryption: "https://example.com/.well-known/pgp-key.txt",
    acknowledgments: "https://example.com/security/hall-of-fame",
    preferredLanguages: ["en", "fr"],
    policy: "https://example.com/security/policy",
    hiring: "https://example.com/jobs/security",
  },
});
```

## Behavior

- Generation is skipped (with a warning) if the output file already exists.
- Omitting `securityTxt` triggers a recommendation warning. Pass `securityTxt: false` to disable explicitly and silence the warning.
- The file is written to `dist/.well-known/security.txt`; the directory is created if missing.

## Rules

- `contact` values must be `mailto:...` or `https://...` (no `http://`).
- All other URL fields (`encryption`, `acknowledgments`, `canonical`, `policy`, `hiring`, `csaf`) must be `https://...` URLs.
- `expires` cannot be in the past in practice (RFC 9116 says it MUST be in the future); the integration does not enforce this — set a sensible duration.
- The standard requires re-publishing before the `Expires` date passes. Treat the file as something to refresh, not set-and-forget.

## Cross-references

- Why a security.txt at all: [../recommendations/security-txt.md](../recommendations/security-txt.md).
- RFC 9116: <https://www.rfc-editor.org/rfc/rfc9116>.
