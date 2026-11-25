import { expect, expectTypeOf, test } from 'bun:test';
import { join } from 'node:path';
import { z } from 'astro/zod';
import {
  createTemplateRegistry,
  defineTemplate,
  parseTemplateEntry,
} from '../../src/templates/define';
import type { PageEntry, TemplateProps } from '../../src/types/template';

const load = async () => {
  throw new Error('Metadata operations must not load an Astro component.');
};
const plain = defineTemplate({ id: 'plain', name: 'Plain page', load });
const labels = defineTemplate({
  id: 'labels',
  schema: z.object({
    labels: z
      .string()
      .default('one,two')
      .transform((value) => value.split(',')),
  }),
  load,
});
const entry: PageEntry = {
  id: 'pages/example.md',
  filePath: 'src/content/pages/example.md',
  data: { title: 'Example', template: 'labels', extra: 'keep me' },
};

test('registry lists metadata and resolves IDs without loading components', () => {
  const registry = createTemplateRegistry([plain, labels]);
  expect(registry.listTemplates().map(({ id }) => id)).toEqual([
    'plain',
    'labels',
  ]);
  expect(registry.listTemplates()[0].name).toBe('Plain page');
  expect(registry.getTemplate('labels')).toBe(labels);
  expect(() => registry.getTemplate('missing', entry.filePath)).toThrow(
    'Unknown template "missing" in src/content/pages/example.md. Available templates: plain, labels.',
  );
});

test('rejects duplicate or invalid template IDs', () => {
  expect(() => createTemplateRegistry([plain, { ...plain }])).toThrow(
    'Duplicate template ID "plain"',
  );
  for (const id of ['', 'two words', 'UpperCase', '../page']) {
    expect(() => defineTemplate({ id, load })).toThrow('Invalid template ID');
  }
});

test('templates without schemas preserve metadata without validating other templates fields', () => {
  expect(parseTemplateEntry(plain, entry)).toBe(entry);
  const custom = { ...entry, data: { ...entry.data, labels: false } };
  expect(parseTemplateEntry(plain, custom).data.labels).toBe(false);
});

test('schema defaults and transforms merge into a new entry and preserve source metadata', () => {
  const parsed = parseTemplateEntry(labels, entry);
  expect(parsed).toEqual({
    ...entry,
    data: { ...entry.data, labels: ['one', 'two'] },
  });
  expect(entry.data.labels).toBeUndefined();
  expect(
    parseTemplateEntry(labels, {
      ...entry,
      data: { ...entry.data, labels: 'three,four' },
    }).data.labels,
  ).toEqual(['three', 'four']);

  expectTypeOf<typeof labels.id>().toEqualTypeOf<'labels'>();
  expectTypeOf<
    TemplateProps<typeof labels.schema>['entry']['data']['labels']
  >().toEqualTypeOf<string[]>();
  expectTypeOf<
    TemplateProps<typeof labels.schema>['entry']['data']['title']
  >().toEqualTypeOf<string>();
  expectTypeOf<
    TemplateProps['entry']['data']['title']
  >().toEqualTypeOf<string>();
});

test('schema errors identify the template, source, and nested fields', () => {
  const nested = defineTemplate({
    id: 'nested',
    schema: z.object({ projects: z.array(z.object({ name: z.string() })) }),
    load,
  });
  const invalid = {
    ...entry,
    data: { ...entry.data, projects: [{ name: 1 }] },
  };
  expect(() => parseTemplateEntry(nested, invalid)).toThrow(
    'Invalid nested template metadata in src/content/pages/example.md: projects.0.name:',
  );
});

test('Bun can read the site registry outside Astro without loading .astro files', async () => {
  const child = Bun.spawn(
    [
      'bun',
      '-e',
      'import { listTemplates } from "./src/templates/registry"; console.log(JSON.stringify(listTemplates()));',
    ],
    {
      cwd: join(import.meta.dir, '../..'),
      stdout: 'pipe',
      stderr: 'pipe',
    },
  );
  const [code, output, errors] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  expect(code, errors).toBe(0);
  expect(JSON.parse(output).map(({ id }: { id: string }) => id)).toEqual([
    'default',
    'friend',
  ]);
});
