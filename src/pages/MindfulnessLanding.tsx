
import React, { useState, useEffect } from 'react';
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
  const [showBadge, setShowBadge] = useState(true);

   // Add scroll event listener to handle badge visibility
   useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Show badge when near top, hide when scrolled down
      setShowBadge(scrollPosition < 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        {/* Custom Bolt.new Badge */}
        <style>
          {`
            .bolt-badge {
              transition: all 0.3s ease;
            }
            @keyframes badgeHover {
              0% { transform: scale(1) rotate(0deg); }
              50% { transform: scale(1.1) rotate(22deg); }
              100% { transform: scale(1) rotate(0deg); }
            }
            .bolt-badge:hover {
              animation: badgeHover 0.6s ease-in-out;
            }
            .badge-container {
              transition: opacity 0.5s ease, transform 0.5s ease;
            }
          `}
        </style>
        <div className={`fixed top-16 right-4 z-50 badge-container  ${showBadge ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
          <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer" 
            className="block transition-all duration-300">
            <img src="/white_circle_360x360.png" 
                alt="Built with Bolt.new badge" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg bolt-badge"
            />
          </a>
        </div>

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
