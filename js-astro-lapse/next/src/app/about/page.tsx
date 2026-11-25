// GENERATED from src/pages/about.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import Base from '@/layouts/Base';
import AboutHero from '@/components/sections/AboutHero';
import AboutStory from '@/components/sections/AboutStory';
import AboutRules from '@/components/sections/AboutRules';
import AboutTeam from '@/components/sections/AboutTeam';
import about from '@/content/pages/about.json';

export default function About() {
  return (
    <>
      <Base route="/about/" title={about.meta.title} description={about.meta.description}>
        <AboutHero />
        <AboutStory />
        <AboutRules />
        <AboutTeam />
      </Base>
    </>
  );
}
