'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  percentage: number;
}

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section id="skills" className="py-24 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight"
            >
              Mastering the <span className="text-indigo-500">Digital Craft</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg leading-relaxed mb-8"
            >
              I specialize in crafting data-driven digital marketing strategies that accelerate growth and maximize ROI. My focus is on leveraging targeted ad campaigns, SEO, and compelling content frameworks to build a strong brand presence and drive exceptional customer engagement.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              {['Meta Ads', 'SEO & SEM', 'Content Strategy (AIDA/PAS)', 'Social Media Management', 'AI Content Generation', 'Analytics', 'WordPress'].map((tech) => (
                <span key={tech} className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-bold text-zinc-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-white font-bold tracking-wide uppercase text-xs">{skill.name}</span>
                  <span className="text-indigo-400 font-mono text-sm">{skill.percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full relative"
                  >
                    <div className="absolute top-0 right-0 w-8 h-full bg-white/20 blur-sm animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
