import { describe, expect, it } from 'vitest';
import { migrate, remainingTags } from '../../scripts/migrate-tags.mjs';

const run = (body: string) => migrate(`---\ntitle: t\n---\n${body}`).split('---\n').slice(2).join('---\n');

describe('migrate-tags codemod', () => {
  it('turns notes into GitHub alerts by colour', () => {
    expect(run('{% note info flat %}\nhello\n{% endnote %}\n')).toBe('> [!NOTE]\n> hello\n');
    expect(run('{% note warning %}\na\n\nb\n{% endnote %}\n')).toBe('> [!WARNING]\n> a\n>\n> b\n');
    expect(run('{% note danger %}x{% endnote %}\n')).toContain('[!CAUTION]');
    expect(run('{% note primary flat%}x{% endnote %}\n')).toContain('[!IMPORTANT]');
    expect(run('{% note success flat %}x{% endnote %}\n')).toContain('[!TIP]');
  });

  it('preserves custom note icons, colours, styles and stylesheet precedence', () => {
    expect(run("{% note orange 'fas fa-battery-half' flat %}x{% endnote %}\n"))
      .toBe(':::note{.orange .flat icon="fas fa-battery-half"}\nx\n:::\n');
    expect(run('{% note info success %}x{% endnote %}\n')).toBe('> [!TIP]\n> x\n');
    expect(run('{% note default %}x{% endnote %}\n')).toBe(':::note{.default}\nx\n:::\n');
    expect(run('{% note info modern no-icon %}x{% endnote %}\n'))
      .toBe(':::note{.info .modern .no-icon}\nx\n:::\n');
  });

  it('keeps list indentation for nested blocks with code fences', () => {
    const src = '1. item\n\n   {% note warning %}\n   text\n\n   ```js\n   let a = 1;\n   ```\n   {% endnote %}\n';
    expect(run(src)).toBe('1. item\n\n   > [!WARNING]\n   > text\n   >\n   > ```js\n   > let a = 1;\n   > ```\n');
  });

  it('converts tips, folding (with open) and inline tags', () => {
    expect(run('{% tip home %}hi **{% span red, there %}**{% endtip %}\n')).toBe(':::tip{type=home}\nhi **:span[there]{.red}**\n:::\n');
    expect(run('{% folding cyan open, 点击查看 %}\nbody\n{% endfolding %}\n')).toBe(':::details[点击查看]{.cyan open}\nbody\n:::\n');
    expect(run('a {% del gone %} b\n')).toBe('a ~~gone~~ b\n');
    expect(run('{% radio cyan checked, 正常: %}\n')).toBe(':radio[正常:]{.cyan checked}\n');
    expect(run('x {% psw secret %}\n')).toBe('x :spoiler[secret]\n');
  });

  it('builds tabs with enough colons for nesting', () => {
    const out = run('{% tabs t %}\n<!-- tab A -->\n{% folding green, f %}\nx\n{% endfolding %}\n<!-- endtab -->\n<!-- tab B -->\ny\n<!-- endtab -->\n{% endtabs %}\n');
    expect(out).toContain(':::::tabs\n::::tab[A]');
    expect(out).toContain(':::details[f]{.green}');
    expect(out).toContain('::::tab[B]\n\ny\n\n::::\n:::::');
  });

  it('puts block images on their own line and converts leaf tags', () => {
    expect(run('{% radio cyan checked, a: %}{% image https://x/y.jpg %}\n')).toBe(':radio[a:]{.cyan checked}\n\n![](https://x/y.jpg)\n');
    expect(run('{% meting "1" "tencent" "playlist" "theme:#fff" %}\n')).toBe('::music{id="1" server="tencent" type="playlist"}\n');
  });

  it('never touches code fences and leaves files without tags unchanged', () => {
    const src = '---\ntitle: t\n---\n```\n{% note info %}\n```\n\n\nplain\n';
    expect(migrate(src)).toBe(src);
    expect(remainingTags(src)).toEqual([]);
    expect(remainingTags('text {% note %}')).toEqual([1]);
  });
});
