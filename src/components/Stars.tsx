'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Stars: React.FC = () => {
  // Use a smaller number of stars for mobile, or a moderate amount for all devices
  const starCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(starCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default Stars;