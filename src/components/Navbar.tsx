'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';

interface NavItem {
  _id: string;
  label: string;
  path: string;
  displayOrder: number;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [siteName, setSiteName] = useState('Portfolio');
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, settingsRes] = await Promise.all([
          axios.get('/api/navigation'),
          axios.get('/api/settings')
        ]);
        setNavItems(navRes.data);
        if (settingsRes.data && settingsRes.data.siteName) {
          setSiteName(settingsRes.data.siteName);
        }
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Return null if on admin route
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#050510]/80 backdrop-blur-md py-4 border-b border-zinc-800' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white tracking-tighter uppercase cursor-pointer"
          >
            {siteName}<span className="text-indigo-500">.</span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!loading ? (
            <>
              {navItems.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="w-48 h-4 bg-white/5 animate-pulse rounded-full" />
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link
              href="/#contact"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              Hire Me
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {!loading && navItems.map((item) => (
                <Link
                  key={item._id}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-zinc-400 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-center font-bold"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
