// GENERATED from src/components/sections/AboutRules.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import about from '@/content/pages/about.json';

export default function AboutRules() {
  const { rules } = about;

  return (
    <>
      <section className="about-rules" id="about-rules" data-fx="rules-scroll">
        <div className="about-rules-stage" id="about-rules-stage">
          <div className="about-rules-title">
            <p className="t-eyebrow">{rules.eyebrow}</p>
            <h2 className="t-h2 balance">{rules.title}</h2>
          </div>
          <div className="about-rules-viewport" id="about-rules-viewport">
            <div className="about-rules-track" id="about-rules-track">
              {rules.items.map((r, index) => (
                <article key={index} className="about-rule">
                  <div className="copy">
                    <p className="t-eyebrow">{r.number}</p>
                    <p className="t-label text">{r.text}</p>
                  </div>
                  <div className="texture">
                    <img src={r.texture.src} alt={r.texture.alt} width={r.texture.width} height={r.texture.height} loading="lazy" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
