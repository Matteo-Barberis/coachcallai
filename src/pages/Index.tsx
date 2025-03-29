
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import DashboardPreview from '@/components/DashboardPreview';
import UseCaseShowcase from '@/components/UseCaseShowcase';
import HowItWorks from '@/components/HowItWorks';
import TestimonialsSection from '@/components/TestimonialsSection';
import EnhancedTestimonials from '@/components/EnhancedTestimonials';
import PricingSection from '@/components/PricingSection';
import FaqSection from '@/components/FaqSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';
import StickyCta from '@/components/StickyCta';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        
        {/* Feature Showcase Carousel */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Personalized Coaching Experience</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our AI-powered coaches provide tailored support through multiple channels to fit your lifestyle.</p>
            </div>
            <FeatureShowcase />
          </div>
        </section>
        
        {/* Dashboard Preview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Track Your Journey</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our intuitive dashboard captures every achievement and milestone, turning your efforts into visible progress.</p>
            </div>
            <DashboardPreview />
          </div>
        </section>
        
        <FeaturesSection />
        
        {/* Use Case Showcase */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">How Will Your Coach Help You?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">See how our coaching integrates seamlessly into your daily life to drive results.</p>
            </div>
            <UseCaseShowcase />
          </div>
        </section>
        
        <HowItWorks />
        
        {/* Enhanced Testimonials instead of regular ones */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Real Results From Real Users</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">See how our coaching has transformed lives and helped people achieve their goals.</p>
            </div>
            <EnhancedTestimonials />
          </div>
        </section>
        
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
