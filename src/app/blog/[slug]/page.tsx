import React from 'react';
import { Metadata } from 'next';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import '@/models/Category';
import Navbar from '@/components/Navbar';

const Footer = dynamic(() => import('@/components/Footer'));

async function getBlogPost(slug: string) {
  await dbConnect();
  return Blog.findOne({ slug, isPublished: true }).populate('category').lean();
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog: any = await getBlogPost(params.slug);
  return {
    title: blog ? `${blog.title} | Blog` : 'Blog Post Not Found',
    description: blog?.title,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const blog: any = await getBlogPost(params.slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-indigo-500 font-bold hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />
      
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 font-bold"
          >
            <ChevronLeft size={20} /> Back to Insights
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-indigo-600/10 text-indigo-500 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-indigo-500/20">
                {blog.category?.name}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
                <Calendar size={16} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              {blog.title}
            </h1>
            <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
              <Image 
                src={blog.coverImage} 
                alt={blog.title} 
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </header>

          <div 
            className="prose prose-invert prose-indigo max-w-none prose-lg
              prose-headings:font-black prose-headings:tracking-tighter
              prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-strong:text-white prose-a:text-indigo-400
              prose-img:rounded-3xl prose-img:border prose-img:border-white/5"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
          
          <div className="mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-2">Category</h4>
              <div className="flex items-center gap-2 text-white font-bold">
                <Tag size={18} className="text-indigo-500" />
                {blog.category?.name}
              </div>
            </div>
            <Link 
              href="/#contact"
              className="bg-white text-black px-8 py-4 rounded-full font-black hover:scale-105 transition-all shadow-xl"
            >
              Discuss a Project
            </Link>
          </div>
        </div>
      </article>

      <Footer siteName="D Marketing Media" />
    </div>
  );
}