import type { PageEntry, TemplateDefinition } from '@type/template';

/** Preserve the schema's output type and the template's literal ID. */
export function defineTemplate<const T extends TemplateDefinition>(
  definition: T,
): T {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(definition.id)) {
    throw new Error(
      `Invalid template ID ${JSON.stringify(definition.id)}. Use lowercase kebab-case.`,
    );
  }
  return definition;
}

/** Build a registry without executing any component loaders. */
export function createTemplateRegistry(
  definitions: readonly TemplateDefinition[],
) {
  const byId = new Map<string, TemplateDefinition>();
  for (const definition of definitions) {
    if (byId.has(definition.id)) {
      throw new Error(
        `Duplicate template ID ${JSON.stringify(definition.id)}.`,
      );
    }
    byId.set(definition.id, definition);
  }
  return {
    listTemplates() {
      return Array.from(byId.values(), ({ id, name, description }) => ({
        id,
        name,
        description,
      }));
    },
    getTemplate(id: string, source?: string) {
      const definition = byId.get(id);
      if (!definition) {
        throw new Error(
          `Unknown template ${JSON.stringify(id)}${source ? ` in ${source}` : ''}. Available templates: ${Array.from(byId.keys()).join(', ')}.`,
        );
      }
      return definition;
    },
  };
}

/** Parse once before the frame, sidebars, template and body receive the entry. */
export function parseTemplateEntry(
  definition: TemplateDefinition,
  entry: PageEntry,
): PageEntry {
  if (!definition.schema) return entry;
  const parsed = definition.schema.safeParse(entry.data);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(
      `Invalid ${definition.id} template metadata in ${entry.filePath ?? entry.id}: ${details}`,
    );
  }
  return { ...entry, data: { ...entry.data, ...parsed.data } };
}
