
import React from 'react';
import { useLocation } from 'react-router-dom';
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
import SEO from '@/components/SEO';
import { generateSEOData } from '@/utils/seoData';

const Index = () => {
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
        routeKey="accountability-landing"
      />
      <Header />
      <main>
        <HeroSection />
        <FeaturesShowcase />
        <HowItWorks />
        <DashboardPreview />
        <CoachVoiceShowcase />
        <UseCaseShowcase />
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
