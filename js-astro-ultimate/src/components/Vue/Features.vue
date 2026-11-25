<template>
  <section id="features" class="features-section py-12 sm:py-24 px-4 sm:px-8 relative overflow-hidden">
    <div class="max-w-7xl mx-auto relative">
      <Transition
        appear
        enter-active-class="transition duration-1000"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div class="text-center mb-8 sm:mb-16">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Experience The Power
          </h2>
          <p class="mt-3 sm:mt-4 text-lg sm:text-xl text-gray-400">Cutting-edge features that set us apart</p>
        </div>
      </Transition>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
        <TransitionGroup
          appear
          enter-active-class="transition duration-1000"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            :style="{ 
              transitionDelay: `${index * 200}ms`,
              transform: `
                perspective(2000px)
                rotateY(${mousePos[index].x * 0.05}deg)
                rotateX(${-mousePos[index].y * 0.05}deg)
                translateZ(${mousePos[index].isHovered ? '20px' : '0px'})
              `,
              transition: 'transform 0.3s ease'
            }"
            class="group relative"
            @mousemove="handleMouseMove($event, index)"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <!-- Glowing background -->
            <div 
              class="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-cyan-500/30 rounded-xl blur-xl transition-opacity duration-500"
              :style="{
                opacity: mousePos[index].isHovered ? 1 : 0,
                transform: `translate(${mousePos[index].x * 0.1}px, ${mousePos[index].y * 0.1}px)`
              }"
            ></div>

            <!-- Card Content -->
            <div
              class="relative bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-700/50 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 h-[350px] sm:h-[400px] flex flex-col"
            >
              <!-- 3D floating icon -->
              <div 
                class="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 mb-4 sm:mb-6 p-2 sm:p-3 transition-transform duration-300"
                :style="{
                  transform: `
                    translateZ(40px)
                    rotateY(${mousePos[index].x * 0.1}deg)
                    rotateX(${-mousePos[index].y * 0.1}deg)
                  `
                }"
              >
                <component :is="feature.icon" class="w-full h-full text-white" />
              </div>

              <!-- Text content with 3D effect -->
              <div
                :style="{
                  transform: `
                    translateZ(30px)
                    rotateY(${mousePos[index].x * 0.03}deg)
                    rotateX(${-mousePos[index].y * 0.03}deg)
                  `
                }"
              >
                <h3 class="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">{{ feature.title }}</h3>
                <p class="text-sm sm:text-base text-gray-400">{{ feature.description }}</p>
              </div>

              <!-- Interactive Element with enhanced 3D -->
              <div 
                class="mt-auto pt-4 sm:pt-6"
                :style="{
                  transform: `
                    translateZ(50px)
                    rotateY(${mousePos[index].x * 0.08}deg)
                    rotateX(${-mousePos[index].y * 0.08}deg)
                  `
                }"
              >
                <component 
                  :is="feature.interactive" 
                  v-bind="feature.props || {}"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, h, onMounted } from 'vue';

// Mouse position for each card
const mousePos = ref(Array(3).fill().map(() => ({ x: 0, y: 0, isHovered: false })));

const handleMouseMove = (event, index) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (event.clientX - centerX) / 10;
  const y = (event.clientY - centerY) / 10;
  mousePos.value[index] = { ...mousePos.value[index], x, y };
};

const handleMouseEnter = (index) => {
  mousePos.value[index].isHovered = true;
};

const handleMouseLeave = (index) => {
  mousePos.value[index] = { x: 0, y: 0, isHovered: false };
};

// Interactive components with enhanced 3D effects
const TypeWriter = {
  setup() {
    const phrases = [
      'Vue.js',
      'Components',
      'Reactivity',
      'Performance'
    ];
    const currentText = ref('');
    const phraseIndex = ref(0);
    const charIndex = ref(0);
    const isDeleting = ref(false);
    const isPaused = ref(false);

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex.value];
      
      if (!isDeleting.value) {
        currentText.value = currentPhrase.substring(0, charIndex.value + 1);
        charIndex.value++;
        
        if (charIndex.value === currentPhrase.length) {
          isDeleting.value = true;
          isPaused.value = true;
          setTimeout(() => {
            isPaused.value = false;
          }, 1500);
        }
      } else {
        if (!isPaused.value) {
          currentText.value = currentPhrase.substring(0, charIndex.value - 1);
          charIndex.value--;
          
          if (charIndex.value === 0) {
            isDeleting.value = false;
            phraseIndex.value = (phraseIndex.value + 1) % phrases.length;
          }
        }
      }
      
      const speed = isDeleting.value ? 50 : 150;
      if (!isPaused.value) {
        setTimeout(typeEffect, speed);
      } else {
        setTimeout(typeEffect, 1500);
      }
    };

    onMounted(() => {
      typeEffect();
    });

    return () => h('div', { 
      class: 'flex flex-col items-center gap-2' 
    }, [
      h('div', { 
        class: 'text-2xl font-mono text-emerald-400 min-h-[2em] flex items-center' 
      }, [
        currentText.value,
        h('span', { 
          class: 'w-[2px] h-6 bg-emerald-400 ml-1 animate-pulse' 
        })
      ])
    ]);
  }
};

const ThemeSwitcher = {
  setup() {
    const themes = [
      { name: 'Emerald', from: 'from-emerald-500', to: 'to-teal-500' },
      { name: 'Purple', from: 'from-purple-500', to: 'to-pink-500' },
      { name: 'Blue', from: 'from-blue-500', to: 'to-cyan-500' }
    ];
    const currentTheme = ref(0);

    return () => h('div', { class: 'space-y-4' }, [
      // Gradient preview box
      h('div', {
        class: `h-24 rounded-xl transition-all duration-500 bg-gradient-to-r ${themes[currentTheme.value].from} ${themes[currentTheme.value].to} bg-opacity-20`
      }),

      // Button Container
      h('div', {
        class: 'flex justify-center gap-2 flex-wrap items-center'
      }, themes.map((theme, index) =>
        h('button', {
          class: `px-4 py-1 rounded-lg text-sm transition-all duration-300 w-auto max-w-full truncate whitespace-nowrap
            ${
              currentTheme.value === index
                ? `bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-md`
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`,
          onClick: () => (currentTheme.value = index)
        }, theme.name)
      ))
    ]);
  }
};


const ProgressBar = {
  props: ['value', 'max'],
  setup(props) {
    const progress = computed(() => (props.value / props.max) * 100);
    return () => h('div', { 
      class: 'h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm' 
    }, [
      h('div', {
        class: 'h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-700 ease-out',
        style: { width: `${progress.value}%` }
      })
    ]);
  }
};

const AnimatedCounter = {
  setup() {
    const count = ref(0);
    return () => h('button', {
      class: 'w-full px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-xl text-emerald-400 transition-colors backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40',
      onClick: () => count.value++
    }, `Interactions: ${count.value}`);
  }
};

const LiveDemo = {
  setup() {
    const position = ref({ x: 50, y: 50 });
    const isDragging = ref(false);
    
    const handleMouseDown = () => isDragging.value = true;
    const handleMouseUp = () => isDragging.value = false;
    const handleMouseMove = (e) => {
      if (!isDragging.value) return;
      const rect = e.currentTarget.getBoundingClientRect();
      position.value = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
    };

    return () => h('div', {
      class: 'relative h-24 bg-gray-700/30 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-600/30',
      onMousedown: handleMouseDown,
      onMouseup: handleMouseUp,
      onMousemove: handleMouseMove,
      onMouseleave: handleMouseUp
    }, [
      h('div', {
        class: 'absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110',
        style: {
          left: `${position.value.x}%`,
          top: `${position.value.y}%`
        }
      })
    ]);
  }
};

// Feature definitions (reduced to 3)
const features = [
  {
    title: "Smart Type System",
    description: "Experience the power of Vue's intelligent type system with real-time feedback and suggestions.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      `
    },
    interactive: TypeWriter
  },
  {
    title: "Dynamic Theming",
    description: "Switch between beautiful pre-built themes or create your own with our powerful theming system.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      `
    },
    interactive: ThemeSwitcher
  },
  {
    title: "Dynamic Experiences",
    description: "Build fluid and responsive interfaces with Vue's reactive system and smooth transitions.",
    icon: {
      template: `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      `
    },
    interactive: LiveDemo
  }
];
</script>
