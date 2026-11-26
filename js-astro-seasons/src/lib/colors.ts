export interface ColorGroup {
  title: string;
  tokens: string[];
}

export const COLOR_GROUPS: ColorGroup[] = [
  {
    title: 'Surfaces',
    tokens: ['bg', 'bg-elevated'],
  },
  {
    title: 'Text',
    tokens: ['ink', 'ink-soft', 'muted', 'muted-2'],
  },
  {
    title: 'Lines',
    tokens: ['line', 'line-strong'],
  },
  {
    title: 'Accents',
    tokens: ['accent', 'blue', 'pink'],
  },
  {
    title: 'Status',
    tokens: ['green', 'yellow', 'red'],
  },
  {
    title: 'Terminal',
    tokens: [
      'term-bg',
      'term-active-bg',
      'term-border',
      'term-text',
      'term-muted',
      'term-prompt',
      'term-cmd',
      'term-str',
    ],
  },
];
