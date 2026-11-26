<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SectionHeader from './SectionHeader.svelte';

  const { Story } = defineMeta({
    title: 'UI/SectionHeader',
    component: SectionHeader,
    parameters: {
      layout: 'fullscreen',
    },
  });
</script>

<Story
  name="Default"
  args={{
    title: 'PERSONAL LOG',
  }}
/>

<Story
  name="Laboratory"
  args={{
    title: 'LABORATORY',
  }}
/>
