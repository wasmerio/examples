import { For } from "solid-js";
import type { Accessor } from "solid-js";
import type { CollectionEntry } from "astro:content";
import { BlogCard } from "@/components/blog/BlogCard";
import { FilterTagList } from "@/components/blog/FilterTagList";

interface Props {
  initialPosts: CollectionEntry<"blog">[];
  allTags: string[];
  selectedTagsSignal: Accessor<string[]>;
  isAllSelectedSignal: Accessor<boolean>;
  onTagToggle: (tag: string) => void;
}

export default function BlogList(props: Props) {
  return (
    <div class="space-y-8 md:space-y-0">
      {/* Mobile filter */}
      <div class="md:hidden">
        <FilterTagList
          tags={props.allTags}
          selectedTagsSignal={props.selectedTagsSignal}
          isAllSelectedSignal={props.isAllSelectedSignal}
          onTagToggle={props.onTagToggle}
        />
      </div>

      {/* Blog list */}
      <div class="grid grid-cols-1 gap-6">
        <For each={props.initialPosts}>
          {(post) => <BlogCard post={post} />}
        </For>
      </div>
    </div>
  );
}
