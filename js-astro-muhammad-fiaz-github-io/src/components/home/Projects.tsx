import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fetchUserRepositories,
  getLanguageColor,
  formatRelativeTime,
  formatNumber,
  type GitHubRepository
} from "@/lib/github";
import { useProjectsStore } from "@/store/projectsStore";
import { siteConfig } from "@/site.config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Star,
  GitFork,
  Github,
  FileText,
  Archive,
  GitPullRequest,
  ArrowRight
} from "lucide-react";

const HOME_PROJECTS_LIMIT = 6;

function ProjectCardSkeleton() {
  return (
    <Card className="h-full flex flex-col animate-pulse bg-card/50 backdrop-blur-sm rounded-[14px]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-4/5 mt-1" />
      </CardHeader>
      <CardContent className="flex-1 pt-2 space-y-3">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/30 pt-3 pb-4 px-6 gap-2">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  );
}

function ProjectCard({
  repo,
  index
}: {
  repo: GitHubRepository;
  index: number;
}) {
  const langColor = getLanguageColor(repo.language);
  const docsUrl = repo.homepage || `${repo.html_url}#readme`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full flex flex-col transition-all duration-300 rounded-[14px]",
          "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
          "border-border/50 bg-card/50 backdrop-blur-sm",
          "ring-offset-background",
          "hover:border-primary/50",
          repo.archived && "opacity-70"
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-start gap-2">
            <span className="break-words font-bold tracking-tight text-lg leading-tight">
              {repo.name}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {repo.fork && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Forked repository</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {repo.archived && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Archive className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>Archived repository</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardTitle>
          <CardDescription className="text-sm pt-2 min-h-[3rem] line-clamp-2 text-muted-foreground/90 leading-relaxed">
            {repo.description || "No description available"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pt-2 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {repo.language && (
              <Badge
                variant="secondary"
                className="font-normal gap-1.5 pr-2.5 text-xs"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                {repo.language}
              </Badge>
            )}
            {repo.topics?.slice(0, 2).map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="font-normal text-xs"
              >
                {topic}
              </Badge>
            ))}
            {(repo.topics?.length || 0) > 2 && (
              <Badge variant="outline" className="font-normal text-xs">
                +{repo.topics!.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
                  <Star className="h-3.5 w-3.5" />
                  <span>{formatNumber(repo.stargazers_count)}</span>
                </TooltipTrigger>
                <TooltipContent>
                  {repo.stargazers_count.toLocaleString()} stars
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <GitFork className="h-3.5 w-3.5" />
                  <span>{formatNumber(repo.forks_count)}</span>
                </TooltipTrigger>
                <TooltipContent>
                  {repo.forks_count.toLocaleString()} forks
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70">
              {formatRelativeTime(repo.updated_at)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-3 pb-4 px-6 border-t border-border/30 gap-2 flex-wrap">
          <Button
            variant="default"
            size="sm"
            className="flex-1 min-w-[100px] gap-2 text-xs"
            asChild
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
              <span className="sm:hidden">Code</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 min-w-[100px] gap-2 text-xs"
            asChild
          >
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Docs</span>
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function Projects() {
  const {
    isLoading,
    error,
    setRepositories,
    setLoading,
    setError,
    setLastFetched,
    shouldRefetch,
    repositories
  } = useProjectsStore();

  React.useEffect(() => {
    async function fetchRepos() {
      if (!shouldRefetch() && repositories.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedRepos = await fetchUserRepositories(
          siteConfig.github.username
        );
        setRepositories(fetchedRepos);
        setLastFetched(Date.now());
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch repositories"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const topProjects = React.useMemo(() => {
    return repositories
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, HOME_PROJECTS_LIMIT);
  }, [repositories]);

  return (
    <div className="space-y-8 w-full">
      {isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: HOME_PROJECTS_LIMIT }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-center"
        >
          <p className="text-destructive text-sm">{error}</p>
        </motion.div>
      )}

      {!isLoading && !error && topProjects.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {topProjects.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center pt-4"
          >
            <Button
              variant="outline"
              size="lg"
              className="gap-2 group"
              asChild
            >
              <a href="/projects">
                View All Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>
        </>
      )}

      {!isLoading && !error && topProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No projects available yet.</p>
        </motion.div>
      )}
    </div>
  );
}
