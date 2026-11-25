import clsx from "clsx/lite";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function Navigation({ children }: { children: React.ReactNode; }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center justify-center gap-12">

            <AnimatePresence>
                {isOpen &&
                    <>
                        <motion.div
                            initial={{ filter: "blur(20px)", opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 0.5 }}
                            animate={{ filter: "blur(0px)", opacity: 1 }}
                            exit={{ filter: "blur(20px)", opacity: 0 }}
                            className="hidden lg:flex gap-4">
                            {children}
                        </motion.div>

                        <motion.dialog
                            open={isOpen}
                            initial={{ filter: "blur(20px)", opacity: 0 }}
                            transition={{ ease: "easeInOut", duration: 0.25 }}
                            animate={{ filter: "blur(0px)", opacity: 1 }}
                            exit={{ filter: "blur(20px)", opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden absolute z-50 w-full h-full flex flex-col gap-4 top-0 bg-zinc-900/20 backdrop-blur-md">

                            <div className="fixed bottom-20 sm:bottom-32 left-4 sm:left-8 flex flex-col items-start justify-center gap-4">
                                <MobileLink href="/blog">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                                        <title>Blog Icon</title>
                                        <path fill="currentColor" fillRule="evenodd" d="m20.83 10.715l-.518 1.932c-.605 2.255-.907 3.383-1.592 4.114a4 4 0 0 1-2.01 1.161c-.097.023-.195.04-.295.052c-.915.113-2.032-.186-4.064-.73c-2.255-.605-3.383-.907-4.114-1.592a4 4 0 0 1-1.161-2.011c-.228-.976.074-2.103.679-4.358l.517-1.932l.244-.905c.455-1.666.761-2.583 1.348-3.21a4 4 0 0 1 2.01-1.16c.976-.228 2.104.074 4.36.679c2.254.604 3.382.906 4.113 1.59a4 4 0 0 1 1.161 2.012c.228.976-.075 2.103-.679 4.358m-9.778-.91a.75.75 0 0 1 .919-.53l4.83 1.295a.75.75 0 1 1-.389 1.448l-4.83-1.294a.75.75 0 0 1-.53-.918m-.776 2.898a.75.75 0 0 1 .918-.53l2.898.777a.75.75 0 1 1-.388 1.448l-2.898-.776a.75.75 0 0 1-.53-.919" clipRule="evenodd" />
                                        <path fill="currentColor" d="M16.415 17.975a4 4 0 0 1-1.068 1.677c-.731.685-1.859.987-4.114 1.591s-3.383.907-4.358.679a4 4 0 0 1-2.011-1.161c-.685-.731-.988-1.859-1.592-4.114l-.517-1.932c-.605-2.255-.907-3.383-.68-4.358a4 4 0 0 1 1.162-2.011c.731-.685 1.859-.987 4.114-1.592c.426-.114.813-.218 1.165-.309l-.244.906l-.517 1.932c-.605 2.255-.907 3.382-.68 4.358a4 4 0 0 0 1.162 2.011c.731.685 1.859.987 4.114 1.592c2.032.544 3.149.843 4.064.73" opacity=".5" />
                                    </svg>
                                    Blog
                                </MobileLink>

                                <MobileLink href="/about">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                                        <title>Info Icon</title>
                                        <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.634 1.634 0 0 1 1.149.133A9.958 9.958 0 0 0 12 22" opacity=".5" />
                                        <path fill="currentColor" d="M7.5 11.11c0 1.368 1.319 2.804 2.529 3.833c.823.7 1.235 1.05 1.971 1.05s1.148-.35 1.971-1.05c1.21-1.03 2.529-2.465 2.529-3.834c0-2.677-2.475-3.676-4.5-1.608c-2.025-2.068-4.5-1.069-4.5 1.608" />
                                    </svg>
                                    About
                                </MobileLink>

                                <MobileLink href="/contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                                        <title>Smiley Face Icon</title>
                                        <path fill="currentColor" d="M16.791 13.343c.781-.274 1.752-.31 3.78-.315h1.426c-.007.097.01-.097 0 0a1.478 1.478 0 0 1-.424.908l-7.65 7.69a1.262 1.262 0 0 1-.895.37c-.097.01.097-.006 0 0v-1.424c.005-2.03.041-3 .314-3.78a5.621 5.621 0 0 1 3.45-3.45" />
                                        <path fill="currentColor" d="M13.028 21.948A10.27 10.27 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 .347-.018.69-.052 1.028h-1.376c-2.03.005-3 .041-3.78.314a5.621 5.621 0 0 0-3.45 3.45c-.273.78-.31 1.75-.314 3.78z" opacity=".5" />
                                        <path fill="currentColor" d="M14.898 11.224c.533-.143.792-.908.578-1.708c-.215-.8-.821-1.333-1.355-1.19c-.533.143-.792.907-.577 1.708c.214.8.82 1.333 1.354 1.19m-5.796 1.553c.534-.143.792-.908.578-1.708c-.214-.8-.82-1.333-1.354-1.19c-.534.143-.792.907-.578 1.708c.215.8.82 1.333 1.354 1.19m-.007 2.429a.75.75 0 1 0-.365 1.455c1.387.347 2.944.344 4.5-.073l.052-.014l.08.163a5.62 5.62 0 0 1 3.43-3.394c.092-.033.188-.062.287-.088a.75.75 0 0 0-.96.069c-.838.81-1.96 1.463-3.278 1.816s-2.616.35-3.746.066" />
                                    </svg>
                                    Contact
                                </MobileLink>

                                <motion.button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    initial={{ transform: "translateY(100px)", filter: "blur(20px)", opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 25, damping: 2, mass: 0.1 }}
                                    animate={{ transform: "translateY(0px)", filter: "blur(0px)", opacity: 1 }}
                                    exit={{ transform: "translateY(100px)", filter: "blur(20px)", opacity: 0 }}
                                    className="w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" aria-hidden>
                                        <title>Close Icon</title>
                                        <path fill="currentColor" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" opacity=".5" />
                                        <path fill="currentColor" d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06" />
                                    </svg>
                                    Close
                                </motion.button>
                            </div>
                        </motion.dialog>
                    </>
                }
            </AnimatePresence>

            <button type="button" onClick={() => setIsOpen(prev => !prev)} className="w-6 sm:w-8 h-fit text-white cursor-pointer hover:outline-2 focus-visible:outline-2 outline-offset-1 outline-zinc-100/20 focus-visible:outline-white rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className={clsx("transition-all duration-300 ease-in-out", isOpen ? "rotate-90" : "rotate-0")}>
                    <title>Menu Icon</title>
                    <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10" opacity=".5" />
                    <path fill="currentColor" d="M13.024 14.56c.493-.197.739-.296.932-.465c.05-.043.096-.09.139-.139c.17-.193.268-.44.465-.932c.924-2.31 1.386-3.465.938-4.124a1.5 1.5 0 0 0-.398-.398c-.66-.448-1.814.014-4.124.938c-.493.197-.74.295-.933.465c-.049.043-.095.09-.138.139c-.17.193-.268.44-.465.932c-.924 2.31-1.386 3.464-.938 4.124a1.5 1.5 0 0 0 .398.398c.66.448 1.814-.014 4.124-.938" />
                </svg>
            </button>
        </div>
    );
}

type MobileLinkProps = {
    href: string;
    className?: string;
    children: React.ReactNode;
};

function MobileLink({ href, className, children }: MobileLinkProps) {
    return (
        <motion.a
            href={href}
            initial={{ transform: "translateY(100px)", filter: "blur(20px)", opacity: 0 }}
            transition={{ type: "spring", stiffness: 25, damping: 2, mass: 0.1 }}
            animate={{ transform: "translateY(0px)", filter: "blur(0px)", opacity: 1 }}
            exit={{ transform: "translateY(100px)", filter: "blur(20px)", opacity: 0 }}
            className={clsx("w-fit flex items-center justify-center gap-3 text-lg sm:text-2xl text-zinc-100 cursor-pointer", className)}>
            {children}
        </motion.a>
    );
}