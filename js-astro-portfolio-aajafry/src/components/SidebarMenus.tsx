import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shadcn/components/ui/sidebar";
import { Briefcase, FilePenLine, Fingerprint, Home, Layers, Lightbulb, Send } from "lucide-react";


// menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "About",
        url: "/about",
        icon: Fingerprint,
    },
    {
        title: "Services",
        url: "/services",
        icon: Briefcase,
    },
    {
        title: "Portfolios",
        url: "/portfolios",
        icon: Layers,
    },
    {
        title: "Blogs",
        url: "/blogs",
        icon: FilePenLine,
    },
    {
        title: "Expertise",
        url: "/expertise",
        icon: Lightbulb,
    },
    {
        title: "Contract",
        url: "/contract",
        icon: Send,
    },
]

export const SidebarMenus = () => {
    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a href={item.url} aria-label={`Go to ${item.title}`}>
                                        <item.icon aria-hidden="true" />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    )
}