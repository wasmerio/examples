// GENERATED from src/components/sections/AboutHero.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import about from '@/content/pages/about.json';

export default function AboutHero() {
  const { hero } = about;

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-title">
          <h1 className="t-h1 balance heading">{hero.title}</h1>
          <p className="t-body-m about-hero-description">{hero.description}</p>
        </div>
        <div className="about-hero-media">
          <div className="about-hero-photo">
            <img src={hero.photo.src} alt={hero.photo.alt} width={hero.photo.width} height={hero.photo.height} fetchPriority="high" />
          </div>
          <div className="trusted">
            <p className="t-eyebrow about-hero-label">{hero.trustedLabel}</p>
            <div className="logos" data-fx="logo-ticker" data-velocity="12">
              <ul className="logo-track" role="list">
                {hero.logos.map((l, index) => (
                  <li key={index} className="logo-item">
                    <div className="logo-box"><img src={l.src} alt={l.name} width="28" height="28" /></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
