import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="container w-full max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        {/* Large 404 */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-primary/20 select-none leading-none"
        >
          404
        </motion.h1>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-6 max-w-lg mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist or has been moved.
            Double-check the URL or navigate back home.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center"
          >
            <Button
              size="lg"
              className="rounded-full shadow-lg gap-2"
              asChild
            >
              <a href="/">
                <Home className="h-4 w-4" />
                Return Home
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2"
              asChild
            >
              <a href="/projects">
                <Search className="h-4 w-4" />
                Browse Projects
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Navigation hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs sm:text-sm text-muted-foreground/60"
        >
          Or go back to the{" "}
          <a href="javascript:history.back()" className="text-primary hover:underline">
            previous page
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
