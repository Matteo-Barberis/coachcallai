
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import EnhancedTestimonials from '@/components/EnhancedTestimonials';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import FeaturesShowcase from '@/components/FeaturesShowcase';
import DashboardPreview from '@/components/DashboardPreview';
import UseCaseShowcase from '@/components/UseCaseShowcase';
import CoachVoiceShowcase from '@/components/CoachVoiceShowcase';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <HowItWorks />
        <DashboardPreview />
        <UseCaseShowcase />
        <CoachVoiceShowcase />
        <EnhancedTestimonials />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
};

export default Index;
