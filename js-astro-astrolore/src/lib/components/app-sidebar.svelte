<script lang="ts">
    import ModeToggle from "$lib/components/mode-toggle.svelte";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import type { CollectionEntry } from "astro:content";
    import ProjectDropdown from "./project-dropdown.svelte";
    import {
        MapIcon,
        ScrollIcon,
        LibraryBigIcon,
        StickyNoteIcon,
        NewspaperIcon,
        TimelineIcon,
        DicesIcon,
        OrigamiIcon,
        NetworkIcon,
    } from "@lucide/svelte";
    import { navigate } from "astro:transitions/client";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Command from "$lib/components/ui/command/index.js";
    import { type CollectionItem, type ContentCounts, slugFromId } from "$lib/content-utils";
    import type { Translations } from "$lib/i18n";

    let open = $state(false);

    function handleKeydown(e: KeyboardEvent) {
        if (!project) return;

        if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            open = !open;
        }
    }
    async function handleSelect(id: string) {
        await navigate(`/${id}`);
    }

    type Props = {
        project?: CollectionEntry<"projects">;
        projects: CollectionEntry<"projects">[];
        categories: CollectionItem[];
        articles: CollectionItem[];
        timelines: CollectionItem[];
        maps: CollectionItem[];
        documents: CollectionItem[];
        counts: ContentCounts;
        translations: Translations;
        pathname: string;
    };
    let {
        project,
        projects,
        categories,
        articles,
        timelines,
        maps,
        documents,
        counts,
        translations,
        pathname,
    }: Props = $props();

    let parts = $derived(pathname.split("/"));
    let section = $derived(parts.at(2));
    let slug = $derived(parts.at(3));
</script>

<svelte:document onkeydown={handleKeydown} />

{#if project}
    <Command.Dialog bind:open>
        <Command.Input placeholder={translations.search.placeholder} />
        <Command.List>
            <Command.Empty>{translations.search.noResults}</Command.Empty>
            <Command.Group heading={translations.common.categories}>
                {#each categories as category (category.id)}
                    <Command.Item
                        value={category.label}
                        onSelect={() => handleSelect(category.id)}
                    >
                        {category.label}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Group heading={translations.common.articles}>
                {#each articles as article (article.id)}
                    <Command.Item
                        value={article.label}
                        onSelect={() => handleSelect(article.id)}
                    >
                        {article.label}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Group heading={translations.common.maps}>
                {#each maps as map (map.id)}
                    <Command.Item
                        value={map.label}
                        onSelect={() => handleSelect(map.id)}
                    >
                        {map.label}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Group heading={translations.common.timelines}>
                {#each timelines as timeline (timeline.id)}
                    <Command.Item
                        value={timeline.label}
                        onSelect={() => handleSelect(timeline.id)}
                    >
                        {timeline.label}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Group heading={translations.common.documents}>
                {#each documents as document (document.id)}
                    <Command.Item
                        value={document.label}
                        onSelect={() => handleSelect(document.id)}
                    >
                        {document.label}
                    </Command.Item>
                {/each}
            </Command.Group>
        </Command.List>
    </Command.Dialog>
{/if}

<Sidebar.Root id="sidebar">
    <Sidebar.Header>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <ProjectDropdown {project} {projects} />
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Header>

    <Sidebar.Content>
        {#if project}
            <Sidebar.Group>
                <Sidebar.GroupContent>
                    <Sidebar.MenuItem>
                        <Button
                            class="w-full bg-muted text-muted-foreground justify-between font-normal"
                            onclick={() => {
                                open = true;
                            }}
                        >
                            {translations.search.placeholder}
                            <kbd
                                class="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none"
                            >
                                <span class="text-xs">⌘</span>J
                            </kbd>
                        </Button>
                    </Sidebar.MenuItem>
                </Sidebar.GroupContent>
            </Sidebar.Group>
        {/if}

        {#if project}
            <Sidebar.Group>
                <Sidebar.GroupLabel>{translations.common.codex}</Sidebar.GroupLabel>

                <Sidebar.GroupContent>
                    {#if categories}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "categories" &&
                                    !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/categories`}
                                        {...props}
                                    >
                                        <LibraryBigIcon />
                                        {translations.common.categories}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuSub>
                            {#each categories as cat (cat.label)}
                                <Sidebar.MenuSubItem>
                                    <Sidebar.MenuSubButton
                                        isActive={section === "categories" &&
                                            slug === slugFromId(cat.id)}
                                    >
                                        {#snippet child({ props })}
                                            <a
                                                href={`/${cat.id}`}
                                                {...props}
                                            >
                                                <span>{cat.label}</span>
                                            </a>
                                        {/snippet}
                                    </Sidebar.MenuSubButton>
                                </Sidebar.MenuSubItem>
                            {/each}
                        </Sidebar.MenuSub>
                    {/if}

                    {#if counts.articles}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={(section === "articles" || section === "graph") && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/articles`}
                                        {...props}
                                    >
                                        <NewspaperIcon />
                                        {translations.common.articles}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                            <Sidebar.MenuAction>
                                {#snippet child({ props })}
                                    <a href={`/${project.id}/graph`} {...props}>
                                        <NetworkIcon />
                                    </a>
                                {/snippet}
                            </Sidebar.MenuAction>
                        </Sidebar.MenuItem>
                    {/if}

                    {#if counts.maps}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "maps" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/maps`}
                                        {...props}
                                    >
                                        <MapIcon />
                                        {translations.common.maps}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}

                    {#if counts.timelines}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "timelines" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/timelines`}
                                        {...props}
                                    >
                                        <TimelineIcon />
                                        {translations.common.timelines}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}

                    {#if counts.documents}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "documents" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/documents`}
                                        {...props}
                                    >
                                        <ScrollIcon />
                                        {translations.common.documents}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}
                </Sidebar.GroupContent>
            </Sidebar.Group>

            <Sidebar.Group>
                <Sidebar.GroupLabel>{translations.common.binder}</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                    {#if counts.handouts}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "handouts" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/handouts`}
                                        {...props}
                                    >
                                        <StickyNoteIcon />
                                        {translations.common.handouts}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}
                    {#if counts.tables}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "tables" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/tables`}
                                        {...props}
                                    >
                                        <DicesIcon />
                                        {translations.common.tables}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}
                    {#if counts.statblocks}
                        <Sidebar.MenuItem>
                            <Sidebar.MenuButton
                                isActive={section === "statblocks" && !slug}
                            >
                                {#snippet child({ props })}
                                    <a
                                        href={`/${project.id}/statblocks`}
                                        {...props}
                                    >
                                        <OrigamiIcon />
                                        {translations.common.statblocks}
                                    </a>
                                {/snippet}
                            </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                    {/if}
                </Sidebar.GroupContent>
            </Sidebar.Group>
        {/if}
    </Sidebar.Content>

    <Sidebar.Footer>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <ModeToggle t={translations.theme} />
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>
