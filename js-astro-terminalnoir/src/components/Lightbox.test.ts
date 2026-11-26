import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Lightbox from './Lightbox.astro';

async function render() {
  const container = await AstroContainer.create();
  return container.renderToString(Lightbox, {
    props: {
      id: 'shot-example',
      image: '/images/example.svg',
      alt: 'Example screenshot',
      openLabel: 'Open',
      closeLabel: 'Close',
    },
  });
}

describe('Lightbox', () => {
  it('opens a popover from a labelled button around the preview', async () => {
    const html = await render();

    expect(html).toMatch(/<button[^>]*popovertarget="shot-example"[^>]*>/);
    expect(html).toMatch(/<button[^>]*aria-label="Open"/);
    expect(html).toMatch(/<div[^>]*id="shot-example"[^>]*popover/);
  });

  it('shows the full image with its alt text and a close button', async () => {
    const html = await render();
    const dialog = html.slice(html.indexOf('id="shot-example"'));

    expect(dialog).toContain('alt="Example screenshot"');
    expect(dialog).toMatch(/popovertargetaction="hide"/);
    expect(dialog).toMatch(/aria-label="Close"/);
  });
});
