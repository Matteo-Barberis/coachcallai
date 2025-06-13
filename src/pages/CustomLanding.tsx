
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import SEO from '@/components/SEO';
import { generateSEOData } from '@/utils/seoData';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';

const CustomLanding = () => {
  const location = useLocation();
  const seoData = generateSEOData(location.pathname);
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const [showBadge, setShowBadge] = useState(true);

  // Only redirect users who haven't completed onboarding
  useEffect(() => {
    if (session?.user) {
      const checkOnboardingStatus = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_onboarding')
          .eq('id', session.user.id)
          .single();

        if (!error && data && data.is_onboarding) {
          navigate('/onboarding');
        }
      };
      
      checkOnboardingStatus();
    }
  }, [session, navigate]);

    // Add scroll event listener to handle badge visibility
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        // Show badge when near top, hide when scrolled down
        // Adjust the threshold (300) as needed
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
        routeKey="custom-landing"
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
        <div className={`fixed top-16 right-4 z-50 badge-container hidden ${showBadge ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
          <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer" 
            className="block transition-all duration-300">
            <img src="/white_circle_360x360.png" 
                alt="Built with Bolt.new badge" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg bolt-badge"
            />
          </a>
        </div>

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
