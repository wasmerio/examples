// GENERATED from src/pages/terms.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import LegalPage from '@/components/sections/LegalPage';
import content from '@/content/pages/terms.json';

export default function Terms() {
  return (
    <>
      <Base route="/terms/" title={content.meta.title} description={content.meta.description}>
        <LegalPage content={content} />
      </Base>
    </>
  );
}
