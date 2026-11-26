import { toast } from './store';

/** Plain text of an Expressive Code block (one `.ec-line` per source line). */
function codeText(block: HTMLElement) {
  const lines = block.querySelectorAll<HTMLElement>('.ec-line .code');
  if (lines.length) return [...lines].map((l) => l.textContent ?? '').join('\n');
  return block.querySelector('pre')?.textContent ?? '';
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // http / old browsers
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function button(cls: string, label: string, pressed?: boolean) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.title = label;
  b.setAttribute('aria-label', label);
  if (pressed !== undefined) b.setAttribute('aria-pressed', String(pressed));
  return b;
}

/**
 * Butterfly-style tools for every code block: copy + collapse in the mac
 * header, and a floating toggle for long blocks (collapsed at build time).
 * Runs on every page load; idempotent.
 */
export function initCodeBlocks() {
  document.querySelectorAll<HTMLElement>('.article-container .expressive-code:not([data-ready])').forEach((block) => {
    block.dataset.ready = '';
    const header = block.querySelector<HTMLElement>('.frame .header');
    const pre = block.querySelector('pre');
    if (!header || !pre) return;

    const actions = document.createElement('div');
    actions.className = 'code-actions';
    const copyBtn = button('code-copy', '复制代码');
    const foldBtn = button('code-fold', '折叠代码', false);
    actions.append(copyBtn, foldBtn);
    header.append(actions);

    copyBtn.addEventListener('click', async () => {
      await copy(codeText(block));
      copyBtn.classList.add('is-copied');
      toast('复制成功');
      setTimeout(() => copyBtn.classList.remove('is-copied'), 1500);
    });
    foldBtn.addEventListener('click', () => {
      const folded = block.classList.toggle('is-folded');
      foldBtn.setAttribute('aria-pressed', String(folded));
      foldBtn.title = folded ? '展开代码' : '折叠代码';
    });

    // Long blocks arrive collapsed from the build (ec.config.mjs): nothing here
    // reads layout, and the button overlays the block without changing its height.
    if (block.classList.contains('has-expand')) {
      const expand = button('code-expand', '展开代码');
      const icon = document.createElement('span');
      icon.className = 'code-expand-icon';
      icon.setAttribute('aria-hidden', 'true');
      expand.append(icon);
      expand.setAttribute('aria-expanded', 'false');
      expand.addEventListener('click', () => {
        const limited = block.classList.toggle('is-limited');
        expand.setAttribute('aria-expanded', String(!limited));
        expand.title = limited ? '展开代码' : '收起代码';
        expand.setAttribute('aria-label', expand.title);
        // Reopening starts with the source's left edge, rather than a hidden horizontal offset.
        if (limited) {
          pre.scrollLeft = 0;
          pre.scrollTop = 0;
        }
        // collapsing a long block: keep its top in view
        if (limited && block.getBoundingClientRect().top < 0) block.scrollIntoView({ block: 'start' });
      });
      block.append(expand);
    }
  });
}
