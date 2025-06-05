
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const CustomLanding = () => {
  const location = useLocation();
  console.log('🌐 CustomLanding location:', location);
  
  const seoData = generateSEOData(location.pathname);
  console.log('📊 CustomLanding seoData:', seoData);

  useEffect(() => {
    console.log('🔄 CustomLanding useEffect - Route changed to:', location.pathname);
    
    // Check initial DOM state
    const initialMeta = document.querySelector('meta[name="description"]');
    console.log('🏁 Initial meta description on route change:', initialMeta?.getAttribute('content'));
  }, [location.pathname]);

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
