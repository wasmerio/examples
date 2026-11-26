import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import { SidebarHeader as ShadcnSidebarHeader, useSidebar } from "@/shadcn/components/ui/sidebar"
import Profile from "../assets/images/profile.jpg"


export const SidebarHeader = () => {
    const { open } = useSidebar()
    return (
        <ShadcnSidebarHeader className={`${open && "h-40 items-center justify-center"}`}>
            <a href="/" aria-label="Go to homepage">
                <Avatar className={`${open ? "h-20 w-20 ring-2 ring-red-500" : "h-8 w-8"} hover:scale-110 duration-300 transition-all`}>
                    <AvatarImage src={Profile.src} alt="Aajafry's profile image" />
                    <AvatarFallback>aajafry</AvatarFallback>
                </Avatar>
            </a>
        </ShadcnSidebarHeader>
    )
}