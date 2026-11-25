<script lang="ts">
  import { BASE } from "../../config.ts";

  import { fade, slide } from "svelte/transition";
  import type { Pagefind } from "vite-plugin-pagefind/types";
  import { showSearch } from "./CommandPaletteStore";

  export let showResults = true;

  export let placeholder = "Search...";

  export let results: { title: string; content: string; href: string }[] = [
    {
      title: "Title",
      content:
        "This is some longer content that will probably have to be cut at some point, because it just wont fit but such is life, what can you do? nothing. i mean i guess you could scroll? but that would look ugly",
      href: "/",
    },
    { title: "Title", content: "Content", href: "/" },
  ];

  export let noResults = "No results found";

  let currentSelection = 0;

  let search = async () => {
    if (value.trim() == "") return;

    const search = await pagefind.debouncedSearch(value);
    if (!search) return;

    showResults = true;
    results = [];

    let newResults = [];

    for (let i = 0; i < search.results.length && i < 5; i++) {
      let result = await search.results[i].data();

      let excerpt = result.excerpt;
      // replace <mark> tags with <span class="bg-pink-600/10">
      excerpt = excerpt.replaceAll(
        "<mark>",
        '<span class="bg-accent-500/20 rounded-md p-0.5">'
      );
      excerpt = excerpt.replaceAll("</mark>", "</span>");

      newResults[i] = {
        title: result.meta.title,
        content: excerpt,
        href: result.url,
      };
    }

    results = Object.values(newResults);
  };

  export let value: string = "";

  export const show = () => {
    $showSearch = true;
    setTimeout(() => {
      input.focus();
    }, 200);
  };

  let pagefind: Pagefind;
  async function setupSearch() {
    try {
      // @ts-ignore
      pagefind = await import(/* @vite-ignore */
        BASE + "/pagefind/pagefind.js"
      );
    } catch (error) {
      console.error("Pagefind module not found, will retry after build");
    }
  }

  setupSearch();

  let input: HTMLInputElement;

  $: if (value.trim() == "") {
    results = [];
    showResults = false;
  } else {
    search();
  }

  $: if ($showSearch) {
    currentSelection = 0;

    setTimeout(() => {
      input.focus();
    }, 200);
  } else {
    value = "";
  }
</script>

<svelte:window
  on:keydown={(event) => {
    // show/hide on command + k
    if (event.key == "k" && event.metaKey) {
      $showSearch = !$showSearch;

      event.preventDefault();
    }

    // close on escape
    if (event.key === "Escape" && $showSearch) {
      $showSearch = false;
    }
  }}
/>

{#if $showSearch}
  <div
    class="relative z-50"
    role="dialog"
    aria-modal="true"
    transition:fade={{ duration: 100 }}
  >
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 pt-20 md:p-20">
      <button
        on:click={() => ($showSearch = false)}
        class="fixed inset-0 bg-base-500/30 dark:bg-base-950/70 transition-opacity z-0 cursor-default backdrop-blur-sm"
      >
        <div class="sr-only">hide search</div>
      </button>

      <div
        class="mx-auto max-w-xl transform divide-y divide-base-100 dark:divide-white/10 overflow-hidden rounded-xl bg-white dark:bg-base-900 shadow-2xl ring-1 ring-black dark:ring-white/20 ring-opacity-5 transition-all"
      >
        <div class="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            on:keydown={(event) => {
              if (event.key == "Enter") {
                if (value.trim() == "") {
                  $showSearch = false;
                }

                // navigate to current selection
                if (
                  currentSelection >= 0 &&
                  currentSelection < results.length
                ) {
                  window.location.href = results[currentSelection].href;
                } else {
                  $showSearch = false;
                }
              }

              // on arrow down
              if (event.key == "ArrowDown") {
                currentSelection++;
                if (currentSelection >= results.length) currentSelection = 0;
              }
              // on arrow up
              if (event.key == "ArrowUp") {
                currentSelection--;
                if (currentSelection < 0) currentSelection = results.length - 1;
              }
            }}
            type="text"
            class="h-12 w-full border-0 bg-transparent pl-4 pr-4 text-base-900 dark:text-base-100 placeholder:text-base-400 focus:ring-0 sm:text-sm"
            {placeholder}
            role="combobox"
            aria-expanded="false"
            aria-controls="options"
            bind:value
            bind:this={input}
          />
          <button
            on:click={() => {
              search();
            }}
            type="button"
            class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-base-900 dark:bg-base-900 dark:hover:bg-base-800 hover:bg-base-50"
          >
            <slot named="icon">
              <svg
                class=" h-5 w-5 text-base-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clip-rule="evenodd"
                />
              </svg>
            </slot>
            <slot />
          </button>
        </div>

        <!-- Results, show/hide based on command palette state -->
        {#if showResults && value.trim() != ""}
          <div transition:slide={{ duration: 100 }}>
            {#if results.length > 0}
              <div
                class="scroll-py-2 overflow-y-auto text-sm text-base-800 dark:text-base-200 divide-y divide-base-100 dark:divide-white/5 flex flex-col"
              >
                <!-- Active: "bg-indigo-600 text-white" -->
                {#each results as result, i}
                  <a
                    href={result.href}
                    class="w-full {currentSelection === i
                      ? 'bg-white/5'
                      : 'hover:bg-white/5'} select-none px-4 py-2 text-left"
                  >
                    <div class="font-semibold">
                      {result.title}
                    </div>
                    <div class="text-xs mt-2 line-clamp-2">
                      {@html result.content}
                    </div>
                  </a>
                {/each}
              </div>
            {:else}
              <!-- Empty state, show/hide based on command palette state -->
              <p class="p-4 text-sm text-base-500 dark:text-base-400">
                {noResults}
              </p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
