
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
      <Helmet defer={false} encodeSpecialCharacters={false}>
        <title>Coach Call AI | AI Mindfulness Companion for Inner Peace & Self-Love</title>
        <meta key="mindfulness-description" name="description" content="Your personal AI mindfulness companion for daily guidance, gratitude practices, and mindful moments. Nurture inner peace and self-love through WhatsApp and voice call support." />
        <meta key="mindfulness-og-title" property="og:title" content="Coach Call AI | AI Mindfulness Companion for Inner Peace" />
        <meta key="mindfulness-og-description" property="og:description" content="Experience daily guidance, gratitude practices, and mindful moments with an AI companion designed to nurture your inner well-being and self-love journey." />
        <meta key="mindfulness-og-url" property="og:url" content="https://coachcall.ai/mindfulness" />
        <meta key="mindfulness-twitter-title" property="twitter:title" content="Coach Call AI | AI Mindfulness Companion for Inner Peace" />
        <meta key="mindfulness-twitter-description" property="twitter:description" content="Experience daily guidance, gratitude practices, and mindful moments with an AI companion designed to nurture your inner well-being and self-love journey." />
        <meta key="mindfulness-twitter-url" property="twitter:url" content="https://coachcall.ai/mindfulness" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Coach Call AI - Mindfulness Companion",
            "description": "Your personal AI mindfulness companion for daily guidance, gratitude practices, and mindful moments. Nurture inner peace and self-love through WhatsApp and voice call support.",
            "url": "https://coachcall.ai/mindfulness",
            "applicationCategory": "HealthApplication",
            "keywords": "mindfulness, meditation, self-love, gratitude, inner peace, AI companion",
            "operatingSystem": "Web, WhatsApp",
            "offers": {
              "@type": "Offer",
              "description": "AI mindfulness coaching with daily guidance and gratitude practices"
            }
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
