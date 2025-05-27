
import React from 'react';
import Header from '@/components/Header';
import CustomHeroSection from '@/components/custom/CustomHeroSection';
import CustomFeaturesShowcase from '@/components/custom/CustomFeaturesShowcase';
import HowItWorks from '@/components/HowItWorks';
import DashboardPreview from '@/components/DashboardPreview';
import CoachVoiceShowcase from '@/components/CoachVoiceShowcase';
import CustomUseCaseShowcase from '@/components/custom/CustomUseCaseShowcase';
import EnhancedTestimonials from '@/components/EnhancedTestimonials';
import PricingSection from '@/components/PricingSection';
import CustomFaqSection from '@/components/custom/CustomFaqSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';

const CustomLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CustomHeroSection />
        <CustomFeaturesShowcase />
        <HowItWorks />
        <DashboardPreview />
        <CoachVoiceShowcase />
        <CustomUseCaseShowcase />
        <EnhancedTestimonials />
        <PricingSection />
        <CustomFaqSection />
        <CtaSection />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
};

export default CustomLanding;
