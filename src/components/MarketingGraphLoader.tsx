'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MarketingGraphLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full bg-[#050510]">
      {/* Animated Growth Graph */}
      <div className="flex items-end gap-3 mb-10 h-24">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ height: "20%" }}
            animate={{ 
              height: ["20%", "100%", "20%"],
              backgroundColor: ["#6366f1", "#a855f7", "#6366f1"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="w-4 rounded-t-full shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          />
        ))}
      </div>

      {/* Pulsing Loading Text */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">
          Fetching Profile Data
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.div 
              key={dot}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.2 }}
              className="w-1 h-1 bg-indigo-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MarketingGraphLoader;
