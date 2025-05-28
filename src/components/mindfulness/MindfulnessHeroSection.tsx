
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
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="flex flex-col space-y-8 animate-fade-in">
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
                <span>Daily Check-ins</span>
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
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md animate-float">
              <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full ${theme.light} opacity-70`}></div>
              <div className={`absolute -bottom-10 -right-6 w-32 h-32 rounded-full ${theme.light} opacity-70`}></div>
              
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
                <div className="h-14 bg-gray-100 flex items-center px-4 border-b">
                  <div className={`w-10 h-10 rounded-full ${theme.gradient} flex-shrink-0 flex items-center justify-center`}>
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Coach Call AI</p>
                    <p className="text-sm text-green-500">Online</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50">
                  <div className={`${theme.gradient} rounded-2xl p-5 text-white mb-4 max-w-xs ml-auto`}>
                    Good morning! Take a moment to breathe deeply and set a positive intention for your day. What are you grateful for today? 🌸
                  </div>
                  
                  <div className="bg-gray-200 rounded-2xl p-5 text-gray-800 mb-4 max-w-xs">
                    I'm grateful for this peaceful morning and the opportunity to start fresh
                  </div>
                  
                  <div className={`${theme.gradient} rounded-2xl p-5 text-white mb-4 max-w-xs ml-auto`}>
                    Beautiful! Let's carry that gratitude with us. Would you like a 5-minute mindfulness exercise? ✨
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="flex-grow h-12 bg-white rounded-full border border-gray-200 flex items-center px-4">
                      <div className="h-3 w-32 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${theme.gradient} flex items-center justify-center ml-2 flex-shrink-0`}>
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-16 -right-12 z-20 rounded-2xl shadow-xl bg-white p-3 border border-gray-100 animate-pulse-light">
                <div className="w-64 p-3">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">Incoming Call</div>
                      <div className="text-xs text-gray-500">Coach Call AI</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2 px-2">
                      <Button variant="outline" className="w-full text-sm bg-gray-100 hover:bg-gray-200 border-gray-200">
                        Decline
                      </Button>
                    </div>
                    <div className="w-1/2 px-2">
                      <Button className="w-full text-sm bg-green-500 hover:bg-green-600">
                        Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MindfulnessHeroSection;
