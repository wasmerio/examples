// GENERATED from src/pages/index.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import Hero from '@/components/sections/Hero';
import WhatChanges from '@/components/sections/WhatChanges';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import HomePricing from '@/components/sections/HomePricing';
import Faq from '@/components/sections/Faq';
import HomeBlog from '@/components/sections/HomeBlog';
import home from '@/content/pages/home.json';

export default function Index() {
  return (
    <>
      <Base route="/" title={home.meta.title} description={home.meta.description}>
        <Hero />
        <WhatChanges />
        <HowItWorks />
        <HomePricing />
        <Testimonials />
        <Faq {...home.faq} cardWidth="320px" tabletContentWidth="100%" />
        <HomeBlog />
      </Base>
    </>
  );
}
