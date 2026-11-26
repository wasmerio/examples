"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme";
import { MobileNav } from "./mobileNav";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  testId: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  isActive,
  testId,
}) => (
  <li>
    <a
      data-testid={testId}
      className={`un rounded-lg md:text-xl lg:text-2xl xl:text-4xl ${
        isActive ? "text-blue-400" : ""
      }`}
      href={href}
    >
      {children}
    </a>
  </li>
);

const navItems = [
  { href: "/", label: "Home" },
  { href: "/About", label: "About" },
  { href: "/Services", label: "Services" },
  { href: "/Reviews", label: "Reviews" },
  { href: "/Contact", label: "Contact" },
  { href: "/#FAQ", label: "FAQ" },
];

export default function Nav() {
  const [activePath, setActivePath] = React.useState<string>("");

  React.useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  return (
    <header className="fixed-nav bg-background shadow-lg transition-all duration-300">
      {/* Desktop Navigation */}
      <div className="mx-10 hidden py-2 text-2xl md:block">
        <nav className="my-4 flex items-center justify-between">
          <a href="/">
            <h1 className="font-bold">LOGO</h1>
          </a>
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={activePath === item.href}
                testId={`nav-link-${item.label}`}
              >
                {item.label}
              </NavLink>
            ))}
            <li>
              <ThemeToggle data-testid="theme-toggle-desktop" />
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  );
}
