
import React, { useEffect } from 'react';
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

  // Check if user is authenticated and redirect based on onboarding status
  useEffect(() => {
    if (session?.user) {
      const checkOnboardingStatus = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_onboarding')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          if (data.is_onboarding) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        }
      };
      
      checkOnboardingStatus();
    }
  }, [session, navigate]);

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
