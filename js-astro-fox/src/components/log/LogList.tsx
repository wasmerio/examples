import { For, createEffect, createSignal } from "solid-js";
import type { CollectionEntry } from "astro:content";
import { Tag } from "@/components/common/Tag";

interface Props {
  initialLogs: CollectionEntry<"log">[];
  categories: string[];
}

export default function LogList(props: Props) {
  const [selectedCategory, setSelectedCategory] = createSignal<string>("all");
  const [filteredLogs, setFilteredLogs] = createSignal(props.initialLogs);

  createEffect(() => {
    const category = selectedCategory();
    if (category === "all") {
      setFilteredLogs(props.initialLogs);
      return;
    }
    const filtered = props.initialLogs.filter(
      (log) => log.data.category === category,
    );
    setFilteredLogs(filtered);
  });

  return (
    <div class="flex flex-col gap-6">
      <div class="flex gap-4 border-b border-slate-200 dark:border-slate-700">
        <button
          class={`px-4 py-2 text-sm transition-colors relative group ${
            selectedCategory() === "all"
              ? "text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All
          {selectedCategory() === "all" ? (
            <div class="absolute bottom-0 left-0 w-full h-0.5 hover-underline"></div>
          ) : (
            <div class="absolute bottom-0 left-0 w-full h-0.5 border-black"></div>
          )}
        </button>
        <For each={props.categories}>
          {(category) => (
            <button
              class={`px-4 py-2 text-sm transition-colors relative group ${
                selectedCategory() === category
                  ? "text-black dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {selectedCategory() === category ? (
                <div class="absolute bottom-0 left-0 w-full h-0.5 hover-underline"></div>
              ) : (
                <div class="absolute bottom-0 left-0 w-full h-0.5 hover-underline opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          )}
        </For>
      </div>

      <div>
        <For each={filteredLogs()}>
          {(log) => (
            <a
              href={`/log/${log.slug}`}
              class="block group space-y-4 hover:no-underline hover-lift"
              aria-labelledby={`log-title-${log.slug}`}
            >
              <div class="flex justify-between items-baseline">
                <h3
                  id={`log-title-${log.slug}`}
                  class="text-lg font-medium text-slate-800 dark:text-slate-200 transition-colors"
                >
                  {log.data.title}
                </h3>
                <time
                  class="text-sm text-slate-400"
                  datetime={log.data.date.toISOString()}
                >
                  {new Date(log.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              {log.data.tags?.map((tag) => <Tag>{tag}</Tag>)}
              <div class="prose prose-slate max-w-none"></div>
            </a>
          )}
        </For>
      </div>
    </div>
  );
}
