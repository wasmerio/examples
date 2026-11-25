// GENERATED from src/components/sections/Hero.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import home from '@/content/pages/home.json';
import Button from '@/components/ui/Button';

export default function Hero() {
  const { hero } = home;
  const sized = (src: string, w: number) => src.replace(/\.webp$/, `-${w}.webp`);
  const bgSet = `${sized(hero.background, 800)} 800w, ${sized(hero.background, 1400)} 1400w, ${hero.background} 2400w`;
  const shotSet = `${sized(hero.screenshot, 800)} 800w, ${hero.screenshot} 1497w`;

  return (
    <>
      <section className="hero">
        <div className="hero-top">
          <div className="hero-title">
            <p className="t-eyebrow">{hero.eyebrow}</p>
            <h1 className="t-h1 balance">{hero.title}<span className="hero-muted">{hero.titleMuted}</span></h1>
          </div>
          <div className="side">
            <p className="t-body-m">{hero.description}</p>
            <Button href={hero.button.href}>{hero.button.label}</Button>
          </div>
        </div>
        <div className="hero-media">
          <div className="product">
            <img className="bg" src={hero.background} srcSet={bgSet} sizes="(max-width: 1199.98px) calc(100vw - 40px), 1160px" alt={hero.backgroundAlt} width="2400" height="1528" fetchPriority="high" />
            <img className="shot" src={hero.screenshot} srcSet={shotSet} sizes="(max-width: 1199.98px) calc(89vw - 36px), 1034px" alt={hero.screenshotAlt} width="1497" height="1024" fetchPriority="high" />
          </div>
          <div className="stats">
            {hero.stats.map((s, index) => (
              <div key={index} className="stat">
                <p className="t-num">{s.value}</p>
                <p className="t-eyebrow">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
