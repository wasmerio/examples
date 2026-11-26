<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Card from './Card.svelte';

  const { Story } = defineMeta({
    title: 'UI/Card',
    component: Card,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story
  name="Default"
  args={{
    href: '/blog/post',
    date: 'JUL 12, 2024',
    title: 'Bento Grids & Information Density',
    description: 'A technical deep dive into modular grid systems and the psychology of structural containment in UI.',
  }}
/>

<Story
  name="Long Title"
  args={{
    href: '/blog/post',
    date: 'AUG 03, 2024',
    title: 'The Complete Guide to Astro Islands Architecture and Partial Hydration in Modern Jamstack Applications',
    description: 'Exploring how island architecture enables faster page loads while maintaining interactivity where it matters most.',
  }}
/>

<Story
  name="With Image"
  args={{
    href: '/blog/post',
    date: 'OCT 05, 2024',
    title: 'The Art of Visual Storytelling',
    description: 'How images transform narrative structure and user engagement in digital media.',
    image: '/blog-placeholder-1.jpg',
  }}
/>

<Story
  name="With Tags"
  args={{
    href: '/lab/project',
    title: 'Vertex OS',
    description: 'A proprietary operating system framework for real-time asset monitoring and environmental control.',
    image: '/blog-placeholder-1.jpg',
    tags: ['Rust', 'WASM', 'ThreeJS'],
  }}
/>
