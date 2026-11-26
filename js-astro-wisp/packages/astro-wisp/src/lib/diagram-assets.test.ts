import { EventEmitter } from 'node:events';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  cpSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  contentDisposition,
  copyDiagramSources,
  diagramDevMiddleware,
  downloadKeyFromUrl,
} from './diagram-assets';
import { FIX, makeRepo } from './render-diagram.fixture';

let repo: ReturnType<typeof makeRepo>;
beforeAll(() => {
  repo = makeRepo();
  // 一篇 draft 文章，其图表不应被复制
  const d = join(repo.root, 'src/content/posts/secret/diagrams');
  mkdirSync(d, { recursive: true });
  writeFileSync(
    join(repo.root, 'src/content/posts/secret/index.md'),
    '---\ntitle: s\ndraft: true\n---\n',
  );
  cpSync(join(FIX, 'hand-attention.excalidraw'), join(d, 'x.excalidraw'));
});
afterAll(() => rmSync(repo.root, { recursive: true, force: true }));

function request(mw: ReturnType<typeof diagramDevMiddleware>, url: string, method = 'GET') {
  const headers: Record<string, unknown> = {};
  const res = Object.assign(new EventEmitter(), {
    statusCode: 0,
    body: undefined as Buffer | undefined,
    setHeader(k: string, v: unknown) {
      headers[k.toLowerCase()] = v;
    },
    end(b?: Buffer) {
      this.body = b;
    },
  });
  let nexted = false;
  mw({ url, method } as never, res as never, () => {
    nexted = true;
  });
  return { res, headers, nexted };
}

describe('diagramDevMiddleware', () => {
  it('serves post diagrams with content-type and disposition', () => {
    const mw = diagramDevMiddleware({ root: repo.root });
    const r = request(mw, '/diagrams/demo/flow.excalidraw');
    expect(r.nexted).toBe(false);
    expect(r.res.statusCode).toBe(200);
    expect(r.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(r.headers['content-disposition']).toBe(
      `attachment; filename="flow.excalidraw"; filename*=UTF-8''flow.excalidraw`,
    );
    expect(r.res.body!.toString()).toBe(
      readFileSync(join(repo.root, 'src/content/posts/demo/diagrams/flow.excalidraw'), 'utf8'),
    );
    const d = request(mw, '/diagrams/demo/model.drawio?x=1');
    expect(d.headers['content-type']).toBe('application/xml; charset=utf-8');
  });
  it('serves shared diagrams and honours base', () => {
    const mw = diagramDevMiddleware({ root: repo.root, base: '/blog/' });
    expect(request(mw, '/blog/diagrams/shared/shared-flow.excalidraw').res.statusCode).toBe(200);
    expect(request(mw, '/diagrams/shared/shared-flow.excalidraw').nexted).toBe(true);
  });
  it('passes through unknown, traversal and non-source paths', () => {
    const mw = diagramDevMiddleware({ root: repo.root });
    expect(request(mw, '/diagrams/demo/none.drawio').nexted).toBe(true);
    expect(request(mw, '/diagrams/demo/flow.wisp.svg').nexted).toBe(true);
    expect(request(mw, '/diagrams/%2E%2E/demo/flow.excalidraw').nexted).toBe(true);
    expect(request(mw, '/diagrams/demo/flow.excalidraw', 'POST').nexted).toBe(true);
    expect(request(mw, '/posts/demo/').nexted).toBe(true);
  });
  it('HEAD has headers but no body', () => {
    const r = request(
      diagramDevMiddleware({ root: repo.root }),
      '/diagrams/demo/flow.excalidraw',
      'HEAD',
    );
    expect(r.res.statusCode).toBe(200);
    expect(r.res.body).toBeUndefined();
  });
});

describe('helpers', () => {
  it('encodes non-ascii filenames', () => {
    expect(contentDisposition('注意力.drawio')).toBe(
      `attachment; filename="___.drawio"; filename*=UTF-8''${encodeURIComponent('注意力.drawio')}`,
    );
  });
  it('extracts keys', () => {
    expect(downloadKeyFromUrl('/diagrams/a/b.drawio')).toBe('a/b.drawio');
    expect(downloadKeyFromUrl('/x/diagrams/a/b.drawio', '/x')).toBe('a/b.drawio');
    expect(downloadKeyFromUrl('/other')).toBeUndefined();
  });
});

describe('copyDiagramSources', () => {
  it('copies sources into dist/diagrams/<post-id>/, skipping drafts', () => {
    const out = mkdtempSync(join(tmpdir(), 'wisp-dist-'));
    try {
      const copied = copyDiagramSources(pathToFileURL(out + '/'), { root: repo.root });
      expect(copied.map((c) => c.key).sort()).toEqual([
        'demo/flow.excalidraw',
        'demo/model.drawio',
        'shared/shared-flow.excalidraw',
      ]);
      expect(existsSync(join(out, 'diagrams/demo/model.drawio'))).toBe(true);
      expect(existsSync(join(out, 'diagrams/shared/shared-flow.excalidraw'))).toBe(true);
      expect(existsSync(join(out, 'diagrams/secret'))).toBe(false);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});
