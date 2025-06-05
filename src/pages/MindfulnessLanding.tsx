
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Coach Call AI | AI Mindfulness Companion for Meditation & Mental Wellness</title>
        <meta name="description" content="Your AI mindfulness companion offering guided meditation, stress relief, and mental wellness support through personalized WhatsApp messages and calming voice calls." />
        
        <meta property="og:title" content="Coach Call AI | AI Mindfulness Companion for Meditation & Mental Wellness" />
        <meta property="og:description" content="Your AI mindfulness companion offering guided meditation, stress relief, and mental wellness support through personalized WhatsApp messages and calming voice calls." />
        <meta property="og:url" content="https://coachcall.ai/mindfulness" />
        
        <meta property="twitter:title" content="Coach Call AI | AI Mindfulness Companion for Meditation & Mental Wellness" />
        <meta property="twitter:description" content="Your AI mindfulness companion offering guided meditation, stress relief, and mental wellness support through personalized WhatsApp messages and calming voice calls." />
        <meta property="twitter:url" content="https://coachcall.ai/mindfulness" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Coach Call AI - Mindfulness",
            "description": "Your AI mindfulness companion offering guided meditation, stress relief, and mental wellness support through personalized WhatsApp messages and calming voice calls.",
            "url": "https://coachcall.ai/mindfulness",
            "image": "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//og_image.png"
          })}
        </script>
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
  );
};

export default MindfulnessLanding;
