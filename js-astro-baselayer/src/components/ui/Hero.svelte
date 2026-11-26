<script lang="ts">
    import type { Snippet } from "svelte";
    import AnimeGrid from "./AnimeGrid.svelte";

    interface Props {
        subtitle?: string;
        heading?: string;
        headingItalic?: string;
        headingHighlight?: string;
        description?: string;
        descriptionSecondary?: string;
        labHref?: string;
        blogHref?: string;
        /** Show the 3D canvas column */
        showCanvas?: boolean;
    }

    let {
        subtitle = "Build log",
        heading = "I ship",
        headingItalic = "clean systems",
        headingHighlight = "fast",
        description = "Templates, components, and front-end experiments. I optimize for clarity - less boilerplate, more logic. This is my open workbench.",
        descriptionSecondary = "Everything here is free to fork or steal. Check the lab for the latest builds.",
        labHref = "/lab",
        blogHref = "/blog",
        showCanvas = true,
    }: Props = $props();
</script>

<section class="relative py-12 overflow-hidden">
    <div
        class="items-center gap-8 grid grid-cols-1 lg:grid-cols-2 mx-auto px-6 max-w-6xl"
    >
        <!-- Left: content -->
        <div class="max-w-xl">
            <span
                class="block mb-2 font-[525] font-sans text-primary uppercase subtitles"
            >
                {subtitle}
            </span>
            <h1 class="mb-4 font-[350] fl-text-6xl/7xl">
                {heading}
                <span class="font-light italic">{headingItalic}</span>
                and exploring
                <span class="text-primary">{headingHighlight}</span>.
            </h1>
            <div class="space-y-4 fl-text-2xl/3xl tracking-[0.013em]">
                <p class="text-white/88 text-pretty fl-leading-8.5/9" >
                    {description}
                </p>
                <p class="text-text-primary/80 fl-text-xl/2xl fl-leading-8/9.5 tracking-wide" >
                    {descriptionSecondary}
                </p>
            </div>
            <div class="flex gap-2 mt-8">
                <a
                    href={labHref}
                    class="group inline-flex items-center gap-1 btn-fill-primary px-4 py-2 border-bold border-primary rounded-lg font-semibold hover:font-extrabold text-primary hover:text-emerald-950 active:text-emerald-950 text-base uppercase tracking-widest btn-fill"
                >
                    View Lab
                    <span class="group">
                        <svg
                            class="fill-primary group-hover:fill-white size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
                            ></path>
                        </svg>
                    </span>
                </a>
                <a
                    href={blogHref}
                    class="block z-10 btn-fill-surface px-4 py-2 border-thin border-transparent rounded-lg font-medium text-text-primary hover:text-white text-base uppercase tracking-widest btn-fill btn-fill"
                >
                    Read Log
                </a>
            </div>
        </div>

        <!-- Right: animated grid column -->
        {#if showCanvas}
            <div class="hidden lg:block">
                <AnimeGrid />
            </div>
        {/if}
    </div>
</section>
