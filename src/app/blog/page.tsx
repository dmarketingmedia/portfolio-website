'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const Footer = dynamic(() => import('@/components/Footer'));

const BlogPage = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [blogsRes, catsRes] = await Promise.all([
      fetch('/api/blogs'),
      fetch('/api/categories')
    ]);
    const blogsData = await blogsRes.json();
    const catsData = await catsRes.json();
    setBlogs(blogsData.filter((b: any) => b.isPublished));
    setCategories(catsData);
  };

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category?._id === selectedCategory);

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      {/* Assuming Navbar needs some props, but for now keeping it simple or matching project pattern */}
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black mb-6 tracking-tighter"
            >
              Latest <span className="text-indigo-500">Insights</span>
            </motion.h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
              Exploring the intersection of digital marketing, technology, and business growth.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
            >
              All Posts
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedCategory === cat._id ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden group hover:border-zinc-700 transition-all flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={blog.coverImage} 
                    alt={blog.title} 
                    fill
                    priority={i < 3}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {blog.category?.name}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-zinc-500 text-xs mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                    {blog.title}
                  </h2>
                  <div className="mt-auto pt-6">
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="flex items-center gap-2 text-indigo-500 font-bold group/link"
                    >
                      Read Article 
                      <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 text-zinc-500 font-bold">
              No articles found in this category.
            </div>
          )}
        </div>
      </section>

      <Footer siteName="D Marketing Media" />
    </div>
  );
};

export default BlogPage;
