
import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
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

const MindfulnessLanding = () => {
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
    </HelmetProvider>
  );
};

export default MindfulnessLanding;
