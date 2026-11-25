// GENERATED from src/components/sections/HomePricing.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import home from '@/content/pages/home.json';
import Plans from '@/components/sections/Plans';

export default function HomePricing() {
  const { pricing } = home;

  return (
    <>
      <section className="pricing" id="pricing">
        <div className="home-pricing-title">
          <p className="t-eyebrow">{pricing.eyebrow}</p>
          <h2 className="t-h2 balance">{pricing.title}</h2>
        </div>
        <Plans nameTag="h3" />
      </section>
    </>
  );
}
