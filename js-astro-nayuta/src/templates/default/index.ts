import { defineTemplate } from '@templates/define';

export default defineTemplate({
  id: 'default',
  name: 'Reading page',
  description: 'A page title and authored reading content.',
  load: () => import('@templates/default/Template.astro'),
});
