<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import type { CollectionEntry } from "astro:content";

  type Props = {
    project?: CollectionEntry<"projects">;
    projects: CollectionEntry<"projects">[];
  };
  let { project, projects }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Sidebar.MenuButton {...props}>
        {#if project}
          {project.data.title}
        {:else}
          Select Project
        {/if}
        <ChevronDownIcon class="ms-auto" />
      </Sidebar.MenuButton>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
    {#each projects as project (project.data.title)}
      <a href={`/${project.id}`}>
      <DropdownMenu.Item>
        <span>{project.data.title}</span>
      </DropdownMenu.Item>
      </a>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
