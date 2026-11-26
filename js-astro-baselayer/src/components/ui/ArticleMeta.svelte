<script lang="ts">
  interface Props {
    label: string;
    date?: Date;
    readTime?: string;
    variant?: 'default' | 'highlight';
    class?: string;
  }

  let {
    label,
    date,
    readTime,
    variant = 'default',
    class: className = '',
  }: Props = $props();

  const fmtDate = date
    ? date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toUpperCase()
    : undefined;
</script>

<div
  class="flex flex-col items-start md:items-center md:flex-row justify-between font-sans text-primary uppercase tracking-widest border-b-thin border-border/30 pb-2 {className}"
>
  <div class="flex items-center gap-2">
    {#if variant === 'highlight'}
      <span class="inline-block bg-primary rounded-full w-1.5 h-1.5"></span>
    {/if}
    <span class="font-medium text-sm subtitles">{label}</span>
  </div>
  <div class="flex items-center gap-3 text-text-primary/60 text-xs">
    {#if fmtDate}
      <span>{fmtDate}</span>
    {/if}
    {#if fmtDate && readTime}
      <span class="rounded-full w-1 h-1 bg-text-primary/40"></span>
    {/if}
    {#if readTime}
      <span>{readTime}</span>
    {/if}
  </div>
</div>
