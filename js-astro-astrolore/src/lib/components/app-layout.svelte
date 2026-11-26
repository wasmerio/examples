<script lang="ts">
    import { ModeWatcher } from "mode-watcher";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import type { CollectionEntry } from "astro:content";
    import { type CollectionItem, type ContentCounts, type Crumb } from "$lib/content-utils";
    import type { Translations } from "$lib/i18n";

    type Props = {
        project?: CollectionEntry<"projects">;
        projects: CollectionEntry<"projects">[];
        categories: CollectionItem[];
        articles: CollectionItem[];
        timelines: CollectionItem[];
        maps: CollectionItem[];
        documents: CollectionItem[];
        counts: ContentCounts;
        crumbs: Crumb[];
        pathname: string;
        translations: Translations;
        children: any;
    };
    const {
        project,
        projects,
        categories,
        articles,
        timelines,
        maps,
        documents,
        counts,
        crumbs,
        pathname,
        translations,
        children,
    }: Props = $props();
</script>

<ModeWatcher />

<Sidebar.Provider>
    <AppSidebar
        {project}
        {projects}
        {categories}
        {articles}
        {timelines}
        {maps}
        {documents}
        {counts}
        {pathname}
        {translations}
    />
    <main class="w-full">
        <div
            class="sticky top-0 z-30 border-b-[1px] w-full px-2 py-2 bg-background"
        >
            <div class="flex justify-between items-center">
                <Sidebar.Trigger />
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        {#each crumbs as crumb, i}
                            {#if i < crumbs.length - 1}
                                <Breadcrumb.Item class="text-base">
                                    {#if crumb.href}
                                        <Breadcrumb.Link href={crumb.href}
                                            >{crumb.label}</Breadcrumb.Link
                                        >
                                    {:else}
                                        <Breadcrumb.Page
                                            >{crumb.label}</Breadcrumb.Page
                                        >
                                    {/if}
                                </Breadcrumb.Item>
                                <Breadcrumb.Separator />
                            {:else}
                                <Breadcrumb.Item class="text-base">
                                    <Breadcrumb.Page
                                        >{crumb.label}</Breadcrumb.Page
                                    >
                                </Breadcrumb.Item>
                            {/if}
                        {/each}
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <div></div>
            </div>
        </div>
        {@render children?.()}
    </main>
</Sidebar.Provider>
