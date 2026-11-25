---
layout: ../../layouts/post.astro
title: "L(O*62).ONG: Making URLs Absurdly Long"
description: Building a URL lengthener that pushes the 63-character DNS label limit and wrestling with TLS certificate commonName constraints.
dateFormatted: Jun 1, 2024
---

I built this little toy last week in just a few lines of code. Its only job is to turn short links into absurdly long ones, taking full advantage of the maximum 63-character limit for a single DNS label:

`loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong`

While the application logic was trivial, getting it deployed ran straight into a weird TLS edge case: **certificate issuance**.

- The maximum length of a single DNS domain label is 63 characters.
- In traditional X.509 TLS certificates, the `commonName` (CN) field has a strict limit of 64 characters.
- Because `loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong` is 67 characters total (63 + 1 + 3), putting the full domain into the `commonName` fails validation.

This caused automated Let's Encrypt issuance to fail across Cloudflare, Vercel, and Netlify, because their ACME pipelines put the domain into the `commonName` field. Interestingly, Zeabur managed to issue a Let's Encrypt certificate, likely because their ACME client left the CN empty and relied exclusively on the Subject Alternative Name (SAN) extension.

On Cloudflare, I resolved it by switching the edge certificate authority from Let's Encrypt to **Google Trust Services (GTS)**, which issued the certificate immediately.

You can view the certificate details on crt.sh: [https://crt.sh/?q=loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong](https://crt.sh/?q=loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)

Live site: [https://loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong](https://loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)

[![GitHub](https://github.html.zone/ccbikai/loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)](https://github.com/ccbikai/loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo.ong)
