// GENERATED from src/components/sections/HowItWorks.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { sx } from '@/lib/sx';
import home from '@/content/pages/home.json';

export default function HowItWorks() {
  const { how } = home;

  return (
    <>
      <section className="how" id="how-it-works" data-fx="step-scroll">
        <div className="how-stage">
          <div className="how-title">
            <p className="t-eyebrow">{how.eyebrow}</p>
            <h2 className="t-h2 balance">{how.title}</h2>
            <p className="t-body-m">{how.body}</p>
          </div>
          <div className="box no-phone">
            <div className="slides">
              {how.steps.map((s, i) => (
                <div key={i} className="how-card slide" data-step={i} style={sx(i ? 'opacity:0' : undefined)}>
                  <img className="img" src={s.image} alt={s.imageAlt} width="1000" height="1000" loading="lazy" />
                  <div className="how-body"><h3 className="t-h4">{s.title}</h3><p className="t-body-m how-desc">{s.description}</p></div>
                </div>
              ))}
            </div>
            <ol className="numbers" aria-hidden="true">
              {how.steps.map((_, i) => (
                <li key={i} className="how-num">
                  <span className="t-h4 idle">{i + 1}</span>
                  <span className="t-h4 active" data-step={i} style={sx(i ? 'opacity:0' : undefined)}>{i + 1}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="stacked phone-only">
            {how.steps.map((s, index) => (
              <div key={index} className="stacked-card">
                <div className="how-card">
                  <img className="img" src={s.image} alt={s.imageAlt} width="1000" height="1000" loading="lazy" />
                  <div className="how-body"><h3 className="t-h4">{s.title}</h3><p className="t-body-m how-desc">{s.description}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
