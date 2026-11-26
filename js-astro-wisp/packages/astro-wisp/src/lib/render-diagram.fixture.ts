import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { contentHash, MANIFEST_FILE, type Manifest } from './render-diagram';

/** 测试辅助：用 tests/fixtures/diagrams 搭一个临时仓库（含 manifest）。 */
export const FIX = join(__dirname, '../../tests/fixtures/diagrams');

/** 临时仓库：posts/demo/diagrams/{flow.excalidraw, model.drawio} + shared/diagrams/shared-flow.excalidraw */
export function makeRepo(): { root: string; post: string; manifest: Manifest } {
  const root = mkdtempSync(join(tmpdir(), 'wisp-diagram-'));
  const pd = join(root, 'src/content/posts/demo/diagrams');
  const sd = join(root, 'src/content/shared/diagrams');
  mkdirSync(pd, { recursive: true });
  mkdirSync(sd, { recursive: true });
  writeFileSync(join(root, 'src/content/posts/demo/index.mdx'), '---\ntitle: demo\n---\n');
  cpSync(join(FIX, 'hand-attention.excalidraw'), join(pd, 'flow.excalidraw'));
  cpSync(join(FIX, 'hand-attention.wisp.svg'), join(pd, 'flow.wisp.svg'));
  cpSync(join(FIX, 'clean-transformer.drawio'), join(pd, 'model.drawio'));
  cpSync(join(FIX, 'clean-transformer.wisp.svg'), join(pd, 'model.wisp.svg'));
  cpSync(join(FIX, 'clean-transformer.page-2.wisp.svg'), join(pd, 'model.page-2.wisp.svg'));
  cpSync(join(FIX, 'hand-attention.excalidraw'), join(sd, 'shared-flow.excalidraw'));
  cpSync(join(FIX, 'hand-attention.wisp.svg'), join(sd, 'shared-flow.wisp.svg'));
  const h = (rel: string) => contentHash(readFileSync(join(root, rel)));
  const P = 'src/content/posts/demo/diagrams';
  const S = 'src/content/shared/diagrams';
  const manifest: Manifest = {
    version: 1,
    generator: 'wisp-diagram@1',
    entries: {
      [`${P}/flow.excalidraw`]: {
        source: h(`${P}/flow.excalidraw`),
        style: 'hand',
        exporter: 'x',
        embedFonts: false,
        outputs: { [`${P}/flow.wisp.svg`]: h(`${P}/flow.wisp.svg`) },
      },
      [`${P}/model.drawio`]: {
        source: h(`${P}/model.drawio`),
        style: 'clean',
        exporter: 'x',
        embedFonts: false,
        outputs: {
          [`${P}/model.wisp.svg`]: h(`${P}/model.wisp.svg`),
          [`${P}/model.page-2.wisp.svg`]: h(`${P}/model.page-2.wisp.svg`),
        },
        pages: ['encoder', '数据流'],
      },
      [`${S}/shared-flow.excalidraw`]: {
        source: h(`${S}/shared-flow.excalidraw`),
        style: 'hand',
        exporter: 'x',
        embedFonts: false,
        outputs: { [`${S}/shared-flow.wisp.svg`]: h(`${S}/shared-flow.wisp.svg`) },
      },
    },
  };
  writeFileSync(join(root, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
  return { root, post: join(root, 'src/content/posts/demo/index.mdx'), manifest };
}
