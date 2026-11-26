<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    caption?: string;
    class?: string;
  }

  let { src, alt, caption, class: className = '' }: Props = $props();
</script>

<figure class="w-full {className}">
  <div
    class="group relative"
  >
    <!-- ambient glow on hover -->
    <div
      class="absolute inset-0 bg-tertiary/10 opacity-0 group-hover:opacity-100 blur-xl rounded-[18px] transition-opacity duration-1000"
    ></div>

    <div class="z-10 relative bg-surface border-thin border-white/5 rounded-xl overflow-hidden">
      <img
        {src}
        {alt}
        class="opacity-90 hover:opacity-100 w-full h-auto object-cover transition-opacity duration-700"
        loading="lazy"
      />
    </div>

    <!-- decorative corners -->
    <div class="top-0 left-0 z-20 absolute m-3 border-primary/50 border-t-thin border-l-thin w-2 h-2"></div>
    <div class="top-0 right-0 z-20 absolute m-3 border-primary/50 border-t-thin border-r-thin w-2 h-2"></div>
    <div class="bottom-0 left-0 z-20 absolute m-3 border-primary/50 border-b-thin border-l-thin w-2 h-2"></div>
    <div class="right-0 bottom-0 z-20 absolute m-3 border-primary/50 border-r-thin border-b-thin w-2 h-2"></div>
  </div>
  {#if caption}
    <figcaption class="mt-4 font-sans text-text-primary/60 text-xs text-center uppercase tracking-widest">
      {caption}
    </figcaption>
  {/if}
</figure>
