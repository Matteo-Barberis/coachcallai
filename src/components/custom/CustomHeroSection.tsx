
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PhoneCall, MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from '@/context/SessionContext';

const CustomHeroSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const location = useLocation();
  const [rotatingWord, setRotatingWord] = useState("Connected");
  const [fadeState, setFadeState] = useState("fade-in");
  const rotatingWords = ["Connected", "Supported", "Understood", "Heard", "Guided", "Comforted", "Empowered"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      // First fade out
      setFadeState("fade-out");
      
      // Then change word and fade in
      setTimeout(() => {
        setRotatingWord(prevWord => {
          const currentIndex = rotatingWords.indexOf(prevWord);
          const nextIndex = (currentIndex + 1) % rotatingWords.length;
          return rotatingWords[nextIndex];
        });
        setFadeState("fade-in");
      }, 300); // This should match the transition duration
      
    }, 3000); // Slightly longer display time for better readability
    
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/auth/sign-up');
    }
  };

  return (
    <section className="pt-20 pb-16 px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Stay {' '}
              <span 
                className={`inline-block relative ${fadeState} border-b-2 border-orange-500 pb-1 text-orange-600`}
                style={{
                  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                  opacity: fadeState === 'fade-in' ? 1 : 0,
                  transform: fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(10px)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
              >{rotatingWord}</span> <br />
              with Your AI Companion
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Your ever-present AI companion on WhatsApp and voice calls. Gentle reminders, tough love, or empathy — the style you need, when you need it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                onClick={handleButtonClick}
              >
                {session ? "Go to Dashboard" : "Create Your AI Companion"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                See How It Works
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Voice Calls</p>
                  <p className="text-sm text-gray-600">Personal conversations</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Daily Check-ins</p>
                  <p className="text-sm text-gray-600">WhatsApp support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Progress Tracking</p>
                  <p className="text-sm text-gray-600">Growth insights</p>
                </div>
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Your Companion</p>
                      <p className="text-sm text-green-500">Online</p>
                    </div>
                  </div>
                  <PhoneCall className="w-6 h-6 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-700">Hey! I noticed you seemed stressed earlier. Want to talk about what's on your mind?</p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-2xl p-4 ml-8">
                    <p className="text-sm text-gray-700">Yeah, work has been overwhelming lately. Thanks for checking in.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-4">
                    <p className="text-sm text-gray-700">I'm always here for you. Should I call you in a few minutes so we can chat?</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Active now</div>
                </div>
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full opacity-50 animate-float"></div>
            <div className="absolute bottom-8 left-4 w-16 h-16 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomHeroSection;
