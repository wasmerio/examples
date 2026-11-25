// GENERATED from src/pages/pricing.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import Plans from '@/components/sections/Plans';
import ComparePlans from '@/components/sections/ComparePlans';
import Faq from '@/components/sections/Faq';
import page from '@/content/pages/pricing.json';

export default function Pricing() {
  const { meta, top, faq } = page;

  return (
    <>
      <Base route="/pricing/" title={meta.title} description={meta.description} image={meta.image}>
        <section className="pricing-top">
          <div className="pricing-title">
            <p className="t-eyebrow">{top.eyebrow}</p>
            <h1 className="t-h1 balance">{top.title}</h1>
            <p className="t-body-m balance pricing-description">{top.description}</p>
          </div>
        </section>
        <section className="plans-section" id="plans">
          <Plans />
        </section>
        <ComparePlans />
        <Faq eyebrow={faq.eyebrow} title={faq.title} card={faq.card} items={faq.items} />
      </Base>
    </>
  );
}
