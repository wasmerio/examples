<script lang="ts">
  import { showSearch } from "./CommandPaletteStore";
</script>

<button
  class="search-button"
  onclick={() => {
    $showSearch = true;
  }}
>
  <div class="sr-only">search</div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6 text-stone-900 dark:text-stone-50 hover:text-stone-600 dark:hover:text-stone-400"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
</button>


<noscript>
  <style>
    .search-button {
      display: none;
    }
  </style>
</noscript>