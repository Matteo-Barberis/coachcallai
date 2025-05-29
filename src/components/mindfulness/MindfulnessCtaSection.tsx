import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Star, Sun } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
const MindfulnessCtaSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleGetStarted = () => {
    navigate('/auth/sign-up');
  };
  return <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Begin Your Journey to Inner Peace Today
        </h2>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Your perfect AI companion is waiting to guide you toward greater self-love, gratitude, and mindful living. Start with a free trial and experience the transformation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100" onClick={handleGetStarted}>
            Start Your Free Trial
          </Button>
          
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>No commitment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Start immediately</span>
          </div>
        </div>
      </div>
    </section>;
};
export default MindfulnessCtaSection;