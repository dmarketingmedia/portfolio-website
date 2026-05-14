'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Feedback {
  _id: string;
  clientName: string;
  clientCompany: string;
  comment: string;
  rating: number;
  isApproved: boolean;
}

interface FeedbackSliderProps {
  feedbacks: Feedback[];
}

const FeedbackSlider: React.FC<FeedbackSliderProps> = ({ feedbacks }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-[#050510]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
          >
            Client <span className="text-indigo-500">Perspectives</span>
          </motion.h2>
          <div className="w-20 h-1 bg-indigo-600 rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={feedbacks[currentIndex]?._id || currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="bg-zinc-900/50 border border-zinc-800 p-12 md:p-16 rounded-[3rem] relative text-center"
            >
              <Quote className="absolute top-10 left-10 text-indigo-600/20 w-20 h-20" />
              
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < feedbacks[currentIndex].rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'} 
                  />
                ))}
              </div>

              <p className="text-xl md:text-2xl text-zinc-300 italic leading-relaxed mb-10">
                &quot;{feedbacks[currentIndex].comment}&quot;
              </p>

              <div>
                <h4 className="text-white font-bold text-lg">{feedbacks[currentIndex].clientName}</h4>
                <p className="text-indigo-500 font-medium">{feedbacks[currentIndex].clientCompany}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-12">
            <button 
              onClick={prev}
              className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full hover:text-white hover:border-zinc-700 transition-all active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full hover:text-white hover:border-zinc-700 transition-all active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSlider;
