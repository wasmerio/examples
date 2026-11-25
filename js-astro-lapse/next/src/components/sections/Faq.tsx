// GENERATED from src/components/sections/Faq.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { cx } from '@/lib/cx';
import { sx } from '@/lib/sx';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

interface Props {
  eyebrow: string;
  title: string;
  card: { title: string; text: string; button: { href: string; label: string } };
  items: { q: string; a: string }[];
  id?: string;
  className?: string;
  cardWidth?: string;
  tabletContentWidth?: string;
}

export default function Faq({ eyebrow, title, card, items, id = 'faq', className: cls, cardWidth = '319px', tabletContentWidth = '589px' }: Props) {
  return (
    <>
      <section className={cx(['faq', cls])} id={id} style={sx(`--faq-card-w: ${cardWidth}; --faq-card-content-w-tablet: ${tabletContentWidth};`)}>
        <div className="intro">
          <div className="faq-title">
            <p className="t-eyebrow">{eyebrow}</p>
            <h2 className="t-h2 balance">{title}</h2>
          </div>
          <div className="ask">
            <div className="ask-content">
              <h3 className="t-h4">{card.title}</h3>
              <p className="t-body-m ask-text">{card.text}</p>
            </div>
            <Button href={card.button.href}>{card.button.label}</Button>
          </div>
        </div>
        <div className="list" data-fx="faq">
          {items.map((item, index) => (
            <details key={index} className="item">
              <summary className="faq-head">
                <h3 className="q t-h5">{item.q}</h3>
                <span className="faq-toggle" aria-hidden="true">
                  <span className="toggle-glow-wrap"><span className="toggle-glow"></span></span>
                  <span className="toggle-surface"></span>
                  <Icon name="plus" size={16} className="toggle-icon" />
                </span>
              </summary>
              <div className="answer">
                <p className="t-body-m">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
