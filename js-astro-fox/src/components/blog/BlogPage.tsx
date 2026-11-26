import { createSignal, createEffect } from "solid-js";
import BlogList from "@/components/blog/BlogList";
import { FilterTagList } from "@/components/blog/FilterTagList";
import type { CollectionEntry } from "astro:content";

interface BlogPageProps {
  posts: CollectionEntry<"blog">[];
  allTags: string[];
}

export default function BlogPage(props: BlogPageProps) {
  const sortedPosts = props.posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const [selectedTags, setSelectedTags] = createSignal<string[]>([]);
  const [filteredPosts, setFilteredPosts] = createSignal(sortedPosts);

  const isAllSelected = () => selectedTags().length === props.allTags.length;

  const handleTagToggle = (tag: string) => {
    if (tag === "all") {
      if (isAllSelected()) {
        setSelectedTags([]);
      } else {
        setSelectedTags([...props.allTags]);
      }
    } else {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    }
  };

  createEffect(() => {
    const tags = selectedTags();
    if (tags.length === 0 || isAllSelected()) {
      setFilteredPosts(sortedPosts);
    } else {
      setFilteredPosts(
        sortedPosts.filter((post) =>
          tags.every((tag) => post.data.tags.includes(tag)),
        ),
      );
    }
  });

  return (
    <div class="flex flex-col md:flex-row gap-6">
      <aside class="hidden md:block w-64 shrink-0">
        <FilterTagList
          tags={props.allTags}
          selectedTagsSignal={selectedTags}
          isAllSelectedSignal={isAllSelected}
          onTagToggle={handleTagToggle}
        />
      </aside>
      <main class="flex-1">
        <BlogList
          initialPosts={filteredPosts()}
          allTags={props.allTags}
          selectedTagsSignal={selectedTags}
          isAllSelectedSignal={isAllSelected}
          onTagToggle={handleTagToggle}
        />
      </main>
    </div>
  );
}
