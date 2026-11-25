// GENERATED from src/pages/404.astro by tools/astro-to-next.mjs. Edit the Astro file, then regenerate.
import { sx } from '@/lib/sx';
import Base from '@/layouts/Base';
import Nav from '@/components/Nav';
import Button from '@/components/ui/Button';
import page from '@/content/pages/404.json';

export default function NotFound() {
  const { shards } = page;

  return (
    <>
      <Base route="/404/" title={page.meta.title} description={page.meta.description} bare noindex>
        <div className="not-found-page">
          <Nav />
          <section className="not-found">
            <div
              className="shards"
              style={sx(`background-color: ${shards.flatBackground}`)}
              data-fx="shard-field"
              aria-hidden="true"
            ></div>
            <div className="content">
              <p className="t-eyebrow">{page.eyebrow}</p>
              <h1 className="t-h1 balance">{page.title}</h1>
              <p className="t-body-m balance not-found-body">{page.body}</p>
              <Button href={page.button.href} className="home-btn">{page.button.label}</Button>
            </div>
          </section>
        </div>
      </Base>
    </>
  );
}
