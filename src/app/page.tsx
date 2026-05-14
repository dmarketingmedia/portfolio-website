export const revalidate = 60;

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Settings from '@/models/Settings';
import Navigation from '@/models/Navigation';
import Feedback from '@/models/Feedback';
import PageWrapper from '@/components/PageWrapper';

const About = dynamic(() => import('@/components/About'));
const Skills = dynamic(() => import('@/components/Skills'));
const FeedbackSlider = dynamic(() => import('@/components/FeedbackSlider'));
const ContactForm = dynamic(() => import('@/components/ContactForm'));
const Footer = dynamic(() => import('@/components/Footer'));

async function getPortfolioData() {
  await dbConnect();
  
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

const PortfolioSkeleton = () => (
  <div className="min-h-screen bg-[#050510] animate-pulse">
    <div className="max-w-7xl mx-auto px-6 pt-32">
      <div className="h-[500px] bg-white/5 rounded-[3rem] mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="h-64 bg-white/5 rounded-[2rem]" />
        <div className="h-64 bg-white/5 rounded-[2rem]" />
        <div className="h-64 bg-white/5 rounded-[2rem]" />
      </div>
    </div>
  </div>
);

async function DynamicPortfolio() {
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

export default function PortfolioPage() {
  return (
    <PageWrapper className="bg-[#050510] min-h-screen selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      <Suspense fallback={<PortfolioSkeleton />}>
        <DynamicPortfolio />
      </Suspense>
    </PageWrapper>
  );
}
