---
layout: ../../layouts/post.astro
title: Set Up an Unlimited Docker Registry Mirror with Cloudflare Snippets
description: Deploy a high-efficiency Docker registry mirror on Cloudflare Snippets with zero bandwidth billing, supporting Docker Hub, GHCR, Quay, and more.
dateFormatted: Dec 21, 2024
---

Using Cloudflare Workers to mirror Docker images is fine for personal use with small request volumes. But if you open it to the public, the sheer request volume can get pricey fast.

Cloudflare actually has an even lighter JS runtime: **Cloudflare Snippets**. It comes with strict limits—5 ms CPU execution time, 2 MB max memory, and 32 KB code size. But for rewriting and proxying requests, that is plenty.

Unfortunately, Snippets is not yet rolled out to the Free plan, though [Cloudflare's announcement post mentions that Free plans will eventually get 5 Snippets](https://blog.cloudflare.com/zh-cn/snippets-announcement/).

If you have a Pro plan, you can tweak the existing Cloudflare Workers proxy code and get it running right away. It supports Docker Hub, Google Container Registry, GitHub Container Registry, Amazon ECR, Kubernetes Container Registry, Quay, and Cloudsmith.

Here is the updated code:

```js
// Original code: https://github.com/ciiiii/cloudflare-docker-proxy/blob/master/src/index.js

const CUSTOM_DOMAIN = 'your.domains'
const MODE = 'production'

const dockerHub = 'https://registry-1.docker.io'

const routes = {
  // production
  [`docker.${CUSTOM_DOMAIN}`]: dockerHub,
  [`quay.${CUSTOM_DOMAIN}`]: 'https://quay.io',
  [`gcr.${CUSTOM_DOMAIN}`]: 'https://gcr.io',
  [`k8s-gcr.${CUSTOM_DOMAIN}`]: 'https://k8s.gcr.io',
  [`k8s.${CUSTOM_DOMAIN}`]: 'https://registry.k8s.io',
  [`ghcr.${CUSTOM_DOMAIN}`]: 'https://ghcr.io',
  [`cloudsmith.${CUSTOM_DOMAIN}`]: 'https://docker.cloudsmith.io',
  [`ecr.${CUSTOM_DOMAIN}`]: 'https://public.ecr.aws',

  // staging
  [`docker-staging.${CUSTOM_DOMAIN}`]: dockerHub,
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const upstream = routeByHosts(url.hostname)
  if (upstream === '') {
    return new Response(
      JSON.stringify({
        routes,
      }),
      {
        status: 404,
      },
    )
  }
  const isDockerHub = upstream === dockerHub
  const authorization = request.headers.get('Authorization')
  if (url.pathname === '/v2/') {
    const newUrl = new URL(`${upstream}/v2/`)
    const headers = new Headers()
    if (authorization) {
      headers.set('Authorization', authorization)
    }
    // check if need to authenticate
    const resp = await fetch(newUrl.toString(), {
      method: 'GET',
      headers,
      redirect: 'follow',
    })
    if (resp.status === 401) {
      return responseUnauthorized(url)
    }
    return resp
  }
  // get token
  if (url.pathname === '/v2/auth') {
    const newUrl = new URL(`${upstream}/v2/`)
    const resp = await fetch(newUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
    })
    if (resp.status !== 401) {
      return resp
    }
    const authenticateStr = resp.headers.get('WWW-Authenticate')
    if (authenticateStr === null) {
      return resp
    }
    const wwwAuthenticate = parseAuthenticate(authenticateStr)
    let scope = url.searchParams.get('scope')
    // autocomplete repo part into scope for DockerHub library images
    // Example: repository:busybox:pull => repository:library/busybox:pull
    if (scope && isDockerHub) {
      const scopeParts = scope.split(':')
      if (scopeParts.length === 3 && !scopeParts[1].includes('/')) {
        scopeParts[1] = `library/${scopeParts[1]}`
        scope = scopeParts.join(':')
      }
    }
    return await fetchToken(wwwAuthenticate, scope, authorization)
  }
  // redirect for DockerHub library images
  // Example: /v2/busybox/manifests/latest => /v2/library/busybox/manifests/latest
  if (isDockerHub) {
    const pathParts = url.pathname.split('/')
    if (pathParts.length === 5) {
      pathParts.splice(2, 0, 'library')
      const redirectUrl = new URL(url)
      redirectUrl.pathname = pathParts.join('/')
      return Response.redirect(redirectUrl, 301)
    }
  }
  // foward requests
  const newUrl = new URL(upstream + url.pathname)
  const newReq = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  })
  const resp = await fetch(newReq)
  if (resp.status === 401) {
    return responseUnauthorized(url)
  }
  return resp
}

function routeByHosts(host) {
  if (host in routes) {
    return routes[host]
  }
  if (MODE === 'debug') {
    return dockerHub
  }
  return ''
}

function parseAuthenticate(authenticateStr) {
  // sample: Bearer realm="https://auth.ipv6.docker.com/token",service="registry.docker.io"
  // match strings after =" and before "
  const re = /(?<==")(?:\\.|[^"\\])*(?=")/g
  const matches = authenticateStr.match(re)
  if (matches == null || matches.length < 2) {
    throw new Error(`invalid Www-Authenticate Header: ${authenticateStr}`)
  }
  return {
    realm: matches[0],
    service: matches[1],
  }
}

async function fetchToken(wwwAuthenticate, scope, authorization) {
  const url = new URL(wwwAuthenticate.realm)
  if (wwwAuthenticate.service.length) {
    url.searchParams.set('service', wwwAuthenticate.service)
  }
  if (scope) {
    url.searchParams.set('scope', scope)
  }
  const headers = new Headers()
  if (authorization) {
    headers.set('Authorization', authorization)
  }
  return await fetch(url, {
    method: 'GET',
    headers
  })
}

function responseUnauthorized(url) {
  const headers = new (Headers)()
  if (MODE === 'debug') {
    headers.set(
      'Www-Authenticate',
      `Bearer realm="http://${url.host}/v2/auth",service="cloudflare-docker-proxy"`,
    )
  }
  else {
    headers.set(
      'Www-Authenticate',
      `Bearer realm="https://${url.hostname}/v2/auth",service="cloudflare-docker-proxy"`,
    )
  }
  return new Response(JSON.stringify({
    message: 'UNAUTHORIZED'
  }), {
    status: 401,
    headers,
  })
}

export default {
  fetch: handleRequest,
}
```
