export type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridBreakpoint = 'default' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridColumns = GridColumnCount | Partial<Record<GridBreakpoint, GridColumnCount>>;

const COLUMN_CLASSES: Record<GridBreakpoint, Record<GridColumnCount, string>> = {
  default: {
    1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4',
    5: 'grid-cols-5', 6: 'grid-cols-6', 7: 'grid-cols-7', 8: 'grid-cols-8',
    9: 'grid-cols-9', 10: 'grid-cols-10', 11: 'grid-cols-11', 12: 'grid-cols-12',
  },
  sm: {
    1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6', 7: 'sm:grid-cols-7', 8: 'sm:grid-cols-8',
    9: 'sm:grid-cols-9', 10: 'sm:grid-cols-10', 11: 'sm:grid-cols-11', 12: 'sm:grid-cols-12',
  },
  md: {
    1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4',
    5: 'md:grid-cols-5', 6: 'md:grid-cols-6', 7: 'md:grid-cols-7', 8: 'md:grid-cols-8',
    9: 'md:grid-cols-9', 10: 'md:grid-cols-10', 11: 'md:grid-cols-11', 12: 'md:grid-cols-12',
  },
  lg: {
    1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6', 7: 'lg:grid-cols-7', 8: 'lg:grid-cols-8',
    9: 'lg:grid-cols-9', 10: 'lg:grid-cols-10', 11: 'lg:grid-cols-11', 12: 'lg:grid-cols-12',
  },
  xl: {
    1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6', 7: 'xl:grid-cols-7', 8: 'xl:grid-cols-8',
    9: 'xl:grid-cols-9', 10: 'xl:grid-cols-10', 11: 'xl:grid-cols-11', 12: 'xl:grid-cols-12',
  },
  '2xl': {
    1: '2xl:grid-cols-1', 2: '2xl:grid-cols-2', 3: '2xl:grid-cols-3', 4: '2xl:grid-cols-4',
    5: '2xl:grid-cols-5', 6: '2xl:grid-cols-6', 7: '2xl:grid-cols-7', 8: '2xl:grid-cols-8',
    9: '2xl:grid-cols-9', 10: '2xl:grid-cols-10', 11: '2xl:grid-cols-11', 12: '2xl:grid-cols-12',
  },
};

const VALID_COLUMN_COUNTS = new Set(Object.keys(COLUMN_CLASSES.default).map(Number));
const VALID_BREAKPOINTS = new Set(Object.keys(COLUMN_CLASSES));

function assertColumnCount(value: number, breakpoint: string): asserts value is GridColumnCount {
  if (!Number.isInteger(value) || !VALID_COLUMN_COUNTS.has(value)) {
    throw new RangeError(`Unsupported grid column count at ${breakpoint}: ${value}. Use an integer from 1 to 12.`);
  }
}

export function toGridClasses(columns: GridColumns): string {
  const entries: Array<[string, number]> = typeof columns === 'number'
    ? [['default', columns]]
    : Object.entries(columns);

  return entries.map(([breakpoint, count]) => {
    if (!VALID_BREAKPOINTS.has(breakpoint)) {
      throw new RangeError(`Unsupported grid breakpoint: ${breakpoint}. Use default, sm, md, lg, xl, or 2xl.`);
    }

    assertColumnCount(count, breakpoint);
    return COLUMN_CLASSES[breakpoint as GridBreakpoint][count];
  }).join(' ');
}
