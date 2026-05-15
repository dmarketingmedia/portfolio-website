export const dynamic = 'force-static';
export const revalidate = 3600;

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import Settings from '@/models/Settings';
import Feedback from '@/models/Feedback';
import PageWrapper from '@/components/PageWrapper';
import MarketingGraphLoader from '@/components/MarketingGraphLoader';

const About = dynamicImport(() => import('@/components/About'), { ssr: true });
const Skills = dynamicImport(() => import('@/components/Skills'), { ssr: true });
const FeedbackSlider = dynamicImport(() => import('@/components/FeedbackSlider'), { ssr: true });
const ContactForm = dynamicImport(() => import('@/components/ContactForm'), { ssr: true });
const Footer = dynamicImport(() => import('@/components/Footer'), { ssr: true });

// Wrap database queries with unstable_cache to ensure they are cached during the static build
const getCachedPortfolioData = unstable_cache(
  async () => {
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
  },
  ['portfolio-data'],
  { revalidate: 3600, tags: ['portfolio'] }
);

async function PortfolioContent() {
  const { profile, settings, feedbacks } = await getCachedPortfolioData();

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

      <Footer siteName={settings.siteName || 'Portfolio'} socialLinks={settings.socialLinks} />
    </>
  );
}

export default function PortfolioPage() {
  return (
    <PageWrapper className="bg-[#050510] min-h-screen selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      <Suspense fallback={<MarketingGraphLoader />}>
        <PortfolioContent />
      </Suspense>
    </PageWrapper>
  );
}
