
import { motion } from "framer-motion";
import { siteConfig } from "@/site.config";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

export function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center py-16 sm:py-20 lg:py-24 relative bg-muted/20 w-full overflow-hidden"
      suppressHydrationWarning={true}
    >
      <div className="container w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 sm:px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs sm:text-sm font-medium"
          >
            About Me
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          >
            Hi, I'm {siteConfig.author.name}. <br className="hidden sm:block" />
            <span className="text-muted-foreground">
              Product-focused builder & open-source maintainer.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl"
          >
            <p>{siteConfig.author.bio}</p>
            <p>
              I don't just write code; I build ecosystems. From maintaining
              open-source libraries to developing AI-driven applications, my focus 
              is on creating developer tooling that stands the test of time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 sm:gap-4 pt-4"
          >
            <Button className="rounded-full gap-2 group" asChild>
              <a href="/about">
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="outline" className="rounded-full gap-2" asChild>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Connect on LinkedIn
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
