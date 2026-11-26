FROM ghcr.io/pnpm/pnpm:11 AS build
ENV CI=true

RUN pnpm runtime set node 24 -g
WORKDIR /app

COPY package*.json ./
COPY pnpm*.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM nginx:alpine AS runtime
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
