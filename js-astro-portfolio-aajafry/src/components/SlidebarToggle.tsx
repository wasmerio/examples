import { Button } from "@/shadcn/components/ui/button";
import { useSidebar } from "@/shadcn/components/ui/sidebar"
import { Menu } from "lucide-react";

export const SlidebarToggle = () => {
    const { toggleSidebar } = useSidebar();
    return (
        <Button
            size="icon"
            variant="link"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
        >
            <Menu />
        </Button>
    )
}