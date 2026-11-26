import { Button } from "@/shadcn/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
        // Retrieve the stored theme from localStorage or default to system preference
        if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
            return localStorage.getItem("theme") as "light" | "dark" | "system";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        // Apply the theme based on the state
        if (theme === "system") {
            // Listen to system color scheme changes
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            document.documentElement.classList.toggle("dark", mediaQuery.matches);

            // Update the theme whenever the system color scheme changes
            const handleSystemChange = (e: MediaQueryListEvent) => {
                document.documentElement.classList.toggle("dark", e.matches);
            };

            mediaQuery.addEventListener("change", handleSystemChange);

            return () => {
                mediaQuery.removeEventListener("change", handleSystemChange);
            };
        } else {
            // Toggle the dark class based on the selected theme
            document.documentElement.classList.toggle("dark", theme === "dark");
        }

        // Save the selected theme to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="link" 
                    size="icon" 
                    aria-expanded="false"
                    aria-label="Toggle theme"
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
