import { useState, useEffect, useCallback } from "react";
import { Search, Home, FileText, Mail, Settings, Sun, Moon, Command } from "lucide-react";
import { withBase } from "@/lib/utils";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: "home",
      title: "Home",
      description: "Go to homepage",
      icon: Home,
      action: () => window.location.href = withBase("/"),
      category: "Navigation",
    },
    {
      id: "components",
      title: "Components",
      description: "View component library",
      icon: FileText,
      action: () => window.location.href = withBase("/components"),
      category: "Navigation",
    },
    {
      id: "blog",
      title: "Blog",
      description: "Read our blog",
      icon: FileText,
      action: () => window.location.href = withBase("/blog"),
      category: "Navigation",
    },
    {
      id: "contact",
      title: "Contact",
      description: "Get in touch",
      icon: Mail,
      action: () => window.location.href = withBase("/contact"),
      category: "Navigation",
    },
    {
      id: "changelog",
      title: "Changelog",
      description: "See what's new",
      icon: FileText,
      action: () => window.location.href = withBase("/changelog"),
      category: "Navigation",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View dashboard demo",
      icon: Settings,
      action: () => window.location.href = withBase("/dashboard"),
      category: "Navigation",
    },
    {
      id: "toggle-theme",
      title: "Toggle Theme",
      description: "Switch between light and dark mode",
      icon: Sun,
      action: () => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem(
          "theme",
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      },
      category: "Actions",
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
      }

      if (!open) return;

      // Close with Escape
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }

      // Navigate with arrows
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      // Execute with Enter
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }
    },
    [open, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-background border rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {Object.entries(groupedCommands).length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((cmd, index) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                          globalIndex === selectedIndex
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50"
                        }`}
                        onClick={() => {
                          cmd.action();
                          setOpen(false);
                          setSearch("");
                          setSelectedIndex(0);
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{cmd.title}</div>
                          {cmd.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {cmd.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px]">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px]">
                ↵
              </kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>+ K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to show the trigger hint
export function CommandPaletteHint() {
  return (
    <button
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-md bg-background/50"
      onClick={() => {
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      }}
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Quick search</span>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
        <Command className="h-2.5 w-2.5" />K
      </kbd>
    </button>
  );
}
