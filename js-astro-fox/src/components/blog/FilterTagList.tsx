import { For, type Accessor } from "solid-js";

interface FilterTagListProps {
  tags: string[];
  selectedTagsSignal: Accessor<string[]>;
  isAllSelectedSignal: Accessor<boolean>;
  onTagToggle: (tag: string) => void;
}

export function FilterTagList(props: FilterTagListProps) {
  const { tags, selectedTagsSignal, isAllSelectedSignal, onTagToggle } = props;

  return (
    <div class="flex flex-col space-y-4 p-4  bg-gray-50/50 dark:bg-gray-800 rounded-lg shadow-sm">
      <button
        onClick={() => {
          onTagToggle("all");
        }}
        class={`text-left font-bold transition-colors ${
          isAllSelectedSignal()
            ? "text-slate-800 dark:text-slate-200"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        All
      </button>

      <div class="flex flex-col space-y-2">
        <For each={tags}>
          {(tag) => (
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTagsSignal().includes(tag)}
                onChange={() => onTagToggle(tag)}
                class="form-checkbox h-4 w-4 rounded accent-slate-600"
              />
              <span
                class={`text-sm font-medium transition-colors ${
                  selectedTagsSignal().includes(tag)
                    ? "text-slate-800 dark:text-slate-200"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tag}
              </span>
            </label>
          )}
        </For>
      </div>
    </div>
  );
}
