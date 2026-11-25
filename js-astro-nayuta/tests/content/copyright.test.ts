import { expect, test } from 'bun:test';
import { cp, mkdtemp, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '../..');

async function build(root: string) {
  const child = Bun.spawn(['bun', 'run', 'build'], {
    cwd: root,
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [code, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  return { code, output: stdout + stderr };
}

async function writeConfig(root: string, enabled: boolean, license?: string) {
  await Bun.write(
    join(root, 'src/config.ts'),
    `import config from './fixture-config';\nexport default { ...config, copyright: ${JSON.stringify({ enabled, license })} };\n`,
  );
}

async function writePost(root: string, id: string, copyright?: object) {
  await Bun.write(
    join(root, 'src/content/posts', `${id}.md`),
    `---\n${JSON.stringify({ title: id, publishDate: '2026-01-01', tags: ['Test'], copyright })}\n---\n\nArticle body.\n`,
  );
}

async function page(root: string, id: string) {
  return Bun.file(join(root, 'dist/posts', id, 'index.html')).text();
}

test('post copyright cards follow site defaults and article overrides', async () => {
  const root = await mkdtemp(join(tmpdir(), 'nayuta-copyright-'));
  try {
    await Promise.all(
      ['src', 'astro.config.ts', 'package.json', 'tsconfig.json'].map((path) =>
        cp(join(repositoryRoot, path), join(root, path), { recursive: true }),
      ),
    );
    await symlink(
      join(repositoryRoot, 'node_modules'),
      join(root, 'node_modules'),
      'dir',
    );
    await cp(join(root, 'src/config.ts'), join(root, 'src/fixture-config.ts'));
    await rm(join(root, 'src/content/posts'), { recursive: true });
    await Promise.all([
      writePost(root, 'default'),
      writePost(root, 'enabled', { enabled: true }),
      writePost(root, 'custom', { enabled: true, license: 'CC BY 4.0' }),
      writePost(root, 'disabled', { enabled: false }),
      writePost(root, 'override', { license: 'CC BY-SA 4.0' }),
    ]);

    await writeConfig(root, false, 'CC BY-NC-SA 4.0');
    const firstBuild = await build(root);
    expect(firstBuild.code, firstBuild.output).toBe(0);
    expect(await page(root, 'default')).not.toContain('class="copyright-card"');
    expect(await page(root, 'override')).not.toContain(
      'class="copyright-card"',
    );

    const enabled = await page(root, 'enabled');
    expect(enabled).toContain('CC BY-NC-SA 4.0');
    expect(enabled).toContain('rel="license"');
    expect(enabled).toContain(
      'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    );
    expect(enabled).toContain('https://nayuta.kani.dev/posts/enabled');
    expect(enabled.indexOf('class="copyright-card"')).toBeGreaterThan(
      enabled.indexOf('Article body.'),
    );
    expect(enabled.indexOf('class="copyright-card"')).toBeLessThan(
      enabled.indexOf('class="post-tags"'),
    );
    expect(enabled).not.toContain('All rights reserved');
    expect(await page(root, 'custom')).toContain(
      'https://creativecommons.org/licenses/by/4.0/',
    );

    await writeConfig(root, true, 'CC BY-NC-SA 4.0');
    const secondBuild = await build(root);
    expect(secondBuild.code, secondBuild.output).toBe(0);
    expect(await page(root, 'default')).toContain('class="copyright-card"');
    expect(await page(root, 'override')).toContain(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    );
    expect(await page(root, 'disabled')).not.toContain(
      'class="copyright-card"',
    );

    await writeConfig(root, true);
    const invalidBuild = await build(root);
    expect(invalidBuild.code).not.toBe(0);
    expect(invalidBuild.output).toContain(
      'enables the copyright card without a Creative Commons license',
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}, 120_000);
