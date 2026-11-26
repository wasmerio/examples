---
tagline: "Get a full fake REST API with zero coding in less than 30 seconds."
description: "A fake REST API powered by a simple JSON file. Great for prototyping, mocking, and tutorials."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Runtime"
    value: "Node"
install: |
  npm install -g json-server
features:
  - title: "Zero-config API"
    body: "Point json-server at a JSON file and get a full REST API with routes, pagination, and filtering instantly."
    image:
      gradient: "linear-gradient(135deg, #141413 0%, #2a2a26 100%)"
      cover: true
  - title: "Standard REST"
    body: "GET, POST, PUT, PATCH, and DELETE work out of the box, with sensible defaults for IDs and relationships."
    icon: "M12 3v12m0 0l-4-4m4 4l4-4"
  - title: "Custom routes"
    body: "Define custom routes and middleware to shape the API for your prototype or demo."
    icon: "M4 5h16M4 12h16M4 19h10"
links:
  - label: "Website"
    href: "https://json-server.typicode.com"
# Section system demo (Phase 1): explicitly declares the same sections the
# legacy fixed order renders, so this product is the worked example for
# "MD declares data, code registry maps components". Entries without `data`
# are filled from the matching field above (tagline/features/highlights/install).
sections:
  - type: hero
  - type: highlights
    data:
      variant: badge
  - type: install
  - type: features
    data:
      layout: bento
      eyebrow: "Why json-server"
      title: "Built for prototyping"
  - type: stats
    data:
      eyebrow: "By the numbers"
      title: "Adopted by teams everywhere"
      items:
        - { label: "GitHub Stars", value: "58k" }
        - { label: "npm weekly downloads", value: "1.2M" }
        - { label: "License", value: "MIT" }
  - type: testimonials
    data:
      - quote: "json-server got our prototype off the ground in an afternoon."
        author: "Ada Chen"
        role: "Frontend Engineer"
        company: "Nimbus"
        rating: 5
        avatar:
          github: "n8n-io"
      - quote: "The fastest way to mock a backend for tutorials and demos."
        author: "Marcus Lee"
        role: "Tech Writer"
        company: "OpenLab"
        rating: 4
        avatar:
          github: "torvalds"
      - quote: "It replaced our in-house mock service with a single JSON file."
        author: "Noah Kim"
        role: "QA Lead"
        company: "Broadleaf"
        rating: 5
        avatar:
          github: "dev-bobsong"
  - type: docs-preview
  - type: faq
    data:
      - q: "Is json-server production-ready?"
        a: "It targets prototyping and demos; pair it with a real backend for production."
      - q: "Does it support filtering and pagination?"
        a: "Yes - out of the box, via query parameters."
  - type: cta
    data:
      primary: { label: "Get Started", href: "/json-server/docs/getting-started" }
      secondary: { label: "View Source", href: "https://github.com/typicode/json-server" }
---

`json-server` watches a JSON file and exposes it as a REST API. It is a popular
choice for quick prototyping, tutorials, and front-end work that needs a
realistic backend without writing one.

## How it works

Provide a `db.json` file describing your resources:

```json
{
  "posts": [{ "id": 1, "title": "Hello" }],
  "comments": [{ "id": 1, "body": "Nice", "postId": 1 }]
}
```

Then run `json-server db.json` and fetch from `http://localhost:3000/posts`.
