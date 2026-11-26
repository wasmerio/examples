<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Hero from './Hero.svelte';
  import Canvas3D from './Canvas3D.svelte';

  const { Story } = defineMeta({
    title: 'Sections/Hero',
    component: Hero,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story name="Default" />

<Story
  name="Custom Text"
  args={{
    subtitle: 'Developer :: Portfolio',
    heading: 'Crafting',
    headingItalic: 'elegant interfaces',
    headingHighlight: 'that matter',
    description: 'A passionate developer focused on clean code and beautiful design.',
  }}
/>

<Story name="Without Canvas" args={{ showCanvas: false }} />