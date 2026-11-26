import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Github,
  Linkedin,
  BookOpenText,
  Hash,
  Heart,
  Mail,
  ExternalLink,
  Twitter,
  Link2,
  GraduationCap
} from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    href: siteConfig.social.github,
    icon: Github,
    label: "Follow on GitHub"
  },
  {
    name: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin,
    label: "Connect on LinkedIn"
  },
  {
    name: "X / Twitter",
    href: siteConfig.social.twitter,
    icon: Twitter,
    label: "Follow on X"
  },
  {
    name: "Medium",
    href: siteConfig.social.medium,
    icon: BookOpenText,
    label: "Read on Medium"
  },
  {
    name: "Hashnode",
    href: siteConfig.social.hashnode,
    icon: Hash,
    label: "Read on Hashnode"
  },
  {
    name: "ORCID",
    href: siteConfig.social.orcid,
    icon: GraduationCap,
    label: "View ORCID Profile"
  },
  {
    name: "Linktree",
    href: siteConfig.social.linktree,
    icon: Link2,
    label: "All Links"
  }
];

const navLinks = siteConfig.navigation.main;
const legalLinks = siteConfig.navigation.footer.filter(
  (link) => !link.href.startsWith("mailto:")
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-50 border-t bg-background w-full overflow-hidden" suppressHydrationWarning={true}>
      <div className="container max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <a
                href="/"
                className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
              >
                {siteConfig.author.name}
              </a>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {siteConfig.author.bio}
              </p>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={`mailto:${siteConfig.author.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {siteConfig.author.email}
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.social.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    muhammadfiaz.com
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center flex-wrap justify-center sm:justify-start gap-2"
          >
            <TooltipProvider>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Tooltip key={social.name}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "p-2 rounded-lg text-muted-foreground",
                          "hover:text-primary hover:bg-primary/10",
                          "transition-colors"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{social.name}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{social.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full"
              asChild
            >
              <a
                href={siteConfig.social.donate}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart className="h-4 w-4 text-red-500" />
                Support my work
              </a>
            </Button>

            <span className="text-sm text-muted-foreground">
              © {currentYear} {siteConfig.author.name}. All rights reserved.
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
