import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site.config";
import { ArrowRight, Mail } from "lucide-react";

// Animation variants for staggered children
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      delay: 0.1,
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const socialIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  hover: {
    scale: 1.2,
    y: -3,
    transition: { duration: 0.2 },
  },
};

interface HeroProps {
  avatarSrc?: string;
}

export function Hero({ avatarSrc }: HeroProps) {
  const [roleIndex, setRoleIndex] = React.useState(0);
  const roles = siteConfig.author.roles;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex flex-col justify-center items-center overflow-hidden z-0 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20"
    >
      {/* Background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"
      />

      {/* Animated background circles */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-60 h-60 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] rounded-full bg-primary blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ delay: 1, duration: 2, ease: "easeOut" }}
          className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-60 h-60 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] rounded-full bg-secondary blur-3xl"
        />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8"
      >
        {/* Profile Image */}
        <motion.div variants={imageVariants} whileHover="hover" className="mb-6 sm:mb-8">
          <div className="relative">
            {/* Decorative rings */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 -m-2 sm:-m-3 md:-m-4 rounded-2xl border border-primary/20"
            />
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-0 -m-4 sm:-m-5 md:-m-6 rounded-2xl border border-primary/10"
            />

            {/* Main image container */}
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-primary/20 to-secondary/20 backdrop-blur-sm">
              <img
                src={avatarSrc || siteConfig.author.avatar}
                alt={siteConfig.author.name}
                width="180"
                height="180"
                loading="eager"
                decoding="async"
                className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-2xl object-cover border-4 border-background shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Greeting Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Available for collaborations
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-2 sm:mb-3"
        >
          {siteConfig.author.name}
        </motion.h1>

        {/* Animated Role */}
        <div className="h-8 sm:h-9 md:h-10 relative w-full mb-3 sm:mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={roles[roleIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-x-0 text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-primary"
            >
              {roles[roleIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bio */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl leading-relaxed mb-3 sm:mb-4"
        >
          {siteConfig.author.bio}
        </motion.p>

        {/* Location */}
        <motion.p
          variants={itemVariants}
          className="text-xs sm:text-sm text-muted-foreground/80 flex items-center justify-center gap-1.5 mb-5 sm:mb-6"
        >
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"
          />
          Based in {siteConfig.author.location.country}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full sm:w-auto"
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              size="lg"
              className="rounded-full px-6 sm:px-8 text-sm sm:text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow w-full sm:w-auto"
              asChild
            >
              <a href="/works" className="flex items-center gap-2">
                View Works
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
              asChild
            >
              <a href={`mailto:${siteConfig.author.email}`} className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Me
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={containerVariants}
          className="flex items-center justify-center gap-4 sm:gap-5"
        >
          <motion.a
            variants={socialIconVariants}
            whileHover="hover"
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="GitHub"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </motion.a>
          <motion.a
            variants={socialIconVariants}
            whileHover="hover"
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="LinkedIn"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </motion.a>
          <motion.a
            variants={socialIconVariants}
            whileHover="hover"
            href={siteConfig.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="Twitter/X"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
