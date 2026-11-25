// GENERATED from src/components/sections/ContactTop.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import contact from '@/content/pages/contact.json';

export default function ContactTop() {
  return (
    <>
      <section className="contact-top">
        <div className="contact-top-row">
          <div className="contact-top-title">
            <p className="t-eyebrow">{contact.eyebrow}</p>
            <h1 className="t-h1 balance">{contact.title}</h1>
          </div>
          <div className="contact-top-description">
            <p className="t-body-m">{contact.blurb}</p>
          </div>
        </div>
      </section>
    </>
  );
}
