# Dev-only image. Production output is a plain static dist/ (no container needed).
FROM node:22-slim@sha256:e9f565d32859f0cbfb52125eafe8be39390f24dac302dc3cdf566e8ba3ab21ee

ENV CI=true \
    ASTRO_TELEMETRY_DISABLED=1 \
    COREPACK_HOME=/opt/corepack \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# git: the build reads git dates in the container, which runs as an arbitrary host UID.
RUN apt-get update \
 && apt-get install -y --no-install-recommends git \
 && rm -rf /var/lib/apt/lists/* \
 && git config --system --add safe.directory '*'

# corepack installs the pnpm version pinned by `packageManager` in package.json.
COPY package.json /tmp/pm/package.json
RUN corepack enable \
 && cd /tmp/pm \
 && corepack install \
 && chmod -R a+rwX /opt/corepack
