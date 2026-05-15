export const revalidate = 3600;

import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Settings from '@/models/Settings';
import Feedback from '@/models/Feedback';
import PageWrapper from '@/components/PageWrapper';

const About = dynamic(() => import('@/components/About'), { ssr: true });
const Skills = dynamic(() => import('@/components/Skills'), { ssr: true });
const FeedbackSlider = dynamic(() => import('@/components/FeedbackSlider'), { ssr: true });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

async function getPortfolioData() {
  await dbConnect();
  
  // Fetching data from database
  // In SSG mode with revalidate, this happens at build time or in the background
  const [profile, settings, feedbacks] = await Promise.all([
    Profile.findOne().lean(),
    Settings.findOne().lean(),
    Feedback.find({ isApproved: true }).lean()
  ]);

  return {
    profile: JSON.parse(JSON.stringify(profile)),
    settings: JSON.parse(JSON.stringify(settings)),
    feedbacks: JSON.parse(JSON.stringify(feedbacks))
  };
}

export default async function PortfolioPage() {
  const { profile, settings, feedbacks } = await getPortfolioData();

  if (!profile || !settings) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center text-zinc-500">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Under Construction</h1>
          <p>Please check back later or set up your profile in the admin panel.</p>
        </div>
      </div>
    );
  }

  const isSectionActive = (name: string) => {
    const section = settings.sectionsStatus?.find((s: any) => s.sectionName === name);
    return section ? section.isActive : true;
  };

  return (
    <PageWrapper className="bg-[#050510] min-h-screen selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      
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

      <Footer siteName={settings.siteName || 'Portfolio'} socialLinks={settings.socialLinks} />
    </PageWrapper>
  );
}
