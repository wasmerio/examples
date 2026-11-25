// GENERATED from src/pages/contact.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import ContactTop from '@/components/sections/ContactTop';
import GetInTouch from '@/components/sections/GetInTouch';
import contact from '@/content/pages/contact.json';

export default function Contact() {
  return (
    <>
      <Base route="/contact/" title={contact.meta.title} description={contact.meta.description}>
        <ContactTop />
        <GetInTouch />
      </Base>
    </>
  );
}
