// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321/',
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: page => !page.includes('/admin/') && !page.includes('/private/'),
      customPages: [],
      serialize(item) {
        // Homepage - highest priority
        if (item.url.endsWith('/') && item.url.split('/').filter(Boolean).length === 0) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 1.0
        }

        // Blog listing pages - high priority
        else if (item.url.includes('/blog') && !item.url.includes('/blog/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'daily'
          item.priority = 0.9
        }

        // Individual blog posts - medium-high priority
        else if (item.url.includes('/blog/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.8
        }

        // Tag/category pages - medium priority
        else if (item.url.includes('/tags/') || item.url.includes('/categories/')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.7
        }

        // Static pages - medium-low priority
        else if (item.url.includes('/login') || item.url.includes('/register')) {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'monthly'
          item.priority = 0.5
        }

        // All other pages
        else {
          // @ts-expect-error - Valid sitemap changefreq value
          item.changefreq = 'weekly'
          item.priority = 0.6
        }

        return item
      }
    })
  ],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'esbuild'
    },
    ssr: {
      noExternal: ['@radix-ui/*']
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
})
