---
layout: ../../layouts/post.astro
title: Minimal Docker Image Packaging for Vite SSR Projects
description: How I shrunk a Vite SSR Docker image from 1.06GB down to 135MB using multi-stage builds and dependency inlining.
dateFormatted: Aug 31, 2024
---

I was getting ready to move a few projects hosted on Cloudflare, Vercel, and Netlify over to my own VPS running Docker, so I brushed up on container packaging. But when a tiny project built into a 1.05 GB image, that was obviously not going to fly. So I dug into minimal Docker packaging for Node.js projects, cutting the image size from 1.06 GB down to 135 MB.

The demo app is an Astro project using Vite as the build tool, running in SSR mode.

## Version 0: Base Alpine Image

> The idea: Start with a minimal base image, using Alpine Linux.

Following the [Astro SSR Docker documentation](https://docs.astro.build/en/recipes/docker/#ssr), I used `node:lts-alpine` as the base image and PNPM as the package manager. The resulting image came out to 1.06 GB—the worst-case baseline.

```dockerfile
FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN export $(cat .env.example) && pnpm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
```

```log
docker build -t v0 .
[+] Building 113.8s (11/11) FINISHED                                                                                                                                        docker:orbstack
 => [internal] load build definition from Dockerfile                                                                                                                                   0.0s
 => => transferring dockerfile: 346B                                                                                                                                                   0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                                                     1.1s
 => [internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 89B                                                                                                                                                       0.0s
 => [1/6] FROM docker.io/library/node:lts-alpine@sha256:1a526b97cace6b4006256570efa1a29cd1fe4b96a5301f8d48e87c5139438a45                                                               0.0s
 => [internal] load build context                                                                                                                                                      0.2s
 => => transferring context: 240.11kB                                                                                                                                                  0.2s
 => CACHED [2/6] RUN corepack enable                                                                                                                                                   0.0s
 => CACHED [3/6] WORKDIR /app                                                                                                                                                          0.0s
 => [4/6] COPY . .                                                                                                                                                                     2.0s
 => [5/6] RUN pnpm install --frozen-lockfile                                                                                                                                          85.7s
 => [6/6] RUN export $(cat .env.example) && pnpm run build                                                                                                                            11.1s
 => exporting to image                                                                                                                                                                13.4s
 => => exporting layers                                                                                                                                                               13.4s
 => => writing image sha256:653236defcbb8d99d83dc550f1deb55e48b49d7925a295049806ebac8c104d4a                                                                                           0.0s
 => => naming to docker.io/library/v0
```

## Version 1: Multi-Stage Build

> The idea: Install prod dependencies in one stage, build full bundles in another, and copy only production `node_modules` and compiled code into the final image.

Following Astro's [multi-stage SSR build recipe](https://docs.astro.build/en/recipes/docker/#multi-stage-build-using-ssr) brought the image down to 306 MB. A solid improvement, but it has one big catch: **you have to explicitly track production dependencies. If you miss one, it blows up at runtime**.

```dockerfile
FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build-deps AS build
COPY . .
RUN export $(cat .env.example) && pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
```

```log
docker build -t v1 .
[+] Building 85.5s (15/15) FINISHED                                                                                                                                         docker:orbstack
 => [internal] load build definition from Dockerfile                                                                                                                                   0.1s
 => => transferring dockerfile: 680B                                                                                                                                                   0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                                                     1.8s
 => [internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 89B                                                                                                                                                       0.0s
 => [base 1/4] FROM docker.io/library/node:lts-alpine@sha256:1a526b97cace6b4006256570efa1a29cd1fe4b96a5301f8d48e87c5139438a45                                                          0.0s
 => [internal] load build context                                                                                                                                                      0.3s
 => => transferring context: 240.44kB                                                                                                                                                  0.2s
 => CACHED [base 2/4] RUN corepack enable                                                                                                                                              0.0s
 => CACHED [base 3/4] WORKDIR /app                                                                                                                                                     0.0s
 => [base 4/4] COPY package.json pnpm-lock.yaml ./                                                                                                                                     0.2s
 => [prod-deps 1/1] RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile                                                                           35.1s
 => [build-deps 1/1] RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile                                                                                 65.5s
 => [runtime 1/2] COPY --from=prod-deps /app/node_modules ./node_modules                                                                                                               5.9s
 => [build 1/2] COPY . .                                                                                                                                                               0.8s
 => [build 2/2] RUN export $(cat .env.example) && pnpm run build                                                                                                                       7.5s
 => [runtime 2/2] COPY --from=build /app/dist ./dist                                                                                                                                   0.1s
 => exporting to image                                                                                                                                                                 4.2s
 => => exporting layers                                                                                                                                                                4.1s
 => => writing image sha256:8ae6b2bddf0a7ac5f8ad45e6abb7d36a633e384cf476e45fb9132bdf70ed0c5f                                                                                           0.0s
 => => naming to docker.io/library/v1
```

## Version 2: Inlining Dependencies

> The idea: Bundle and inline `node_modules` directly into the JavaScript output, so you do not need `node_modules` in the production container at all.

When working with Next.js previously, I remembered it could inline `node_modules` into the server output so you don't have to ship them. I checked whether Vite SSR could do the same, and it turns out it does! When building for Docker, we enable inlining, skip copying `node_modules`, and only ship `dist`. That dropped the image down to **135 MB**.

Configuration change in Vite/Astro config:

```js
vite: {
  ssr: {
    noExternal: process.env.DOCKER ? !!process.env.DOCKER : undefined
  }
}
```

**The final Dockerfile**:

```dockerfile
FROM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# FROM base AS prod-deps
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build-deps AS build
COPY . .
RUN export $(cat .env.example) && export DOCKER=true && pnpm run build

FROM base AS runtime
# COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
```

```log
 docker build -t v2 .
[+] Building 24.9s (13/13) FINISHED                                                                                                                                         docker:orbstack
 => [internal] load build definition from Dockerfile                                                                                                                                   0.0s
 => => transferring dockerfile: 708B                                                                                                                                                   0.0s
 => [internal] load metadata for docker.io/library/node:lts-alpine                                                                                                                     1.7s
 => [internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 89B                                                                                                                                                       0.0s
 => [base 1/4] FROM docker.io/library/node:lts-alpine@sha256:1a526b97cace6b4006256570efa1a29cd1fe4b96a5301f8d48e87c5139438a45                                                          0.0s
 => [internal] load build context                                                                                                                                                      0.3s
 => => transferring context: 240.47kB                                                                                                                                                  0.2s
 => CACHED [base 2/4] RUN corepack enable                                                                                                                                              0.0s
 => CACHED [base 3/4] WORKDIR /app                                                                                                                                                     0.0s
 => CACHED [base 4/4] COPY package.json pnpm-lock.yaml ./                                                                                                                              0.0s
 => CACHED [build-deps 1/1] RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile                                                                           0.0s
 => [build 1/2] COPY . .                                                                                                                                                               1.5s
 => [build 2/2] RUN export $(cat .env.example) && export DOCKER=true && pnpm run build                                                                                                15.0s
 => [runtime 1/1] COPY --from=build /app/dist ./dist                                                                                                                                   0.1s
 => exporting to image                                                                                                                                                                 0.1s
 => => exporting layers                                                                                                                                                                0.1s
 => => writing image sha256:0ed5c10162d1faf4208f5ea999fbcd133374acc0e682404c8b05220b38fd1eaf                                                                                           0.0s
 => => naming to docker.io/library/v2
```

## Results

Image size dropped from 1.06 GB to 135 MB, and build duration dropped from 113.8 s to 24.9 s:

```log
docker images
REPOSITORY                         TAG         IMAGE ID       CREATED          SIZE
v2                                 latest      0ed5c10162d1   5 minutes ago    135MB
v1                                 latest      8ae6b2bddf0a   6 minutes ago    306MB
v0                                 latest      653236defcbb   11 minutes ago   1.06GB
```

The sample project is open-source on [GitHub](https://github.com/miantiao-me/BroadcastChannel/pkgs/container/broadcastchannel).

[![BroadcastChannel](https://github.html.zone/miantiao-me/BroadcastChannel)](https://github.com/miantiao-me/BroadcastChannel)
