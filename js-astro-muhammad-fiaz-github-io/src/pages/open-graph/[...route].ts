import { OGImageRoute } from 'astro-og-canvas';
import { siteConfig } from '@/site.config';
import { getCollection } from 'astro:content';

const blogPosts = await getCollection('blog');
const blogPages = blogPosts.reduce((acc, post) => {
  acc[`blog/${post.id}`] = {
    title: post.data.title,
    description: post.data.description,
  };
  return acc;
}, {} as Record<string, { title: string; description: string }>);

const route = await OGImageRoute({
  param: 'route',
  pages: {
    'index': {
      title: siteConfig.name,
      description: siteConfig.description,
    },
    'projects': {
      title: 'Projects',
      description: 'Showcase of my latest works and open source contributions.',
    },
    'works': {
      title: 'Experience',
      description: 'My professional journey and work history.',
    },
    ...blogPages,
  },
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/favicon.svg',
    },
    bgGradient: [[10, 10, 10]],
    border: { color: [60, 60, 60], width: 20 },
    padding: 60,
    font: {
      title: { size: 80, color: [255, 255, 255], weight: 'Bold' },
      description: { size: 40, color: [200, 200, 200] },
    },
  }),
});

export function getStaticPaths() {
  return route.getStaticPaths();
}
export const GET = route.GET;
