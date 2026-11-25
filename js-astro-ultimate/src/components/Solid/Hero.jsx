import { createSignal, createEffect, Show, onMount } from 'solid-js';

const Hero = () => {
  const [activeTab, setActiveTab] = createSignal('solid');
  const [count, setCount] = createSignal(0);
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsVisible(true), 100);
  });

  const solidCode = `// Solid.js Component
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);
  
  return (
    <button 
      class="px-4 py-2 bg-blue-500 text-white"
      onClick={() => setCount(c => c + 1)}
    >
      Clicks: {count()}
    </button>
  );
}`;

  const astroCode = `---
// Astro Page with Solid.js
import Layout from '../layouts/Layout.astro';
import Counter from '../components/Counter';
---

<Layout title="Solid + Astro">
  <main>
    <Counter client:load />
  </main>
</Layout>`;

  return (
    <section class={`relative min-h-screen flex items-center justify-center p-8 transition-all duration-700 transform ${isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div class={`container mx-auto grid md:grid-cols-2 gap-12 items-center transition-all duration-700 delay-200 transform ${isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Left Column - Text Content */}
        <div class={`space-y-8 transition-all duration-700 delay-300 transform ${isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div class="space-y-6">
            <h1 class="text-5xl font-bold leading-tight">
              <span class="text-white">Build with</span>{" "}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#4F87C7] to-[#2B5C9B]">
                Solid.js
              </span>{" "}
              <span class="text-white">+</span>{" "}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Astro
              </span>
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed">
              Experience the perfect blend of Solid.js reactivity and Astro's static-first approach.
              Build blazing-fast websites with the finest granular reactivity system.
            </p>
          </div>

          {/* Interactive Demo Button */}
          <div class="bg-gray-800/50 p-6 rounded-xl space-y-4 backdrop-blur-sm relative overflow-hidden group">
            {/* Animated background gradient */}
            <div class="absolute inset-0 bg-gradient-to-r from-[#4F87C7]/10 to-[#2B5C9B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h3 class="text-lg font-semibold text-gray-300 relative">Experience Solid.js in action:</h3>
            <button
              onClick={() => {
                const editor = document.querySelector('.interactive-playground');
                editor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              class="relative w-full px-6 py-4 bg-gradient-to-r from-[#4F87C7] to-[#2B5C9B] text-white rounded-lg 
                     shadow-[0_0_20px_rgba(79,135,199,0.3)] hover:shadow-[0_0_30px_rgba(79,135,199,0.5)]
                     transform hover:scale-[1.02] active:scale-95 transition-all duration-200
                     flex items-center justify-center gap-3 group/btn"
            >
              <span class="text-lg font-semibold">Try the Interactive Code Editor</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 transform group-hover/btn:translate-y-1 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column - Code Examples */}
        <div class={`bg-gray-900/70 rounded-2xl backdrop-blur-sm overflow-hidden w-full h-[500px] flex flex-col transition-all duration-700 delay-400 transform ${isVisible() ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Tab Navigation */}
          <div class="flex border-b border-gray-800">
            <button
              class={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab() === 'solid'
                  ? 'text-[#4F87C7] border-b-2 border-[#4F87C7]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('solid')}
            >
              Solid.js
            </button>
            <button
              class={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab() === 'astro'
                  ? 'text-orange-400 border-b-2 border-orange-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('astro')}
            >
              Astro
            </button>
          </div>

          {/* Code Window */}
          <div class="relative flex-1">
            {/* Window Controls */}
            <div class="absolute top-4 left-4 flex space-x-2 z-10">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            {/* Code Content */}
            <div class="relative h-full">
              <pre class={`absolute inset-0 p-8 pt-12 font-mono text-sm leading-relaxed transition-opacity duration-300 ${activeTab() === 'solid' ? 'opacity-100' : 'opacity-0'} overflow-auto`}>
                <code class="text-gray-300 whitespace-pre">
                  {solidCode}
                </code>
              </pre>
              <pre class={`absolute inset-0 p-8 pt-12 font-mono text-sm leading-relaxed transition-opacity duration-300 ${activeTab() === 'astro' ? 'opacity-100' : 'opacity-0'} overflow-auto`}>
                <code class="text-gray-300 whitespace-pre">
                  {astroCode}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
