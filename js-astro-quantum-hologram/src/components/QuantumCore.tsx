import React from 'react';
import { motion } from 'framer-motion';

export const QuantumCore: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-quantum-900/50 backdrop-blur-3xl z-0" />
      
      <div className="text-center mb-24 z-10 relative">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink animate-pulse">Singularity</span> Engine
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-xl">
            A pure visual demonstration of synchronized CSS and Framer Motion orchestrating complex DOM geometries.
        </p>
      </div>

      {/* The Core */}
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center z-10">
        
        {/* Outer Ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-[1px] border-dashed border-neon-blue/30"
        />
        
        {/* Middle Ring */}
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[15%] rounded-full border-2 border-neon-purple/20 border-t-neon-purple/80 shadow-[0_0_30px_rgba(176,38,255,0.2)]"
        />
        
        {/* Inner Ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[30%] rounded-full border border-neon-pink/30 border-b-neon-pink/90 border-l-neon-pink/90 shadow-[0_0_50px_rgba(255,0,85,0.3)]"
        />
        
        {/* The Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-neon-blue via-neon-purple to-neon-pink rounded-full blur-xl"
            />
            <div className="absolute w-20 h-20 md:w-24 md:h-24 bg-white rounded-full mix-blend-overlay flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.5)]">
               <div className="w-10 h-10 bg-quantum-900 rounded-full animate-ping opacity-20"></div>
            </div>
        </div>
        
        {/* Orbital Particles */}
        <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
            className="absolute inset-[-10%] rounded-full"
        >
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-neon-blue rounded-full shadow-[0_0_10px_#00f0ff] -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        
        <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }} 
            className="absolute inset-[5%] rounded-full"
        >
            <div className="absolute bottom-0 right-1/4 w-4 h-4 bg-neon-pink rounded-full shadow-[0_0_15px_#ff0055] translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
      </div>
    </section>
  );
};
