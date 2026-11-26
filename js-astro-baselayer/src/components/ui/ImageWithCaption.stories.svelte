<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ImageWithCaption from './ImageWithCaption.svelte';

  const { Story } = defineMeta({
    title: 'UI/ImageWithCaption',
    component: ImageWithCaption,
    parameters: {
      layout: 'padded',
    },
  });
</script>

<Story
  name="WithCaption"
  args={{
    src: '/blog-placeholder-1.jpg',
    alt: 'Bento Grid visualization',
    caption: 'Fig. 1.0 — Spatial distribution of analytical modules',
  }}
/>

<Story
  name="NoCaption"
  args={{
    src: '/blog-placeholder-2.jpg',
    alt: 'Abstract data structure',
  }}
/>
