import {
  mkdir,
  readFile,
  readdir,
  writeFile,
  access,
  lstat,
} from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { extractFrontmatter } from '@astrojs/markdown-remark';
import { parse } from 'yaml';
import { validSlug, slugRule } from './lib/slug.mjs';

const kinds = {
  page: 'pages',
  post: 'posts',
  category: 'categories',
  tag: 'tags',
};
const usage =
  'Usage: pnpm new <post|page|category|tag> <slug> [--use <template>] [--title <title>]';
function templateValues(type, slug, template, now, title) {
  return {
    type,
    slug,
    template,
    title: title ?? slug.split('/').at(-1),
    date: now.toISOString().slice(0, 10),
    datetime: now.toISOString(),
    time: now.toISOString().slice(11, 19).replaceAll(':', '-'),
    year: now.toISOString().slice(0, 4),
    month: now.toISOString().slice(5, 7),
    day: now.toISOString().slice(8, 10),
    timestamp: String(now.getTime()),
  };
}
function replaceTokens(
  value,
  values,
  filenames = false,
  escape = (value) => value,
) {
  return value.replace(
    filenames ? /\[([a-z]+)\]/g : /\{\{\s*([a-z]+)\s*\}\}/g,
    (whole, key) =>
      Object.hasOwn(values, key)
        ? filenames && key === 'datetime'
          ? values[key].replaceAll(':', '-')
          : escape(values[key])
        : whole,
  );
}
function renderTemplate(source, values) {
  const raw = extractFrontmatter(source);
  if (raw === undefined) return replaceTokens(source, values);
  const start = source.indexOf(raw);
  const metadata = raw
    .split('\n')
    .map((line) => {
      const quoted = line.match(
        /^(\s*[\w-]+:\s*)("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')([ \t]*(?:#[^\r\n]*)?\r?)$/,
      );
      if (!quoted) return replaceTokens(line, values);
      const [, prefix, scalar, suffix] = quoted;
      // JSON strings are valid YAML scalars and preserve newlines/control bytes.
      return (
        prefix + JSON.stringify(replaceTokens(parse(scalar), values)) + suffix
      );
    })
    .join('\n');
  return (
    source.slice(0, start) +
    metadata +
    replaceTokens(source.slice(start + raw.length), values)
  );
}
export async function createContent(
  root,
  type,
  slug,
  template = 'default',
  now = new Date(),
  title,
) {
  const directory =
    kinds[type] ?? (Object.values(kinds).includes(type) ? type : undefined);
  if (!directory) throw new Error(usage);
  const singular = Object.keys(kinds).find((key) => kinds[key] === directory);
  if (!validSlug(slug)) throw new Error(`Invalid slug. ${slugRule}`);
  if (!template || !/^[-\p{L}\p{N}_]+$/u.test(template))
    throw new Error('Template name must be one directory name.');
  const source = path.resolve(root, 'archetypes', directory, template);
  const destination = path.resolve(root, 'content', directory);
  if ((await lstat(source)).isSymbolicLink())
    throw new Error('Template directory cannot be a symbolic link.');
  const values = templateValues(singular, slug, template, now, title);
  const files = [];
  const folders = [];
  async function walk(folder, relative = '') {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (entry.isSymbolicLink())
        throw new Error(`Template symlinks are not supported: ${entry.name}`);
      const targetRelative = path.join(
        relative,
        replaceTokens(entry.name, values, true),
      );
      const target = path.resolve(destination, targetRelative);
      if (!target.startsWith(destination + path.sep))
        throw new Error(
          `Template path escapes content directory: ${targetRelative}`,
        );
      const sourcePath = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        folders.push(target);
        await walk(sourcePath, targetRelative);
      } else files.push({ source: sourcePath, target });
    }
  }
  await walk(source);
  if (!files.length) throw new Error('Template contains no files.');
  const seen = new Set();
  for (const target of [...folders, ...files.map((file) => file.target)]) {
    const key = target.toLowerCase();
    if (seen.has(key))
      throw new Error(`Template generates duplicate paths: ${target}`);
    seen.add(key);
    if (
      await access(target).then(
        () => true,
        () => false,
      )
    )
      throw new Error(`Refusing to overwrite existing content: ${target}`);
    let parent = path.dirname(target);
    while (
      parent === destination ||
      parent.startsWith(destination + path.sep)
    ) {
      const info = await lstat(parent).catch((error) => {
        if (error.code === 'ENOENT') return undefined;
        throw error;
      });
      if (info && (!info.isDirectory() || info.isSymbolicLink()))
        throw new Error(`Content parent must be a real directory: ${parent}`);
      parent = path.dirname(parent);
    }
  }
  // Plan and validate every output before touching the content tree.
  const payloads = await Promise.all(
    files.map(async (file) => ({
      ...file,
      bytes: /\.(md|mdx)$/i.test(file.source)
        ? Buffer.from(
            renderTemplate(await readFile(file.source, 'utf8'), values),
          )
        : await readFile(file.source),
    })),
  );
  for (const folder of folders) await mkdir(folder, { recursive: true });
  for (const file of payloads) {
    await mkdir(path.dirname(file.target), { recursive: true });
    await writeFile(file.target, file.bytes, { flag: 'wx' });
  }
  return files.map((file) => path.relative(root, file.target));
}
export function parseNewArgs(args) {
  if (args.includes('--help') || args.includes('-h')) return { help: true };
  const positional = [];
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg.startsWith('-')) {
      const [flag, inline] = arg.split(/=(.*)/s);
      if (!['--use', '--title'].includes(flag) || Object.hasOwn(options, flag))
        throw new Error(usage);
      const value = inline ?? args[++index];
      if (!value || value.startsWith('--'))
        throw new Error(`${flag} needs a value.\n${usage}`);
      options[flag] = value;
    } else positional.push(arg);
  }
  if (positional.length !== 2) throw new Error(usage);
  const [type, slug] = positional;
  if (!Object.hasOwn(kinds, type)) throw new Error(usage);
  return {
    type,
    slug,
    template: options['--use'] ?? 'default',
    title: options['--title'],
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const args = parseNewArgs(process.argv.slice(2));
    if (args.help) console.log(usage);
    else {
      const files = await createContent(
        process.cwd(),
        args.type,
        args.slug,
        args.template,
        new Date(),
        args.title,
      );
      console.log(`Created:\n${files.map((file) => `  ${file}`).join('\n')}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
