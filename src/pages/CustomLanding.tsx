
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
    <div className="min-h-screen bg-white">
      <Helmet defer={false} encodeSpecialCharacters={false}>
        <title>Coach Call AI | Your Personal AI Companion for Life Support & Guidance</title>
        <meta name="description" content="Meet your AI companion that's always by your side on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs." />
        <meta property="og:title" content="Coach Call AI | Your Personal AI Companion for Life Support" />
        <meta property="og:description" content="Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it." />
        <meta property="og:url" content="https://coachcall.ai/" />
        <meta property="twitter:title" content="Coach Call AI | Your Personal AI Companion for Life Support" />
        <meta property="twitter:description" content="Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it." />
        <meta property="twitter:url" content="https://coachcall.ai/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Coach Call AI - Personal AI Companion",
            "description": "Your ever-present AI companion on WhatsApp and voice calls. Get personalized support, gentle reminders, and empathetic conversations tailored to your unique style and needs.",
            "url": "https://coachcall.ai/",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web, WhatsApp",
            "offers": {
              "@type": "Offer",
              "description": "AI companion services with WhatsApp integration and voice calls"
            }
          })}
        </script>
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
  );
};

export default CustomLanding;
