// GENERATED from src/components/Nav.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import site from '@/content/site.json';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function Nav() {
  const { nav } = site;

  return (
    <>
      <div className="topbar" data-fx="nav">
        <nav className="nav" aria-label="Main">
          <div className="bar">
            <div className="capsule">
              <a className="t-logo logo" href="/">{site.brand}</a>
              <div className="links desktop-only">
                {nav.links.map((l, index) => <a key={index} className="t-body-m link" href={l.href}>{l.label}</a>)}
              </div>
              <button className="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu" tabIndex={-1}>
                <Icon name="dots-nine" className="i-open" />
                <Icon name="x" className="i-close" />
              </button>
            </div>
            <div className="buttons desktop-only">
              <Button href={nav.login.href} variant="ghost">{nav.login.label}</Button>
              <Button href={nav.demo.href}>{nav.demo.label}</Button>
            </div>
          </div>
          <div className="menu below-desktop" id="nav-menu">
            <div className="menu-links">
              {nav.links.map((l, index) => <a key={index} className="t-body-m menu-link" href={l.href}>{l.label}</a>)}
            </div>
            <div><Button href={nav.demo.href}>{nav.demo.label}</Button></div>
          </div>
        </nav>
      </div>
    </>
  );
}
