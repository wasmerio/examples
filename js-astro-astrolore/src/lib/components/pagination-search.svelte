<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import { SearchIcon } from "@lucide/svelte";

  let { placeholder, query = $bindable() } = $props();
</script>

<InputGroup.Root class="mb-8">
  <InputGroup.Input placeholder={placeholder ?? "Search..."} bind:value={query} />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
</InputGroup.Root>

