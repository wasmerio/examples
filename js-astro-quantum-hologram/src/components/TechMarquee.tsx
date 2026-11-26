import React from 'react';
import { motion } from 'framer-motion';

const techStack = [
  "Astro", "React", "TypeScript", "Tailwind CSS", "Framer Motion", 
  "Vite", "Node.js", "SSG", "Islands Architecture", "WebGL"
];

export const TechMarquee: React.FC = () => {
  return (
    <div className="py-12 overflow-hidden border-y border-white/5 bg-white/[0.02] relative z-10 my-20">
      {/* Gradient masks for fading edges */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-quantum-900 to-transparent z-20 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-quantum-900 to-transparent z-20 pointer-events-none"></div>
      
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        className="flex whitespace-nowrap gap-16 w-max items-center"
      >
        {/* Repeat the array enough times to ensure seamless looping */}
        {[...techStack, ...techStack, ...techStack, ...techStack].map((tech, i) => (
          <span 
            key={i} 
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 uppercase tracking-tighter"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
