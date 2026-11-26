<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ArticleMeta from './ArticleMeta.svelte';

  const { Story } = defineMeta({
    title: 'UI/ArticleMeta',
    component: ArticleMeta,
    parameters: {
      layout: 'padded',
    },
  });
</script>

<Story
  name="Default"
  args={{
    label: 'SYSTEM.LOG.FIRST_POST',
    date: new Date('2024-07-12'),
    readTime: '15 MIN READ',
  }}
/>

<Story
  name="Highlight"
  args={{
    label: 'PROJECT',
    date: new Date('2024-08-01'),
    readTime: '8 MIN READ',
    variant: 'highlight',
  }}
/>

<Story
  name="NoDate"
  args={{
    label: 'Personal Node',
  }}
/>
