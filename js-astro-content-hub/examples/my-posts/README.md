# my-posts (example content repo)

This is a **sample external repo** for the [`astro-content-hub`](https://github.com/awareride/astro-content-hub)
template. It shows how to author blog posts in a separate repository and sync
them into the hub via a pull request.

```
my-posts/
├── posts/
│   ├── en/                  <- default-locale posts (required)
│   │   └── hello-from-my-repo.md
│   └── zh-Hans/             <- Chinese translations (optional, fallback to en)
│       └── hello-from-my-repo.md
├── sync-delete.list         <- opt-in deletion manifest (see below)
├── .github/workflows/
│   └── sync-posts.yml       <- copies posts/ into the hub on push to main
├── skills/site-content-sync/ <- this repo's copy of the sync skill
└── README.md
```

## How it works

1. You author posts under `posts/<locale>/` (see the slug contract in
   `skills/site-content-sync/SKILL.md`).
2. On every push to `main` that touches `posts/`, the `sync-posts.yml` workflow
   validates the content, then opens a **pull request** against the hub's `main`.
3. A human reviews the PR; when merged, the hub builds and deploys the new post
   for free (GitHub Pages + Cloudflare Pages).

Nothing lands on the hub's `main` directly — content is reviewed first.

## Set up your own copy

1. Copy this folder to your own repository.
2. In **your** repo, add a repository secret `<HUB_TOKEN_SECRET>` — a
   fine-grained PAT on the hub repo (`<HUB_REPO>`) with **Contents: write** and
   **Pull requests: write**.
3. In `sync-posts.yml`, replace `<HUB_REPO>` (and the secret name if you renamed
   it) with your hub's `owner/repo`.
4. Edit `posts/en/hello-from-my-repo.md` and push to `main`. A PR opens on the
   hub.

## Retiring content

Removing a file from `posts/` here does **not** delete it from the hub. To
retire a page, delete it here **and** list it in `sync-delete.list` (one path
per line). The workflow applies those deletions after the copy.
