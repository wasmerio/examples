import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";
import {
  fetchWakaTimeStats,
  getWakaTimeLanguageColor,
  type WakaTimeStats,
} from "@/lib/wakatime";
import { Skeleton } from "@/components/ui/skeleton";
import {

  BarChart3,
  Layers,
  Users,
  Cpu,
  Sparkles,
  GitBranch,
  Clock,
} from "lucide-react";

// Language Bar Chart Component
function LanguageChart({
  languages,
}: {
  languages: { name: string; percent: number; text: string }[];
}) {
  return (
    <div className="space-y-3">
      {languages.slice(0, 5).map((lang, index) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-xs">
            <span className="font-medium">{lang.name}</span>
            <span className="text-muted-foreground">{lang.text}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lang.percent}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="h-full rounded-full"
              style={{ backgroundColor: getWakaTimeLanguageColor(lang.name) }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Coding Stats Card
// Coding Stats Card
function CodingStatsCard({
  stats,
  isLoading,
}: {
  stats: WakaTimeStats | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/50",
          "bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6",
          "sm:col-span-2 lg:col-span-2"
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50",
        "bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        "sm:col-span-2 lg:col-span-2"
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-blue-500" />
        <span className="text-sm font-medium text-muted-foreground">
          WakaTime - {stats?.range.text || "Last 7 Days"}
        </span>
      </div>

      {stats && <LanguageChart languages={stats.languages} />}

      <a
        href={`https://wakatime.com/@${siteConfig.wakatime.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-4"
      >
        View on WakaTime →
      </a>
    </motion.div>
  );
}

// Stats Summary Card
function StatsSummaryCard({
  stats,
  isLoading,
}: {
  stats: WakaTimeStats | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/50",
          "bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6"
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50",
        "bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      )}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center group-hover:scale-105 transition-transform duration-300">
          <div className="text-3xl sm:text-4xl font-bold text-green-500">
            {stats?.totalHours || 0}+
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Hours Coded
          </div>
        </div>
        <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-75">
          <div className="text-3xl sm:text-4xl font-bold text-emerald-500">
            {stats?.languages.length || 0}+
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Languages
          </div>
        </div>
        <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-100">
          <div className="text-3xl sm:text-4xl font-bold text-teal-500">50+</div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Projects
          </div>
        </div>
        <div className="text-center group-hover:scale-105 transition-transform duration-300 delay-150">
          <div className="text-3xl sm:text-4xl font-bold text-cyan-500">∞</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Coffee</div>
        </div>
      </div>
    </motion.div>
  );
}

// Bento Grid Item Props
interface BentoItemProps {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  gradient?: string;
  delay?: number;
}

// Single Bento Grid Item
function BentoItem({
  title,
  description,
  icon: Icon,
  className,
  gradient = "from-primary/10 to-secondary/10",
  delay = 0,
}: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50",
        "bg-card/50 backdrop-blur-sm p-6",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300",
        className
      )}
    >
      {/* Background gradient on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500",
          "bg-gradient-to-br",
          gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div
          className={cn(
            "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
            "bg-gradient-to-br",
            gradient
          )}
        >
          <Icon className="h-6 w-6 text-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// Featured Highlight Card
function HighlightCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50",
        "bg-card/50 backdrop-blur-sm p-6",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300"
      )}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium text-muted-foreground">
            Currently Building
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2">
          Next-Gen Dev Tools
        </h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          High-performance libraries in Zig, Rust, and TypeScript pushing
          boundaries.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">
            Zig
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
            TypeScript
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-orange-600/20 text-orange-500">
            Rust
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  const [wakaTimeStats, setWakaTimeStats] = React.useState<WakaTimeStats | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStats() {
      try {
        const stats = await fetchWakaTimeStats();
        setWakaTimeStats(stats);
      } catch (error) {
        console.error("Failed to load WakaTime stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What I Do
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Crafting exceptional digital experiences through code, creativity,
            and continuous learning.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Row 1 */}
          {/* Row 1 */}
          {/* Row 1 */}
          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border/50",
              "bg-card/50 backdrop-blur-sm p-6",
              "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
              "transition-all duration-300",
              "sm:col-span-2"
            )}
          >
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500",
                "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
              )}
            />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl",
                    "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                  )}
                >
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                    {isLoading ? (
                      <Skeleton className="h-10 w-32 ml-auto" />
                    ) : (
                      wakaTimeStats?.totalText || "0 hrs"
                    )}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Last 7 Days Coding Total Time • {wakaTimeStats?.dailyAverage || "0 hrs"}/day avg
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  Coding Activity
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Architecting and building scalable software solutions with a focus on code quality and performance.
                </p>
              </div>
            </div>
          </motion.div>

          <CodingStatsCard stats={wakaTimeStats} isLoading={isLoading} />

          {/* Row 2 */}
          <StatsSummaryCard stats={wakaTimeStats} isLoading={isLoading} />
          <HighlightCard delay={0.3} />
          <BentoItem
            title="Open Source"
            description="Contributing to and maintaining open-source projects that help developers worldwide."
            icon={GitBranch}
            gradient="from-green-500/20 to-emerald-500/20"
            delay={0.35}
            className="sm:col-span-2"
          />

          {/* Row 3 */}
          <BentoItem
            title="AI/ML Engineering"
            description="Implementing ML solutions and intelligent automation systems."
            icon={Sparkles}
            gradient="from-purple-500/20 to-pink-500/20"
            delay={0.4}
          />
          <BentoItem
            title="Systems Programming"
            description="Low-level dev with Zig and Rust for maximum performance."
            icon={Cpu}
            gradient="from-orange-500/20 to-red-500/20"
            delay={0.45}
          />
          <BentoItem
            title="DevOps & CI/CD"
            description="Automating workflows and deployments for seamless DX."
            icon={Layers}
            gradient="from-indigo-500/20 to-violet-500/20"
            delay={0.5}
          />
          <BentoItem
            title="Engineering Philosophy"
            description="Choosing the right tool for each problem, never locking into a single stack."
            icon={Users}
            gradient="from-teal-500/20 to-cyan-500/20"
            delay={0.55}
          />
        </div>
      </div>
    </section>
  );
}
