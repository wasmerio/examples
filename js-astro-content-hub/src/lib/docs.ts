// Shared docs helpers — sort collection entries into sidebar nav items

export interface NavItem {
  href: string;
  label: string;
}

interface DocEntry {
  id: string;
  data: { title: string; order: number };
}

export function buildNav(docs: DocEntry[], basePath: string): NavItem[] {
  return [...docs] // copy - never mutate the caller's array
    .sort((a, b) => {
      // index always first
      if (a.id === 'index') return -1;
      if (b.id === 'index') return 1;
      // then by explicit order, then by title
      return a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
    })
    .map(doc => ({
      href: doc.id === 'index' ? basePath : `${basePath}/${doc.id}`,
      label: doc.data.title,
    }));
}
