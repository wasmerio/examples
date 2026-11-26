import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fetchUserRepositories,
  getLanguageColor,
  formatRelativeTime,
  formatNumber,
  type GitHubRepository
} from "@/lib/github";
import {
  useProjectsStore,
  usePaginatedRepositories,
  useRepositoryStats
} from "@/store/projectsStore";
import { siteConfig } from "@/site.config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdUnit } from "@/components/ui/AdUnit";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Filter,
  X,
  BookOpen,
  Code2,
  TrendingUp,
  SortAsc,
  SortDesc,
  LayoutGrid,
  List,
  Github,
  Archive,
  GitPullRequest,
  FileText
} from "lucide-react";

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

function StatsCard({
  icon: Icon,
  label,
  value,
  gradient
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-4 sm:p-6",
        "bg-gradient-to-br",
        gradient
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="rounded-lg bg-white/20 p-2 sm:p-3 backdrop-blur-sm">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-medium text-white/80">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10">
        <Icon className="h-24 w-24 sm:h-32 sm:w-32" />
      </div>
    </motion.div>
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

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="rounded-full bg-muted p-6 mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No projects found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any projects matching your filters. Try adjusting your
        search or filters.
      </p>
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Reset Filters
      </Button>
    </motion.div>
  );
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("ellipsis");
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }
    
    pages.push(totalPages);
  }
  
  return pages;
}

export function ProjectsPageContent({
  initialRepositories = []
}: {
  initialRepositories?: GitHubRepository[];
}) {
  const {
    isLoading,
    error,
    filters,
    currentPage,
    perPage,
    setRepositories,
    setLoading,
    setError,
    setLastFetched,
    setSearch,
    setLanguage,
    setSort,
    toggleSortDirection,
    setShowForks,
    setShowArchived,
    resetFilters,
    setCurrentPage,
    setPerPage,
    shouldRefetch,
    repositories
  } = useProjectsStore();

  const repoOverride = repositories.length > 0 ? undefined : initialRepositories;
  const { repos, totalCount, totalPages, hasNextPage, hasPrevPage } =
    usePaginatedRepositories(repoOverride);
  const stats = useRepositoryStats(repoOverride);

  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchInputValue, setSearchInputValue] = React.useState(filters.search);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const uniqueLanguages = React.useMemo(() => {
    const source = repoOverride || repositories;
    const langs = new Set<string>();
    source.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [repoOverride, repositories]);

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    setIsSearching(true);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(value);
      setIsSearching(false);
    }, 300);
  };

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    async function fetchRepos() {
      if (initialRepositories.length > 0 && repositories.length === 0) {
        setRepositories(initialRepositories);
        setLastFetched(Date.now());
        setLoading(false);
        return;
      }

      if (!shouldRefetch() && repositories.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedRepos = await fetchUserRepositories(siteConfig.github.username);
        setRepositories(fetchedRepos);
        setLastFetched(Date.now());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedRepos = await fetchUserRepositories(siteConfig.github.username, true);
      setRepositories(fetchedRepos);
      setLastFetched(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="min-h-screen">
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              All Projects
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all my open-source projects, libraries, and tools including forks. 
              From developer utilities to AI/ML applications.
            </p>
          </motion.div>

          {!isLoading && !error && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <StatsCard
                icon={BookOpen}
                label="Total Repositories"
                value={stats.totalRepos}
                gradient="from-blue-500 to-blue-600"
              />
              <StatsCard
                icon={Star}
                label="Total Stars"
                value={formatNumber(stats.totalStars)}
                gradient="from-yellow-500 to-orange-500"
              />
              <StatsCard
                icon={GitFork}
                label="Total Forks"
                value={formatNumber(stats.totalForks)}
                gradient="from-green-500 to-emerald-600"
              />
              <StatsCard
                icon={Code2}
                label="Top Language"
                value={stats.topLanguage}
                gradient="from-purple-500 to-pink-500"
              />
            </div>
          )}
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-[14px] border border-border/50 p-4 sm:p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-opacity",
                    isSearching && "animate-pulse"
                  )} />
                  <Input
                    type="search"
                    placeholder="Search projects by name, description, or topic..."
                    value={searchInputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 w-full"
                  />
                  {searchInputValue && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => {
                        setSearchInputValue("");
                        setSearch("");
                        setIsSearching(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filters.language || "all"}
                    onValueChange={(val) => setLanguage(val === "all" ? "" : val)}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[160px]">
                      <Code2 className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {uniqueLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: getLanguageColor(lang) }}
                            />
                            {lang}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.sort}
                    onValueChange={(val) => setSort(val as typeof filters.sort)}
                  >
                    <SelectTrigger className="w-[140px] sm:w-[160px]">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="forks">Forks</SelectItem>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSortDirection}
                    className="hidden sm:flex"
                  >
                    {filters.direction === "desc" ? (
                      <SortDesc className="h-4 w-4" />
                    ) : (
                      <SortAsc className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(showFilters && "bg-accent")}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>

                  <div className="hidden lg:flex border-l pl-2 gap-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="show-forks"
                          checked={filters.showForks}
                          onCheckedChange={setShowForks}
                        />
                        <Label htmlFor="show-forks" className="text-sm cursor-pointer">
                          Show Forks
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="show-archived"
                          checked={filters.showArchived}
                          onCheckedChange={setShowArchived}
                        />
                        <Label htmlFor="show-archived" className="text-sm cursor-pointer">
                          Show Archived
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="text-muted-foreground"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-32 inline-block" />
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {repos.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {totalCount}
                  </span>{" "}
                  projects
                </>
              )}
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={perPage.toString()}
                onValueChange={(val) => setPerPage(parseInt(val))}
              >
                <SelectTrigger className="w-[80px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground hidden sm:inline">per page</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="gap-2 ml-2"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isLoading && "animate-spin")}
                />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mb-6"
            >
              <p className="text-destructive text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-2"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {(isLoading || isSearching) && (
            <div
              className={cn(
                "grid gap-4 sm:gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && !isSearching && !error && repos.length === 0 && (
            <EmptyState onReset={resetFilters} />
          )}

          {!isLoading && !isSearching && !error && repos.length > 0 && (
            <>
              <motion.div
                layout
                className={cn(
                  "grid gap-4 sm:gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                <AnimatePresence mode="popLayout">
                  {repos.flatMap((repo, index) => {
                    const elements = [
                      <ProjectCard key={repo.id} repo={repo} index={index} />
                    ];
                    
                    if ((index + 1) % 6 === 0) {
                      elements.push(
                        <motion.div
                          key={`ad-unit-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="col-span-1 sm:col-span-2 lg:col-span-3 py-4 w-full"
                        >
                          {/* Standard AdUnit for Desktop */}
                          {/*
                          <div className="hidden sm:block w-full max-w-full overflow-hidden">
                           <AdUnit
                             slot={siteConfig.adsense.slots.inFeed.main.id}
                             layoutKey={siteConfig.adsense.slots.inFeed.main.layoutKey}
                             format="fluid"
                             style={{ display: 'block', width: '100%', maxWidth: '100%' }}
                             fullWidthResponsive={true}
                           />
                          </div>
                          */}
                          {/* Mobile Ad */}
                          {/*
                          <div className="sm:hidden w-full max-w-full overflow-hidden">
                            <AdUnit
                              slot={siteConfig.adsense.slots.multiplex.main}
                              format="rectangle"
                              style={{ display: 'block', width: '100%', maxWidth: '100%' }}
                              fullWidthResponsive={true}
                            />
                          </div>
                          */}
                        </motion.div>
                      );
                    }
                    
                    return elements;
                  })}
                </AnimatePresence>
              </motion.div>

              {totalPages > 1 && (
                <div className="mt-8 sm:mt-12 pt-6 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (hasPrevPage) setCurrentPage(currentPage - 1);
                          }}
                          className={cn(!hasPrevPage && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                      
                      {pageNumbers.map((page, index) => (
                        <PaginationItem key={index}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (hasNextPage) setCurrentPage(currentPage + 1);
                          }}
                          className={cn(!hasNextPage && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="gap-2 rounded-full"
              asChild
            >
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                View GitHub Profile
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
