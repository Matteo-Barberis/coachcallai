
import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import CustomHeroSection from '@/components/custom/CustomHeroSection';
import CustomFeaturesShowcase from '@/components/custom/CustomFeaturesShowcase';
import CustomHowItWorks from '@/components/custom/CustomHowItWorks';
import DashboardPreview from '@/components/DashboardPreview';
import CustomCoachVoiceShowcase from '@/components/custom/CustomCoachVoiceShowcase';
import CustomUseCaseShowcase from '@/components/custom/CustomUseCaseShowcase';
import EnhancedTestimonials from '@/components/EnhancedTestimonials';
import PricingSection from '@/components/PricingSection';
import CustomFaqSection from '@/components/custom/CustomFaqSection';
import CustomCtaSection from '@/components/custom/CustomCtaSection';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';

const CustomLanding = () => {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>Coach Call AI | Your Personal AI Companion for Life Support & Guidance</title>
          <meta name="description" content="Meet your AI companion that's always by your side on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs." />
          <meta property="og:title" content="Coach Call AI | Your Personal AI Companion for Life Support" />
          <meta property="og:description" content="Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it." />
          <meta name="twitter:title" content="Coach Call AI | Your Personal AI Companion for Life Support" />
          <meta name="twitter:description" content="Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it." />
        </Helmet>
        <Header />
        <main>
          <CustomHeroSection />
          <CustomFeaturesShowcase />
          <CustomHowItWorks />
          <DashboardPreview />
          <CustomCoachVoiceShowcase />
          <CustomUseCaseShowcase />
          <EnhancedTestimonials />
          <PricingSection />
          <CustomFaqSection />
          <CustomCtaSection />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </HelmetProvider>
  );
};

export default CustomLanding;
