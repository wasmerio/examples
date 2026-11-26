import tablerIcons from '@iconify-json/tabler/icons.json';

export type IconSource = string;

interface IconEntry {
  body: string;
}

const iconEntries: Record<string, IconEntry> = tablerIcons.icons;
const iconAliases: Record<string, { parent: string }> = tablerIcons.aliases;

export function getIcon(name: string): IconSource {
  const iconName: string = iconAliases[name]?.parent ?? name;
  const entry: IconEntry | undefined = iconEntries[iconName];

  if (!entry) {
    throw new Error(`Unknown Tabler icon: ${name}`);
  }

  return entry.body;
}
