'use client';

import React from 'react';
import { Globe, User, Mail, ArrowUp } from 'lucide-react';
interface FooterProps {
  siteName: string;
  socialLinks?: { platform: string; url: string }[];
}

const Footer: React.FC<FooterProps> = ({ siteName, socialLinks }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return Globe; 
    case 'linkedin':
      return User;  
    case 'twitter':
      return Mail;  
    default:
      return Globe;
  }
};

  return (
    <footer className="py-12 bg-[#050510] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="text-2xl font-bold text-white tracking-tighter mb-2 uppercase">
            {siteName}<span className="text-indigo-500">.</span>
          </div>
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks && socialLinks.map((social, i) => {
            const Icon = getIcon(social.platform);
            return (
              <a 
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <button 
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-widest">Back to top</span>
          <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-all">
            <ArrowUp size={16} />
          </div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
