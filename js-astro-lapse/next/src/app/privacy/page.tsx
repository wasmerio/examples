// GENERATED from src/pages/privacy.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import LegalPage from '@/components/sections/LegalPage';
import content from '@/content/pages/privacy.json';

export default function Privacy() {
  return (
    <>
      <Base route="/privacy/" title={content.meta.title} description={content.meta.description}>
        <LegalPage content={content} />
      </Base>
    </>
  );
}
