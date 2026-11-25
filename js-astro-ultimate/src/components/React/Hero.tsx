import React from 'react';
import { motion, LazyMotion, domAnimation } from 'framer-motion';

const LivePreview: React.FC = () => {
  const [color, setColor] = React.useState('#3B82F6');
  
  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-gray-900 rounded-2xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-gray-400">Live Preview</div>
          </div>
          
          <div className="p-1 m-7">
            <div className="space-y-3">
              <div className="text-center space-y-2">
                <p className="text-gray-300 font-medium">Try it yourself!</p>
                <p className="text-sm text-gray-400">Click the input below to choose a color</p>
              </div>
              <input 
                type="color" 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 rounded-lg cursor-pointer bg-transparent hover:scale-[1.02] transition-transform"
              />
              <div className="text-center">
                <p className="text-sm text-gray-400">Selected color: <span className="font-mono text-gray-300">{color}</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </LazyMotion>
  );
};

interface CodeCardProps {
  title: string;
  code: string;
}

const CodeCard: React.FC<CodeCardProps> = ({ title, code }) => (
  <LazyMotion features={domAnimation}>
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-sm text-gray-400">{title}</div>
        </div>
        <pre className="overflow-x-auto">
          <code className="block text-sm text-gray-300">{code}</code>
        </pre>
      </div>
    </motion.div>
  </LazyMotion>
);

const Hero: React.FC = () => {
  const reactCode = 
  ` 
// Color Picker Component
import { useState } from 'react';

const ColorPicker = () => {
  const [color, setColor] = useState('#3B82F6');
  
  return (
    <div className="space-y-4">
      <input 
        type="color" 
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div 
        style={{ backgroundColor: color }}
        className="w-full h-20 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default ColorPicker;`;

  const astroCode = `---
// pages/index.astro
import ColorPicker from '../components/ColorPicker';
---

<div class="my-component">
  <h2>Interactive Color Picker</h2>
  <ColorPicker client:load />
</div>`;

  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[80vh] relative flex items-center justify-center py-20 mt-20">      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <LazyMotion features={domAnimation}>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              React + Astro
            </motion.h1>
          </LazyMotion>
          <LazyMotion features={domAnimation}>
            <motion.p 
              className="text-xl text-gray-300 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Build dynamic, interactive components with the power of React in your Astro pages.
            </motion.p>
          </LazyMotion>
          <LazyMotion features={domAnimation}>
            <motion.button
              onClick={scrollToChat}
              className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: 2 }}
            >
              Chat with Me
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transform group-hover:translate-y-1 transition-transform duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </motion.button>
          </LazyMotion>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <CodeCard title="ColorPicker.tsx" code={reactCode} />
          <div className="space-y-8">
            <CodeCard title="index.astro" code={astroCode} />
            <LivePreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
