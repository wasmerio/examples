<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let headline = "Svelte + Astro = Magic";
  export let description = "Experience the joy of Svelte's reactivity combined with Astro's performance. Write less code, build faster websites.";

  let mounted = false;

  const scrollToDevTools = () => {
    const devtools = document.getElementById('devtools');
    if (devtools) {
      const yOffset = -80; // Offset for fixed headers
      const y = devtools.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const features = [
    { title: "Reactive by Default", description: "No more useState or useEffect. Svelte's reactive statements just work.", icon: "⚡" },
    { title: "Zero Runtime", description: "Svelte compiles away, leaving you with vanilla JavaScript that runs at lightning speed.", icon: "🚀" },
    { title: "Truly Magical", description: "Auto-subscriptions, built-in animations, and scoped CSS make development a breeze.", icon: "✨" }
  ];

  const codeExample = `<!-- Simple Svelte Component -->
< script>
  let count = 0;
  $: doubled = count * 2;
</>

<button on:click={() => count++}>
  Count: {count}
</button>

<p>Doubled: {doubled}</p>`;

  const highlights = [
    { title: "Lightning Fast", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-400"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
    { title: "Zero Runtime", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>' },
    { title: "Dark Mode Ready", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>' }
  ];

  onMount(() => {
    mounted = true;
  });
</script>

<section class="relative min-h-[90vh] flex items-center justify-center text-white px-4 sm:px-8 py-12 mt-16">  
  <div class="max-w-7xl mx-auto">
    <!-- Hero Content -->
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <!-- Left Column -->
      <div class="text-left space-y-8">
        {#if mounted}
          <div in:fly={{ x: -50, duration: 1000, delay: 200, easing: quintOut }} class="space-y-6">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span class="bg-gradient-to-r from-orange-400 via-white to-indigo-400 bg-clip-text text-transparent">{headline}</span>
            </h1>
            <p class="text-lg sm:text-xl text-gray-300 leading-relaxed">
              {description}
            </p>
            <button
              on:click={scrollToDevTools}
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Try Interactive Demo
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="transform group-hover:translate-y-1 transition-transform duration-200"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
        {/if}
      </div>

      <!-- Right Column -->
      <div class="relative">
        {#if mounted}
          <!-- Code Preview -->
          <div in:fly={{ x: 50, duration: 1000, delay: 400, easing: quintOut }} class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-indigo-500/20 blur-2xl rounded-2xl"></div>
            <div class="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
              <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50 bg-gray-900/50">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre class="p-6 overflow-x-auto font-mono text-sm">
                <code class="block">{codeExample}</code>
              </pre>
            </div>
          </div>

          <!-- Features Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {#each features as feature, i}
              <div 
                in:fly={{ y: 20, duration: 800, delay: 800 + i * 200, easing: quintOut }}
                class="p-4 rounded-xl bg-gray-800/30 backdrop-blur-md border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div class="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 class="text-lg font-semibold mb-1 text-orange-400">{feature.title}</h3>
                <p class="text-sm text-gray-300">{feature.description}</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style lang="postcss">
  :global(pre) {
    tab-size: 2;
  }
</style>