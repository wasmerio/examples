// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import rehypeMermaid from "rehype-mermaid";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeImageCaptions from "./src/plugins/rehype-image-captions.mjs";
import remarkExcerpt from "./src/plugins/remark-excerpt.mjs";
// https://astro.build/config
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkCustomHeaderId from 'remark-custom-header-id';

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
    },
    site: "https://blog.cloverta.top",
    trailingSlash: 'ignore',
    devToolbar: { enabled: false },
    redirects: {
        "/": "/zh/",
    },
    integrations: [sitemap()],
    markdown: {
        shikiConfig: {
            themes: { light: 'github-light', dark: 'github-dark' },
        },
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid', 'math'],
        },
        processor: unified({
            rehypePlugins: [rehypeImageCaptions, rehypeMermaid, rehypeKatex],
            remarkPlugins: [remarkMath, remarkExcerpt, remarkCustomHeaderId],
        }),
    },
})
