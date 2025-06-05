
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import MindfulnessHeroSection from '@/components/mindfulness/MindfulnessHeroSection';
import MindfulnessFeaturesShowcase from '@/components/mindfulness/MindfulnessFeaturesShowcase';
import MindfulnessHowItWorks from '@/components/mindfulness/MindfulnessHowItWorks';
import DashboardPreview from '@/components/DashboardPreview';
import MindfulnessCoachVoiceShowcase from '@/components/mindfulness/MindfulnessCoachVoiceShowcase';
import MindfulnessUseCaseShowcase from '@/components/mindfulness/MindfulnessUseCaseShowcase';
import EnhancedTestimonials from '@/components/EnhancedTestimonials';
import PricingSection from '@/components/PricingSection';
import MindfulnessFaqSection from '@/components/mindfulness/MindfulnessFaqSection';
import MindfulnessCtaSection from '@/components/mindfulness/MindfulnessCtaSection';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';
import SEO from '@/components/SEO';
import { generateSEOData } from '@/utils/seoData';

const MindfulnessLanding = () => {
  const location = useLocation();
  const seoData = generateSEOData(location.pathname);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoData.title}
        description={seoData.description}
        ogTitle={seoData.ogTitle}
        ogDescription={seoData.ogDescription}
        twitterTitle={seoData.twitterTitle}
        twitterDescription={seoData.twitterDescription}
        routeKey="mindfulness-landing"
      />
      <Header />
      <main>
        <MindfulnessHeroSection />
        <MindfulnessFeaturesShowcase />
        <MindfulnessHowItWorks />
        <DashboardPreview />
        <MindfulnessCoachVoiceShowcase />
        <MindfulnessUseCaseShowcase />
        <EnhancedTestimonials />
        <PricingSection />
        <MindfulnessFaqSection />
        <MindfulnessCtaSection />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
};

export default MindfulnessLanding;
