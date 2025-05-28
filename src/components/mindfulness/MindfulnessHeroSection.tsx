
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Star, Sun, PhoneCall, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const MindfulnessHeroSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGetStarted = () => {
    navigate('/auth/sign-up');
  };

  return (
    <section className="pt-12 pb-16 px-4 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="flex flex-col space-y-8 animate-fade-in">
          <div>
            <div className="flex mb-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${theme.titleGradient}`}>
              Your Personal AI Companion for Inner Peace
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Experience daily guidance, gratitude practices, and mindful moments with an AI companion designed to nurture your inner well-being and self-love journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className={`text-base md:text-lg py-6 px-8 ${theme.gradient} hover:opacity-90`}
                onClick={handleGetStarted}
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                className={`text-base md:text-lg py-6 px-8 ${theme.border} ${theme.primary} ${theme.hover}`}
              >
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm md:text-base text-gray-500">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-1 mr-2">
                <PhoneCall className="w-4 h-4 text-green-600" />
              </div>
              <span>Voice Calls</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-1 mr-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span>WhatsApp Integration</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-1 mr-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* Right side - Chat/Phone mockup */}
        <div className="relative">
          <div className="relative z-10">
            {/* Phone mockup */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Serenity</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
                <PhoneCall className="w-6 h-6 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-700">Good morning! Take a moment to breathe deeply and set a positive intention for your day. What are you grateful for today? 🌸</p>
                </div>
                
                <div className="bg-gray-100 rounded-2xl p-4 ml-8">
                  <p className="text-sm text-gray-700">I'm grateful for this peaceful morning and the opportunity to start fresh</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                  <p className="text-sm text-gray-700">Beautiful! Let's carry that gratitude with us. Would you like a 5-minute mindfulness exercise? ✨</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">Active now</div>
              </div>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-50 animate-float"></div>
          <div className="absolute bottom-8 left-4 w-16 h-16 bg-gradient-to-r from-pink-200 to-orange-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 -left-4 w-12 h-12 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default MindfulnessHeroSection;
