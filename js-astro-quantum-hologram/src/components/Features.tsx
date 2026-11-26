import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Shield, Cpu } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-8 h-8 text-neon-blue" />,
    title: "Zero Layout Shift",
    description: "Stable UI that never jumps, ensuring a premium user experience."
  },
  {
    icon: <Layers className="w-8 h-8 text-neon-purple" />,
    title: "Fluid Animations",
    description: "Hardware-accelerated Framer Motion transitions that feel like liquid."
  },
  {
    icon: <Shield className="w-8 h-8 text-neon-pink" />,
    title: "Static Reliability",
    description: "Built strictly as an SSG, combining ultimate security with infinite scale."
  },
  {
    icon: <Cpu className="w-8 h-8 text-white" />,
    title: "Quantum State",
    description: "Advanced React state management isolated within Astro islands."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">Power</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Built following the strict CodeSculptor instructions. Performance meets aesthetic brilliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 rounded-3xl relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
