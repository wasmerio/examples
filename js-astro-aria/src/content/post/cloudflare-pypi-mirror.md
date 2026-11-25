---
layout: ../../layouts/post.astro
title: Building a CORS-Friendly PyPI Mirror on Cloudflare
description: Set up a lightweight PyPI mirror on Cloudflare Workers or Snippets that supports PEP 691 and CORS for in-browser Pyodide environments.
dateFormatted: Dec 21, 2024
---

[Pyodide](https://pyodide.org/) runs Python inside WebAssembly, using [Micropip](https://micropip.pyodide.org/) to fetch packages from PyPI. When running in a browser, Micropip has two strict requirements: proper CORS headers, and support for the JSON-based Simple API ([PEP 691](https://peps.python.org/pep-0691/)).

Direct access to PyPI from mainland China is often unreliable, but domestic mirrors present their own challenges. Mirrors like Alibaba Cloud, Tencent Cloud, and Huawei Cloud only serve the legacy HTML index. Tsinghua's TUNA mirror supports PEP 691, but does not send CORS headers.

As a result, there were essentially zero domestic mirrors that Micropip could pull from directly inside the browser.

To bridge this gap, I set up a Cloudflare-based mirror that adds CORS headers and handles PEP 691 lookups.

You can deploy it using either Cloudflare Workers or Cloudflare Snippets:

### [Workers](https://workers.cloudflare.com/)

- **Pros**: Runs on the Free tier.
- **Cons**: Every package check counts as a Worker request, which can burn through free quotas quickly.

### [Snippets](https://developers.cloudflare.com/rules/snippets/)

- **Pros**: Does not count against Worker request limits, ideal for high traffic.
- **Cons**: Currently requires a Pro plan or above.

## Code

The project is open source on GitHub:

[https://github.com/ccbikai/cloudflare-pypi-mirror](https://github.com/ccbikai/cloudflare-pypi-mirror)

[![Cloudflare PyPI Mirror](https://github.html.zone/ccbikai/cloudflare-pypi-mirror)](https://github.com/ccbikai/cloudflare-pypi-mirror)
