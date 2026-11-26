import { SidebarFooter as ShadcnSidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shadcn/components/ui/sidebar"
import { Github, Linkedin, Facebook, X } from "lucide-react"


// social menu items.
const items = [
    {
        title: "Github",
        url: "https://github.com/aajafry",
        icon: Github,
    },
    {
        title: "Linkedin",
        url: "https://linkedin.com/in/aajafry",
        icon: Linkedin,
    },
    {
        title: "Facebook",
        url: "https://www.facebook.com/aajafry",
        icon: Facebook,
    },
    {
        title: "X",
        url: "https://x.com/aajafry2",
        icon: X,
    },
]

export const SidebarFooter = () => {
    const { open } = useSidebar();
    return (
        <ShadcnSidebarFooter className="p-0">
            <SidebarGroup>
                <SidebarGroupLabel className="text-lg uppercase">Find with Me</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu className={`${open && "flex-row"}`} >
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <a 
                                        href={item.url} 
                                        target="blank" 
                                        rel="noopener noreferrer"
                                        aria-label={`Visit my ${item.title} profile`}
                                    >
                                        <item.icon aria-hidden="true" />
                                        <span className={`${open && "hidden"}`}>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </ShadcnSidebarFooter>
    )
}