import assert from 'node:assert/strict';
import { constants } from 'node:fs';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile, spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);
const project = fileURLToPath(new URL('../', import.meta.url));
const browserMode = process.argv.includes('--browser');
const fixture = await mkdtemp(join(tmpdir(), 'scholars-content-'));
const options = { recursive: true, verbatimSymlinks: true, mode: constants.COPYFILE_FICLONE };
async function write(path, text) {
	await mkdir(dirname(join(fixture, path)), { recursive: true });
	await writeFile(join(fixture, path), text);
}
async function buildAndCheck() {
	for (const args of [
		[join(fixture, 'node_modules/astro/bin/astro.mjs'), 'build', '--force'],
		[join(project, 'scripts/assert-built-site.mjs'), join(fixture, 'dist')],
	]) {
		try {
			await run(process.execPath, args, { cwd: fixture, maxBuffer: 8 * 1024 * 1024 });
		} catch (error) {
			throw new Error(`${error.stdout ?? ''}\n${error.stderr ?? ''}`, { cause: error });
		}
	}
}

try {
	// Keep the user's content untouched; local copies also isolate Vite's dependency cache.
	for (const path of ['src', 'public', 'astro.config.ts', 'site.config.ts', 'uno.config.ts', 'package.json', 'tsconfig.json']) {
		await cp(join(project, path), join(fixture, path), options);
	}
	await cp(join(project, 'node_modules'), join(fixture, 'node_modules'), {
		...options,
		filter: (source) => !source.split(/[\\/]/).some((part) => part === '.vite' || part === '.astro'),
	});
	for (const collection of ['posts', 'projects', 'teaching']) {
		await rm(join(fixture, 'src/content', collection), { recursive: true, force: true });
		await mkdir(join(fixture, 'src/content', collection), { recursive: true });
	}
	await mkdir(join(fixture, 'src/assets/regression'), { recursive: true });
	await sharp({ create: { width: 800, height: 400, channels: 3, background: '#294652' } })
		.png().toFile(join(fixture, 'src/assets/regression/cover.png'));
	await write('src/content/posts/regression/covered.md', `---
title: Covered note
description: An independent image optimization fixture.
publishedAt: 2025-01-01
heroImage: ../../../assets/regression/cover.png
heroImageAlt: Solid blue test image
---
Image fixture.
`);
	await write('src/data/publications.bib', '@article{single,title={Single paper},year=2025,public={yes}}\n% trailing comment\n');
	if (browserMode) {
		await write('src/data/publications.bib', '@article{single,title={Single paper},author={Doe, Jane},year=2025,public={yes}}\n@article{working,title={Working paper},year=2026,public={wp}}\n');
	}
	await write('src/content/posts/regression/note.mdx', `---
title: Regression note
description: Featured note without a cover.
publishedAt: 2099-01-01
featured: true
---
export const value = 2;

<p data-mdx-check>{value + 1}</p>

中文内容与超长链接：${'LongUnbrokenIdentifier'.repeat(18)}

| ${Array.from({length:10},(_,i)=>`LongColumnName${i}`).join(' | ')} |
| ${Array(10).fill('---').join(' | ')} |
| ${Array(10).fill('ResearchData').join(' | ')} |

\`\`\`text
${'LongCodeIdentifier'.repeat(20)}
\`\`\`
`);
	await write('src/content/posts/regression/draft.mdx', `---
title: Unpublished draft
description: Must stay hidden.
publishedAt: 2099-01-01
draft: true
---
<p>Never published</p>
`);
	await write('src/content/projects/regression/project.md', `---
title: Nested project
summary: Project without a cover.
status: active
period: "2026"
order: 99
---
Project details.
`);
	await write('src/content/teaching/regression/course.md', `---
title: Nested course
code: TEST 101
summary: Course in a subdirectory.
term: Spring 2026
status: current
order: 99
---
Course details.
`);
	await buildAndCheck();
	const mdx = await readFile(join(fixture, 'dist/posts/regression/note/index.html'), 'utf8');
	assert.equal(mdx.match(/<p data-mdx-check(?:="[^"]*")?>(.*?)<\/p>/)?.[1], '3', 'MDX expressions must render');
	assert.match(mdx, /<table>/, 'MDX tables must render');
	const posts = await readFile(join(fixture, 'dist/posts/index.html'), 'utf8');
	const featured = posts.match(/<section aria-labelledby="featured-note">[\s\S]*?<\/section>/)?.[0] ?? '';
	assert.match(featured, /Regression note/);
	assert.doesNotMatch(featured, /md:grid-cols-/);
	assert.match(posts, /<img[^>]+srcset="[^"]+\.webp/);
	console.log('Passed: nested MDX/project/course routes, draft exclusion, no cover, optimized covers.');
	if (browserMode) {
		const { preview } = await import('astro');
		const server = await preview({ root: fixture, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
		try {
			await new Promise((resolve, reject) => {
				const child = spawn(process.execPath, [join(project, 'node_modules/@playwright/test/cli.js'), 'test', ...process.argv.slice(2).filter((arg) => arg !== '--browser')], {
					cwd: project,
					env: { ...process.env, BROWSER_BASE_URL: `http://127.0.0.1:${server.port}` },
					stdio: 'inherit',
				});
				child.on('error', reject);
				child.on('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`Browser regression failed (${signal ?? code}).`)));
			});
		} finally {
			await server.stop();
		}
	} else {
		console.log('Passed: single publication category.');
		await rm(join(fixture, 'dist/posts/regression/note/index.html'));
		await assert.rejects(run(process.execPath, [join(project, 'scripts/assert-built-site.mjs'), join(fixture, 'dist')], { cwd: fixture }), /has no generated detail page/);

		for (const collection of ['posts', 'projects', 'teaching']) {
			await rm(join(fixture, 'src/content', collection), { recursive: true });
			await mkdir(join(fixture, 'src/content', collection));
		}
		await write('src/data/publications.bib', '% Empty library\n');
		await buildAndCheck();
		console.log('Passed: empty collections and empty bibliography.');
	}
} finally {
	await rm(fixture, { recursive: true, force: true });
}
