'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Trash2, Plus, List, PenTool, Search, Bell, User } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import Sidebar from '@/components/admin/Sidebar';

// @ts-ignore
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-900 animate-pulse rounded-lg" />
});

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list',
  'link', 'image', 'video'
];

const AdminBlogsContent = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('write');
  
  // Category Form
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  // Blog Form
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsRes, catsRes] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/categories')
      ]);
      const blogsData = await blogsRes.json();
      const catsData = await catsRes.json();
      
      setBlogs(Array.isArray(blogsData) ? blogsData : (blogsData?.data || []));
      setCategories(Array.isArray(catsData) ? catsData : (catsData?.data || []));
    } catch (error) {
      console.error('Error fetching data:', error);
      setBlogs([]);
      setCategories([]);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: catName, slug: catSlug })
    });
    if (res.ok) {
      setCatName('');
      setCatSlug('');
      fetchData();
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/blogs', {
      method: 'POST',
      body: JSON.stringify({ title, slug, content, coverImage, category, isPublished })
    });
    if (res.ok) {
      setTitle('');
      setSlug('');
      setContent('');
      setCoverImage('');
      setCategory('');
      setIsPublished(false);
      fetchData();
      setActiveTab('manage');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl w-96 group focus-within:border-indigo-500/50 transition-all">
            <Search size={18} className="text-zinc-500 group-focus-within:text-indigo-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3 text-white">
              <PenTool className="text-indigo-500" />
              Blog Management
            </h1>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
              >
                <Plus size={18} /> Manage Categories
              </button>
              <button 
                onClick={() => setActiveTab('write')}
                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'write' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
              >
                <Plus size={18} /> Write Blog
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
              >
                <List size={18} /> Manage Blogs
              </button>
            </div>

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                  <h2 className="text-xl font-bold mb-6 text-white">Create Category</h2>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <input 
                      type="text" placeholder="Category Name" value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    />
                    <input 
                      type="text" placeholder="Category Slug" value={catSlug}
                      onChange={(e) => setCatSlug(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    />
                    <button type="submit" className="w-full bg-indigo-600 p-3 rounded-xl font-bold hover:bg-indigo-700 transition-all text-white">
                      Add Category
                    </button>
                  </form>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                  <h2 className="text-xl font-bold mb-6 text-white">Existing Categories</h2>
                  <div className="space-y-2">
                    {Array.isArray(categories) ? categories.map((cat: any) => (
                      <div key={cat._id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex justify-between items-center">
                        <span className="text-white">{cat.name}</span>
                        <span className="text-xs text-zinc-500">{cat.slug}</span>
                      </div>
                    )) : <p className="text-zinc-500">Loading categories...</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'write' && (
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                <h2 className="text-xl font-bold mb-6 text-white">New Blog Post</h2>
                <form onSubmit={handleCreateBlog} className="space-y-6 text-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Blog Title" value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    />
                    <input 
                      type="text" placeholder="Slug" value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" placeholder="Cover Image URL" value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    />
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:border-indigo-500 outline-none text-white"
                    >
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-white text-black rounded-xl overflow-hidden">
                    <ReactQuill 
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      formats={formats}
                      className="h-96"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-4">
                    <input 
                      type="checkbox" id="published" checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600"
                    />
                    <label htmlFor="published" className="font-bold text-zinc-300">Publish immediately</label>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 p-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition-all text-white">
                    Create Blog Post
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                <h2 className="text-xl font-bold mb-6 text-white">Manage Blogs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 text-sm uppercase tracking-wider">
                        <th className="pb-4">Blog Title</th>
                        <th className="pb-4">Category</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {Array.isArray(blogs) ? blogs.map((blog: any) => (
                        <tr key={blog._id} className="group hover:bg-zinc-800/30 transition-all">
                          <td className="py-4 font-bold text-white">{blog.title}</td>
                          <td className="py-4 text-zinc-400">{blog.category?.name}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${blog.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {blog.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => handleDeleteBlog(blog._id)}
                              className="p-2 text-zinc-500 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )) : <tr><td colSpan={4} className="py-10 text-center text-zinc-500">Loading blogs...</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
};

export default function AdminBlogs() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Blog Manager...</div>}>
      <AdminBlogsContent />
    </Suspense>
  );
}
