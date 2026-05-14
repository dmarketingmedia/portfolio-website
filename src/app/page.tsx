export const revalidate = 3600;

import React from 'react';
import Navbar from '@/components/Navbar';
import PageWrapper from '@/components/PageWrapper';
import PortfolioContent from '@/components/PortfolioContent';

export default function PortfolioPage() {
  return (
    <PageWrapper className="bg-[#050510] min-h-screen selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      <PortfolioContent />
    </PageWrapper>
  );
}
