<script lang="ts">
    interface Props {
        href: string;
        date?: string;
        title: string;
        description: string;
        image?: string;
        tags?: string[];
        class?: string;
    }

    let {
        href,
        date,
        title,
        description,
        image,
        tags = [],
        class: className = "",
    }: Props = $props();
</script>

<a
    {href}
    class="block group bg-surface-card border-default border-border-card rounded-md cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-surface overflow-hidden {className}"
>
    {#if image}
        <div class="relative aspect-video overflow-hidden">
            <img
                src={image}
                alt={title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
                class="bottom-0 absolute inset-x-0 bg-gradient-to-t from-surface-card to-transparent h-1/2 pointer-events-none"
            ></div>
        </div>
    {/if}

    <div class="flex flex-col gap-1 p-4">
        <div class="flex justify-between items-start mb-2">
            {#if date}
                <span
                    class="font-[625] font-sans text-neutral-500 text-sm uppercase tracking-widest"
                >
                    {date}
                </span>
            {/if}
            <svg
                class="size-4 text-text-primary/40 group-hover:text-primary transition-colors duration-300 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
            </svg>
        </div>

        <h3
            class="font-display text-text-secondary group-hover:text-primary text-2xl transition-colors duration-300"
        >
            {title}
        </h3>
        <p
            class="font-sans text-text-primary text-base line-clamp-2 tracking-wide"
        >
            {description}
        </p>

        {#if tags.length > 0}
            <div class="flex flex-wrap gap-2 mt-1">
                {#each tags as tag}
                    <span
                        class="inline-flex items-center bg-surface px-2 py-0.5 border-thin border-primary/40 rounded-sm font-medium text-[10px] text-primary uppercase tracking-widest"
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        {/if}
    </div>
</a>
