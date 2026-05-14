'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Hero from './Hero';

const About = dynamic(() => import('./About'), { ssr: false });
const Skills = dynamic(() => import('./Skills'), { ssr: false });
const FeedbackSlider = dynamic(() => import('./FeedbackSlider'), { ssr: false });
const ContactForm = dynamic(() => import('./ContactForm'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

const PortfolioSkeleton = () => (
  <div className="min-h-screen bg-[#050510]">
    <div className="max-w-7xl mx-auto px-6 pt-32">
      {/* Hero Skeleton - Match height better */}
      <div className="h-[75vh] bg-white/5 rounded-[3rem] mb-12 animate-pulse flex items-center justify-center">
         <div className="w-48 h-48 rounded-full bg-white/5" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
        <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
        <div className="h-64 bg-white/5 rounded-[2rem] animate-pulse" />
      </div>
    </div>
  </div>
);

export default function PortfolioContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, settingsRes, feedbackRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/settings'),
          axios.get('/api/feedback')
        ]);
        
        setData({
          profile: profileRes.data,
          settings: settingsRes.data,
          feedbacks: feedbackRes.data.filter((f: any) => f.isApproved)
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PortfolioSkeleton />;
  
  if (!data?.profile || !data?.settings || !data.profile._id) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Under Construction</h1>
          <p>Please check back later or set up your profile in the admin panel.</p>
        </div>
      </div>
    );
  }

  const { profile, settings, feedbacks } = data;

  const isSectionActive = (name: string) => {
    const section = settings.sectionsStatus?.find((s: any) => s.sectionName === name);
    return section ? section.isActive : true;
  };

  return (
    <>
      {isSectionActive('Hero') && (
        <Hero 
          name={profile.name} 
          headline={profile.headline} 
          profileImage={profile.profileImage}
          socialLinks={settings.socialLinks}
        />
      )}

      {isSectionActive('About') && (
        <About 
          problem={profile.bioProblem} 
          agitate={profile.bioAgitate} 
          solution={profile.bioSolution} 
        />
      )}

      {isSectionActive('Skills') && (
        <Skills skills={profile.skills} />
      )}

      {isSectionActive('Testimonials') && (
        <FeedbackSlider feedbacks={feedbacks} />
      )}

      {isSectionActive('Contact') && (
        <ContactForm />
      )}

      <Footer siteName={settings.siteName} socialLinks={settings.socialLinks} />
    </>
  );
}
