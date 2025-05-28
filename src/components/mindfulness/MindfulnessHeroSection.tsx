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
    <section className="pt-12 pb-16 px-4 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                className="text-base md:text-lg py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleGetStarted}
              >
                Start Your Journey
              </Button>
              <Button variant="outline" className="text-base md:text-lg py-6 px-8">
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm md:text-base text-gray-500">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-1 mr-1 sm:mr-2">
                <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <span className="whitespace-nowrap">Voice Calls</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-pink-100 p-1 mr-1 sm:mr-2">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
              </div>
              <span className="whitespace-nowrap">Daily Check-ins</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-1 mr-1 sm:mr-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
              </div>
              <span className="whitespace-nowrap">Progress Tracking</span>
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
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Coach Call AI</p>
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
              
              <div className="mt-4 flex items-center">
                <div className="flex-grow h-10 bg-gray-50 rounded-full border border-gray-200 flex items-center px-3">
                  <div className="h-2 w-20 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center ml-2 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Incoming Call Notification */}
          <div className="absolute -bottom-12 -right-8 z-20 rounded-2xl shadow-xl bg-white p-3 border border-gray-100 animate-pulse-light">
            <div className="w-56 p-3">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-sm">Incoming Call</div>
                  <div className="text-xs text-gray-500">Coach Call AI</div>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button variant="outline" className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 border-gray-200 h-8">
                  Decline
                </Button>
                <Button className="flex-1 text-xs bg-green-500 hover:bg-green-600 h-8">
                  Answer
                </Button>
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
