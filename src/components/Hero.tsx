'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, User, Mail } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Stars = dynamic(() => import('./Stars'), { ssr: false });

interface HeroProps {
  name: string;
  headline: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
}

const Hero: React.FC<HeroProps> = ({ name, headline, profileImage, socialLinks }) => {
  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return Globe;
      case 'linkedin': return User;
      case 'twitter': return Mail;
      default: return Globe;
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050510]">
      {/* 1. Nebula Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* 2. Twinkling Stars (Hydration-safe via next/dynamic) */}
      <Stars />

      {/* 3. Main Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          key="hero-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center shadow-2xl relative overflow-hidden max-w-5xl w-full"
        >
          {/* Decorative inner glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />

          {profileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10 relative"
            >
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)] relative">
                <Image 
                  src={profileImage} 
                  alt={name} 
                  fill 
                  priority 
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 224px"
                />
              </div>
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none text-center uppercase"
          >
            {name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Available for new projects</span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium text-center"
          >
            {headline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a 
              href="#contact"
              className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Start a Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-center gap-4">
              {socialLinks && socialLinks.map((social, i) => {
                const Icon = getIcon(social.platform);
                return (
                  <a 
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/5 border border-white/10 text-zinc-400 rounded-full hover:text-white hover:border-zinc-700 transition-all backdrop-blur-sm"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Scroll Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-800 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;