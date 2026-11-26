"use client";
import { siteConfig } from "@/site.config";
import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AdUnit } from "@/components/ui/AdUnit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Tag,
  BookOpen,
  Sparkles,
  Search,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  author: string;
  tags: string[];
  readingTime: number;
}

interface BlogPageProps {
  posts: BlogPost[];
  allTags: string[];
}

const POSTS_PER_PAGE = 6;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-");
}

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

export function BlogPage({ posts, allTags }: BlogPageProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");
  const [isTagsExpanded, setIsTagsExpanded] = React.useState(false);

  const TAGS_DISPLAY_LIMIT = 10;

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    let result = [...posts];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((post) => post.tags?.includes(selectedTag));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [posts, searchQuery, selectedTag, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() || selectedTag || sortBy !== "newest";

  const pagesToShow = React.useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="container w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 sm:mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Blog</h1>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Writing about software development, system design, AI/ML, and the latest tech trends.
        </p>
      </motion.header>

      {/* Search, Sort, and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6 space-y-4"
      >
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                {sortBy.includes("asc") ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              className="rounded-full h-8 shrink-0"
              onClick={() => {
                setSelectedTag(null);
                setCurrentPage(1);
              }}
            >
              All Posts
            </Button>
            {(isTagsExpanded ? allTags : allTags.slice(0, TAGS_DISPLAY_LIMIT)).map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                className="rounded-full h-8 gap-1.5 shrink-0"
                onClick={() => handleTagClick(tag)}
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Button>
            ))}
            {allTags.length > TAGS_DISPLAY_LIMIT && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 text-xs shrink-0"
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
              >
                {isTagsExpanded ? "Show Less" : `+${allTags.length - TAGS_DISPLAY_LIMIT} more`}
              </Button>
            )}
          </div>
        )}

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredPosts.length} of {posts.length} posts
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {currentPosts.length > 0 ? (
          <motion.div
            key={`page-${currentPage}-${selectedTag}-${searchQuery}-${sortBy}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 sm:space-y-6"
          >
            {currentPosts.map((post, index) => {
              const isFirst = index === 0 && currentPage === 1 && !selectedTag && !searchQuery;

              return (
                <React.Fragment key={post.id}>
                  <motion.article variants={itemVariants}>
                    <a href={`/blog/${post.id}`} className="block group">
                      <Card
                        className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 ${
                          isFirst
                            ? "ring-1 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
                            : "bg-card/50 backdrop-blur-sm"
                        }`}
                      >
                        <CardHeader className="pb-2 sm:pb-3">
                          {isFirst && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-1.5 mb-2"
                            >
                              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Latest Post
                              </span>
                            </motion.div>
                          )}

                          <CardTitle
                            className={`group-hover:text-primary transition-colors leading-tight ${
                              isFirst
                                ? "text-xl sm:text-2xl lg:text-3xl"
                                : "text-lg sm:text-xl lg:text-2xl"
                            }`}
                          >
                            {post.title}
                          </CardTitle>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground pt-2">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <time dateTime={post.pubDate.toString()}>
                                {new Date(post.pubDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{post.readingTime} min read</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div
                              className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
                              onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = `/authors/${slugify(post.author)}`;
                              }}
                            >
                              <User className="h-3.5 w-3.5" />
                              <span>{post.author}</span>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0 pb-4 sm:pb-6">
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {post.tags.slice(0, 4).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 4 && (
                                <Badge variant="outline" className="text-[10px] sm:text-xs">
                                  +{post.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}

                          {post.description && (
                            <CardDescription
                              className={`leading-relaxed ${
                                isFirst
                                  ? "text-sm sm:text-base line-clamp-3"
                                  : "text-xs sm:text-sm line-clamp-2"
                              }`}
                            >
                              {post.description}
                            </CardDescription>
                          )}

                          <div className="flex items-center pt-3 sm:pt-4">
                            <span className="text-xs sm:text-sm font-medium text-primary group-hover:underline inline-flex items-center gap-1">
                              Read article
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.article>
                  {(index + 1) % 6 === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 w-full overflow-hidden"
                    >
                        {/* Desktop Ad */}
                        {/*
                        <div className="hidden sm:block w-full">
                          <AdUnit
                            slot={siteConfig.adsense.slots.inFeed.main.id}
                            layoutKey={siteConfig.adsense.slots.inFeed.main.layoutKey}
                            format="fluid"
                            className="w-full"
                            style={{ display: 'block', width: '100%' }}
                            fullWidthResponsive={true}
                          />
                        </div>
                        */}
                        {/* Mobile Ad */}
                        {/*
                        <div className="sm:hidden w-full">
                          <AdUnit
                            slot={siteConfig.adsense.slots.multiplex.main}
                            format="rectangle"
                            className="w-full"
                            style={{ display: 'block', width: '100%' }}
                            fullWidthResponsive={true}
                          />
                        </div>
                        */}
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 sm:py-16 lg:py-20 text-muted-foreground"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-sm mb-4">
              {searchQuery
                ? `No posts matching "${searchQuery}".`
                : selectedTag
                  ? `No posts with tag "${selectedTag}".`
                  : "Check back later for new articles!"}
            </p>
            {(searchQuery || selectedTag) && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50"
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1">
            {pagesToShow.map((page, index) =>
              typeof page === "string" ? (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  {page}
                </span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 p-0"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.nav>
      )}

      {filteredPosts.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs sm:text-sm text-muted-foreground mt-4"
        >
          {totalPages > 1 && `Page ${currentPage} of ${totalPages} • `}
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
          {selectedTag && ` tagged "${selectedTag}"`}
        </motion.p>
      )}
    </div>
  );
}
