'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  User, 
  Menu, 
  Settings as SettingsIcon, 
  MessageSquare, 
  LayoutDashboard,
  LogOut,
  PenTool,
  Loader2
} from 'lucide-react';

interface SidebarProps {
  // activeTab is kept for backward compatibility if needed, 
  // but we'll primarily use URL state now.
  activeTab?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab');
  const [loggingOut, setLoggingOut] = useState(false);
  
  const menuItems = [
    { id: 'profile', label: 'Profile Editor', icon: User, href: '/admin' },
    { id: 'blogs', label: 'Blog Management', icon: PenTool, href: '/admin/blogs' },
    { id: 'navigation', label: 'Navigation', icon: Menu, href: '/admin?tab=navigation' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, href: '/admin?tab=settings' },
    { id: 'leads', label: 'Leads & Feedback', icon: MessageSquare, href: '/admin?tab=leads' },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback redirect if API fails
      router.push('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  const isItemActive = (item: any) => {
    // Exact match for blogs
    if (item.id === 'blogs') {
      return pathname === '/admin/blogs';
    }
    
    // For main admin routes
    if (pathname === '/admin') {
      if (item.id === 'profile' && !currentTab) return true;
      return currentTab === item.id || currentTab === item.href.split('tab=')[1];
    }

    return false;
  };

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            
            return (
              <Link 
                key={item.id} 
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-800">
        <button 
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          {loggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
