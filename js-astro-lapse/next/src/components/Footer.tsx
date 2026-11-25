// GENERATED from src/components/Footer.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import site from '@/content/site.json';
import Button from '@/components/ui/Button';

export default function Footer() {
  const { cta, footer } = site;

  return (
    <>
      <section className="cta" id="cta">
        <div className="cta-stage">
          <div className="particles" data-fx="particle-field" data-src={cta.image} role="img" aria-label={cta.imageAlt}></div>
        </div>
        <div className="cta-row">
          <h2 className="t-h2 cta-heading"><span className="cta-muted">{cta.headingMuted}</span>{cta.heading}</h2>
          <div className="cta-side">
            <p className="t-body-m">{cta.description}</p>
            <Button href={cta.button.href}>{cta.button.label}</Button>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-rule"></div>
        <div className="main">
          <a className="t-logo wordmark" href="/">{site.brand}</a>
          <div className="columns">
            {footer.columns.map((col, index) => (
              <div key={index} className="col">
                <p className="t-body-s col-label">{col.label}</p>
                {col.links.map((l, index) => (
                  <p key={index} className="t-body-s"><a className="col-link" href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{l.label}</a></p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <p className="t-body-s">{footer.copyright}</p>
          <p className="t-body-s">{footer.note}</p>
        </div>
      </footer>
    </>
  );
}
