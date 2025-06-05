
import React from 'react';
import { Helmet } from 'react-helmet';
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
