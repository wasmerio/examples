+++
title = "Newsletter"
date = 2026-01-10T00:00:00Z
draft = false
tags = ["demo", "shortcodes"]
SubTitle = "What the newsletter form looks like when rendered."
+++

The `newsletter-form` shortcode renders a minimal email signup form. Below is a live example.

---

### Subscribe

New posts by email. No tracking, no ads, unsubscribe anytime.

{{< newsletter-form >}}

---

### How to wire it up

The form submits to a URL you configure. Edit `layouts/shortcodes/newsletter-form.html` in your own site (copy it from the theme first) and fill in two values:

**1. The `action` attribute** — the POST URL from your email provider:

```html
<form action="https://buttondown.email/api/emails/embed-subscribe/yourname" method="POST">
```

Common providers and their form endpoints:

| Provider | Action URL pattern |
|----------|--------------------|
| [Buttondown](https://buttondown.email) | `https://buttondown.email/api/emails/embed-subscribe/{username}` |
| [Mailchimp](https://mailchimp.com) | Found in Mailchimp → Audience → Signup Forms → Embedded Forms |
| [ConvertKit](https://convertkit.com) | Found in ConvertKit → Forms → Embed |
| [Listmonk](https://listmonk.app) | Self-hosted: `https://your-domain/subscription/form` |

**2. The `list` hidden field** — a value your provider uses to identify which list to add the subscriber to:
