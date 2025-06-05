
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet defer={false} encodeSpecialCharacters={false}>
        <title>Coach Call AI | AI Accountability Partner with Phone Calls & WhatsApp</title>
        <meta key="accountability-description" name="description" content="Coach Call AI keeps you accountable through WhatsApp messages and phone calls, helping you achieve your goals and build lasting habits." />
        <meta key="accountability-og-title" property="og:title" content="Coach Call AI | Your AI Accountability Partner" />
        <meta key="accountability-og-description" property="og:description" content="Coach Call AI keeps you accountable through WhatsApp messages and phone calls, helping you achieve your goals and build lasting habits." />
        <meta key="accountability-og-url" property="og:url" content="https://coachcall.ai/accountability" />
        <meta key="accountability-twitter-title" property="twitter:title" content="Coach Call AI | Your AI Accountability Partner" />
        <meta key="accountability-twitter-description" property="twitter:description" content="Coach Call AI keeps you accountable through WhatsApp messages and phone calls, helping you achieve your goals and build lasting habits." />
        <meta key="accountability-twitter-url" property="twitter:url" content="https://coachcall.ai/accountability" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Coach Call AI",
            "description": "Coach Call AI keeps you accountable through WhatsApp messages and phone calls, helping you achieve your goals and build lasting habits.",
            "url": "https://coachcall.ai/accountability",
            "image": "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//og_image.png"
          })}
        </script>
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
