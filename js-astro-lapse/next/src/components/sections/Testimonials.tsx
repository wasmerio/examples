// GENERATED from src/components/sections/Testimonials.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import home from '@/content/pages/home.json';
import Icon from '@/components/ui/Icon';

export default function Testimonials() {
  const { testimonials } = home;
  const [first, second] = testimonials.title.split('\n');

  return (
    <>
      <section className="testimonials">
        <div className="testimonials-panel">
          <div className="waves" data-fx="flow-lines" aria-hidden="true"></div>
          <div className="testimonials-title"><h2 className="t-h2 balance">{first}<br />{second}</h2></div>
          <div className="rolling" data-fx="ticker">
            <div className="ticker-track">
              {testimonials.quotes.map((q, index) => (
                <figure key={index} className={cx(['testimonials-quote', { compact: q.compact }])}>
                  {q.icon && <Icon name="quote" size={24} className="quote-icon" />}
                  <blockquote>{q.compact ? <p className="t-h5">{q.quote}</p> : <h3 className="t-h5">{q.quote}</h3>}</blockquote>
                  <figcaption className="author">
                    <p className="t-label testimonials-name">{q.name}</p>
                    <p className="t-eyebrow role">{q.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
