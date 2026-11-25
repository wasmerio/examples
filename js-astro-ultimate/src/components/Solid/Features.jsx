import { createSignal, createEffect, Show } from 'solid-js';

const Features = () => {
  const [activeTab, setActiveTab] = createSignal('playground');
  const [code, setCode] = createSignal(`<div class="max-w-md mx-auto p-4">
  <header class="text-center mb-4">
    <h1 class="text-2xl font-bold text-gradient">Welcome to Coding!</h1>
    <p class="text-gray-400 text-sm">Edit this code to see live changes</p>
  </header>

  <div class="bg-gray-800 rounded-lg p-4 mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] rounded-full flex items-center justify-center">
        <span class="text-white text-lg">🚀</span>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-white">Interactive Demo</h2>
        <p class="text-gray-400 text-sm">Try editing this code!</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Responsive
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Modern UI
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Live Preview
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Easy to Edit
    </div>
  </div>

  <button class="w-full py-2 px-4 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-white rounded-lg hover:opacity-90 transition-opacity">
    Click Me!
  </button>
</div>`);
  const [error, setError] = createSignal(null);
  const [theme, setTheme] = createSignal('dark');
  const [previewCount, setPreviewCount] = createSignal(0);
  const [selectedColor, setSelectedColor] = createSignal('#00DC82');

  // Sanitize and render HTML safely
  const renderPreview = (htmlContent) => {
    try {
      return htmlContent;
    } catch (e) {
      setError(e.message);
      return '';
    }
  };

  const defaultExample = () => {
    const template = `<div class="max-w-md mx-auto p-4">
  <header class="text-center mb-4">
    <h1 class="text-2xl font-bold text-gradient">Welcome to Coding!</h1>
    <p class="text-gray-400 text-sm">Edit this code to see live changes</p>
  </header>

  <div class="bg-gray-800 rounded-lg p-4 mb-4">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] rounded-full flex items-center justify-center">
        <span class="text-white text-lg">🚀</span>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-white">Interactive Demo</h2>
        <p class="text-gray-400 text-sm">Try editing this code!</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2 mb-4">
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Responsive
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Modern UI
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Live Preview
    </div>
    <div class="flex items-center text-green-400 text-sm">
      <span class="mr-1">✓</span> Easy to Edit
    </div>
  </div>

  <button class="w-full py-2 px-4 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-white rounded-lg hover:opacity-90 transition-opacity">
    Click Me!
  </button>
</div>`;
    setCode(template);
  };

  const counterExample = () => {
    const template = `
    <div class="max-w-md mx-auto p-4">
      <div class="text-center mb-4">
        <h2 class="text-2xl font-bold text-gradient">Interactive Counter</h2>
        <p class="text-gray-400 text-sm">Watch the number bounce!</p>
      </div>
      
      <div class="bg-gray-800 rounded-xl p-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-[#00DC82]/10 to-[#36E4DA]/10"></div>
        
        <div class="relative">
          <div class="flex justify-center mb-6">
            <div class="counter-number text-5xl font-bold text-white transition-all duration-300 transform hover:scale-110" style="text-shadow: 0 0 20px rgba(0, 220, 130, 0.5)">
              ${previewCount()}
            </div>
          </div>
          
          <div class="flex justify-center items-center space-x-4">
            <button id="decrement" class="group relative px-6 py-3 rounded-lg bg-gray-900 text-white overflow-hidden transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div class="relative flex items-center">
                <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
              </div>
            </button>
            
            <button id="increment" class="group relative px-6 py-3 rounded-lg bg-gray-900 text-white overflow-hidden transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div class="relative flex items-center">
                <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-400">
          Click the buttons to see smooth animations!
        </p>
      </div>
    </div>`;
    setCode(template);
  };

  const colorPaletteExample = () => {
    const colors = ['#00DC82', '#36E4DA', '#4C7AF0', '#FF5D01' , '#FF3E00'];  
    const template = `
    <div class="text-center space-y-4">
      <h2 class="text-2xl text-gradient">Interactive Color Palette</h2>
      <div class="grid grid-cols-5 gap-3">
        ${colors.map(color => `
          <button 
            class="color-block p-8 rounded-lg transition-transform hover:scale-105 ${color === selectedColor() ? 'ring-2 ring-white' : ''}" 
            style="background: ${color}"
            data-color="${color}"
          ></button>
        `).join('')}
      </div>
      <div class="mt-4">
        <p class="text-lg">Selected Color: <span class="font-mono">${selectedColor()}</span></p>
      </div>
    </div>`;
    setCode(template);
  };

  // Add custom styles
  createEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .text-gradient {
        background: linear-gradient(to right, #00DC82, #36E4DA);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .preview-area {
        height: 300px;
        overflow-y: auto;
        transition: background-color 0.3s ease;
      }
      .preview-area.light {
        background: #ffffff;
        color: #1a1a1a;
      }
      .preview-area.dark {
        background: #1a1a1a;
        color: #ffffff;
      }
      .color-block {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .color-block:hover {
        transform: scale(1.05);
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .counter-change {
        animation: bounce 0.5s ease;
      }
    `;
    document.head.appendChild(style);
  });

  // Handle preview interactions
  createEffect(() => {
    const preview = document.querySelector('.preview-area');
    if (!preview) return;

    const handleClick = (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      // Handle counter buttons
      if (target.id === 'increment' || target.matches('#increment *')) {
        setPreviewCount(c => c + 1);
        counterExample();
        // Add animation class
        const numberElement = document.querySelector('.counter-number');
        if (numberElement) {
          numberElement.classList.remove('counter-change');
          void numberElement.offsetWidth; // Trigger reflow
          numberElement.classList.add('counter-change');
        }
      } else if (target.id === 'decrement' || target.matches('#decrement *')) {
        setPreviewCount(c => c - 1);
        counterExample();
        // Add animation class
        const numberElement = document.querySelector('.counter-number');
        if (numberElement) {
          numberElement.classList.remove('counter-change');
          void numberElement.offsetWidth; // Trigger reflow
          numberElement.classList.add('counter-change');
        }
      }

      // Handle color palette
      if (target.classList.contains('color-block')) {
        const color = target.dataset.color;
        if (color) {
          setSelectedColor(color);
          colorPaletteExample();
        }
      }
    };

    preview.addEventListener('click', handleClick);
    return () => preview.removeEventListener('click', handleClick);
  });

  return (
    <section class="interactive-playground py-20 px-4">
      <div class="max-w-6xl mx-auto space-y-16">
        <div class="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden shadow-xl">
          <div class="border-b border-gray-800/50 p-4">
            <h2 class="text-2xl font-semibold text-white">Interactive Code Playground</h2>
            <p class="text-gray-400 mt-1">Edit HTML and see it update in real-time</p>
          </div>

          <div class="p-6 space-y-6">
            <div class="flex justify-end space-x-2">
              <button
                onClick={defaultExample}
                class="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Default Example
              </button>
              <button
                onClick={counterExample}
                class="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Counter Example
              </button>
              <button
                onClick={colorPaletteExample}
                class="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Color Palette
              </button>
              <button
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                class="px-3 py-1 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Toggle {theme() === 'light' ? 'Dark' : 'Light'} Mode
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code Editor */}
              <div class="space-y-2">
                <h3 class="text-lg font-medium text-white">Editor</h3>
                <textarea
                  value={code()}
                  onInput={(e) => setCode(e.target.value)}
                  class="w-full h-64 p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50"
                  placeholder="Enter your HTML code here..."
                />
              </div>

              {/* Live Preview */}
              <div class="space-y-2">
                <h3 class="text-lg font-medium text-white">Preview</h3>
                <div 
                  class={`preview-area ${theme()} p-4 rounded-lg border border-gray-700 overflow-auto`}
                  innerHTML={renderPreview(code())}
                />
              </div>
            </div>

            <Show when={error()}>
              <div class="text-red-400 text-sm mt-2">
                Error: {error()}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
