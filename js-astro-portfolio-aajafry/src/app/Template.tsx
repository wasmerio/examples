import { AppSidebar } from "@/components/AppSidebar";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import { SlidebarToggle } from "@/components/SlidebarToggle";
import { SidebarInset, SidebarProvider } from "@/shadcn/components/ui/sidebar";
import { Toaster } from "sonner";

interface Props {
    children: React.ReactNode
    defaultSidebarOpen: boolean
}

export const Template = (props: Props) => {
    return (
        <SidebarProvider defaultOpen={props.defaultSidebarOpen}>
            <AppSidebar />
            <SidebarInset className="px-4">
                <header className="h-12 flex-center border-b">
                    <SlidebarToggle />
                    <a href="/" className="flex-grow text-center" aria-label="Home Page">
                        <Logo />
                    </a>
                    <ModeToggle />
                </header>
                <main className="flex-grow">
                    {props.children}
                </main>
                <footer className="h-12 flex-center border-t mt-12 text-gray-700 dark:text-gray-300">
                    &copy;2024. All Right Reserved  by
                    <a
                        href="mailto:aajafry2@gmail.com"
                        className="font-medium border-b-2 hover:border-rose-500 hover:text-rose-500 duration-300 transition-colors ml-2"
                        aria-label="Send an email to Al Abed Jafry"
                    >@aajafry</a>
                </footer>
            </SidebarInset>
            <Toaster richColors={true} position="bottom-right" />
        </SidebarProvider>
    );
}