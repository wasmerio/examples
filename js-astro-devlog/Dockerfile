# ==============================================================================
# 🐳 STAGE 1: Build Static Astro Site & Search Index
# ==============================================================================
FROM node:26-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full application source code
COPY . .

# Build static output and compile Pagefind static search index
RUN npm run build

# ==============================================================================
# 🚀 STAGE 2: High-Performance Lightweight Nginx Web Server
# ==============================================================================
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration with 404 routing & caching headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static site from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
