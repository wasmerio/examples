import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

interface DropdownItem {
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  items: DropdownItem[];
  align?: 'start' | 'end';
  trigger: ReactNode;
  className?: string;
}

// Map common action names to resolved icon names (mirrors Dropdown.astro iconMap)
const iconNameMap: Record<string, string> = {
  edit: 'edit',
  copy: 'copy',
  share: 'share',
  archive: 'archive',
  trash: 'trash',
  delete: 'trash',
  download: 'download',
  upload: 'upload',
  settings: 'settings',
  view: 'external-link',
};

// Inline SVG path data for dropdown icons (Lucide paths from Icon.astro)
const iconPaths: Record<string, string> = {
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  copy: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9V2',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  archive: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
  'external-link': 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  'arrow-up-right': 'M7 17L17 7M7 7h10v10',
  box: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  x: 'M18 6L6 18M6 6l12 12',
};

function DropdownIcon({ name, disabled }: { name: string; disabled?: boolean }) {
  const resolvedName = iconNameMap[name] || name;
  const pathData = iconPaths[resolvedName];

  if (!pathData) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'w-4 h-4 shrink-0',
        disabled ? 'text-foreground-subtle' : 'text-foreground-muted'
      )}
      aria-hidden="true"
    >
      {pathData.split('M').filter(Boolean).map((d, i) => (
        <path key={i} d={`M${d}`} />
      ))}
    </svg>
  );
}

export function Dropdown({ items, align = 'start', trigger, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Build a list of actionable (non-separator) item indices
  const actionableIndices = items.reduce<number[]>((acc, item, i) => {
    if (!item.separator && !item.disabled) acc.push(i);
    return acc;
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    // Focus first actionable item
    const firstActionable = actionableIndices[0];
    if (firstActionable !== undefined) {
      setFocusedIndex(firstActionable);
      requestAnimationFrame(() => {
        itemRefs.current[firstActionable]?.focus();
      });
    }
  }, [actionableIndices]);

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, []);

  const focusItem = useCallback((index: number) => {
    // Cycle through actionable indices
    const pos = actionableIndices.indexOf(index);
    let targetIndex: number;

    if (pos !== -1) {
      targetIndex = index;
    } else if (index < 0 || index < actionableIndices[0]) {
      targetIndex = actionableIndices[actionableIndices.length - 1];
    } else {
      targetIndex = actionableIndices[0];
    }

    setFocusedIndex(targetIndex);
    requestAnimationFrame(() => {
      itemRefs.current[targetIndex]?.focus();
    });
  }, [actionableIndices]);

  const focusNext = useCallback(() => {
    const currentPos = actionableIndices.indexOf(focusedIndex);
    const nextPos = currentPos + 1 >= actionableIndices.length ? 0 : currentPos + 1;
    const nextIndex = actionableIndices[nextPos];
    setFocusedIndex(nextIndex);
    requestAnimationFrame(() => {
      itemRefs.current[nextIndex]?.focus();
    });
  }, [actionableIndices, focusedIndex]);

  const focusPrev = useCallback(() => {
    const currentPos = actionableIndices.indexOf(focusedIndex);
    const prevPos = currentPos - 1 < 0 ? actionableIndices.length - 1 : currentPos - 1;
    const prevIndex = actionableIndices[prevPos];
    setFocusedIndex(prevIndex);
    requestAnimationFrame(() => {
      itemRefs.current[prevIndex]?.focus();
    });
  }, [actionableIndices, focusedIndex]);

  // Click outside detection
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [close]);

  function handleTriggerClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isOpen) {
      close();
    } else {
      open();
    }
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      open();
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPrev();
        break;
      case 'Home':
        e.preventDefault();
        if (actionableIndices.length > 0) {
          focusItem(actionableIndices[0]);
        }
        break;
      case 'End':
        e.preventDefault();
        if (actionableIndices.length > 0) {
          focusItem(actionableIndices[actionableIndices.length - 1]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        // Return focus to trigger
        requestAnimationFrame(() => {
          const triggerEl = triggerRef.current?.querySelector<HTMLElement>(
            'button, [tabindex], a'
          ) || triggerRef.current;
          triggerEl?.focus();
        });
        break;
      case 'Tab':
        close();
        break;
    }
  }

  function handleItemActivate(item: DropdownItem) {
    if (item.disabled) return;
    if (item.onClick) {
      item.onClick();
      close();
    }
    // If href, let the link navigate naturally
    if (!item.href) {
      close();
    }
  }

  function handleItemKeyDown(e: React.KeyboardEvent, item: DropdownItem) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemActivate(item);
    }
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </div>

      <div
        ref={menuRef}
        className={cn(
          'absolute z-[100] mt-2 min-w-[180px] p-1.5',
          'rounded-xl bg-background border border-border shadow-xl',
          'transition-all duration-150 ease-out',
          isOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible translate-y-1',
          align === 'end' ? 'right-0' : 'left-0'
        )}
        role="menu"
        aria-orientation="vertical"
        onKeyDown={handleMenuKeyDown}
      >
        {items.map((item, index) =>
          item.separator ? (
            <div key={index} className="my-1.5 h-px bg-border" role="separator" />
          ) : item.href ? (
            <a
              key={index}
              ref={(el) => { itemRefs.current[index] = el; }}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 text-sm rounded-md',
                'transition-colors outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring',
                item.disabled
                  ? 'opacity-50 cursor-not-allowed pointer-events-none text-foreground-muted'
                  : 'hover:bg-secondary focus:bg-secondary text-foreground-secondary hover:text-foreground'
              )}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              aria-disabled={item.disabled || undefined}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                handleItemActivate(item);
              }}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
            >
              {item.icon && <DropdownIcon name={item.icon} disabled={item.disabled} />}
              <span>{item.label}</span>
            </a>
          ) : (
            <button
              key={index}
              ref={(el) => { itemRefs.current[index] = el; }}
              type="button"
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2 text-sm rounded-md',
                'transition-colors outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring',
                item.disabled
                  ? 'opacity-50 cursor-not-allowed pointer-events-none text-foreground-muted'
                  : 'hover:bg-secondary focus:bg-secondary text-foreground-secondary hover:text-foreground'
              )}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              aria-disabled={item.disabled || undefined}
              onClick={() => handleItemActivate(item)}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
            >
              {item.icon && <DropdownIcon name={item.icon} disabled={item.disabled} />}
              <span>{item.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Dropdown;
