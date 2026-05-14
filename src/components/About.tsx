'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Trophy } from 'lucide-react';

interface AboutProps {
  problem: string;
  agitate: string;
  solution: string;
}

const About: React.FC<AboutProps> = ({ problem, agitate, solution }) => {
  return (
    <section id="about" className="py-24 bg-[#050510] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            The Journey Beyond Code
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Problem */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2rem] hover:border-zinc-700 transition-all group"
          >
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-transform">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">The Challenge</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              {problem}
            </p>
          </motion.div>

          {/* Agitate */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[2rem] hover:border-zinc-700 transition-all group"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-8 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">The Friction</h3>
            <p className="text-zinc-400 leading-relaxed font-medium">
              {agitate}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-indigo-600 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(79,70,229,0.2)] group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <Trophy size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
            <p className="text-white/80 leading-relaxed font-medium">
              {solution}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
