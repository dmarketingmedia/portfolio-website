'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import ProfileEditor from '@/components/admin/ProfileEditor';
import NavigationManager from '@/components/admin/NavigationManager';
import SettingsPanel from '@/components/admin/SettingsPanel';
import LeadsFeedback from '@/components/admin/LeadsFeedback';
import { Bell, Search, User } from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileEditor />;
      case 'navigation':
        return <NavigationManager />;
      case 'settings':
        return <SettingsPanel />;
      case 'leads':
        return <LeadsFeedback />;
      default:
        return <ProfileEditor />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl w-96 group focus-within:border-indigo-500/50 transition-all">
            <Search size={18} className="text-zinc-500 group-focus-within:text-indigo-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder-zinc-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950" />
            </button>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">Fahad Mahbub</p>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:border-indigo-500/50 transition-all">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Admin Panel...</div>}>
      <AdminContent />
    </Suspense>
  );
}
