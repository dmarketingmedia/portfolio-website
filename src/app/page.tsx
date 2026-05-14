export const dynamic = 'force-dynamic';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import FeedbackSlider from '@/components/FeedbackSlider';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Settings from '@/models/Settings';
import Navigation from '@/models/Navigation';
import Feedback from '@/models/Feedback';
import PageWrapper from '@/components/PageWrapper';

async function getPortfolioData() {
  await dbConnect();
  
  // Use lean() to get plain JavaScript objects
  const [profile, settings, navItems, feedbacks] = await Promise.all([
    Profile.findOne().lean(),
    Settings.findOne().lean(),
    Navigation.find().sort({ displayOrder: 1 }).lean(),
    Feedback.find({ isApproved: true }).lean()
  ]);

  return {
    profile: JSON.parse(JSON.stringify(profile)),
    settings: JSON.parse(JSON.stringify(settings)),
    navItems: JSON.parse(JSON.stringify(navItems)),
    feedbacks: JSON.parse(JSON.stringify(feedbacks))
  };
}

export default async function PortfolioPage() {
  const { profile, settings, navItems, feedbacks } = await getPortfolioData();

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

      <Footer siteName={settings.siteName} socialLinks={settings.socialLinks} />
    </PageWrapper>
  );
}
