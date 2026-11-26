import { Sidebar } from "@/shadcn/components/ui/sidebar";
import { SidebarMenus } from "./SidebarMenus";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";


export const AppSidebar = () => {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader />
            <SidebarMenus />
            <SidebarFooter />
        </Sidebar>
    )
}