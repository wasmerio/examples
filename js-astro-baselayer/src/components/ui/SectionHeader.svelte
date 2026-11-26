<script lang="ts">
    interface Props {
        title: string;
        class?: string;
    }

    let { title, class: className = "" }: Props = $props();
</script>

<div class="flex items-center gap-4 mb-2 {className}">
    <span
        class="font-sans text-text-primary/60 uppercase tracking-widest whitespace-nowrap group-hover/section:text-primary duration-100 delay-200 transition-colors"
    >
        {title}
    </span>
    <div
        class="flex-1 border-t-bold border-border/30 group-hover/section:border-primary/60 transition-colors duration-300"
    ></div>
</div>
