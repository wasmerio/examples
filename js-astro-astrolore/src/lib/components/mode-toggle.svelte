<script lang="ts">
 import SunIcon from "@lucide/svelte/icons/sun";
 import MoonIcon from "@lucide/svelte/icons/moon";
 import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";

 import { resetMode, setMode } from "mode-watcher";
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 import type { Translations } from "$lib/i18n";

 type Props = { t: Translations["theme"] };
 let { t }: Props = $props();
</script>

<DropdownMenu.Root>
 <DropdownMenu.Trigger>
    {#snippet child({props})}
    <Sidebar.MenuButton
    {...props}
      class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
  <SunIcon
   class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
  />
  <MoonIcon
   class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
  />
  <span>{t.label}</span>
      <ChevronUpIcon class="ms-auto" />
    </Sidebar.MenuButton>
    {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content side="top" class="w-(--bits-dropdown-menu-anchor-width)">
  <DropdownMenu.Item onclick={() => setMode("light")}><span>{t.light}</span></DropdownMenu.Item
  >
  <DropdownMenu.Item onclick={() => setMode("dark")}><span>{t.dark}</span></DropdownMenu.Item>
  <DropdownMenu.Item onclick={() => resetMode()}><span>{t.system}</span></DropdownMenu.Item>
 </DropdownMenu.Content>
</DropdownMenu.Root>
