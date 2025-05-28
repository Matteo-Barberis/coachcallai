import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PhoneCall, MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from '@/context/SessionContext';
import { useTheme } from '@/hooks/useTheme';

const HeroSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const location = useLocation();
  const theme = useTheme();
  const [rotatingWord, setRotatingWord] = useState("Accountable");
  const [fadeState, setFadeState] = useState("fade-in");
  const rotatingWords = ["Accountable", "Mindful", "Motivated", "Focused", "Consistent", "Productive", "Happy"];
  
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
    // On home page (path is "/") always navigate to sign-up
    if (location.pathname === "/") {
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth/sign-up');
      }
    } else {
      // On other pages, maintain existing behavior
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/auth/sign-up');
      }
    }
  };

  return (
    <section className="pt-12 pb-16 px-4 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${theme.titleGradient}`}>
              Stay {' '}
              <span 
                className={`inline-block relative ${fadeState} border-b-2 ${theme.border} pb-1 ${theme.primary}`}
                style={{
                  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                  opacity: fadeState === 'fade-in' ? 1 : 0,
                  transform: fadeState === 'fade-in' ? 'translateY(0)' : 'translateY(10px)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
              >{rotatingWord}</span> <br />
              with Your Personal AI Coach
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Coach Call AI connects with WhatsApp to send regular check-ins and makes actual phone calls to keep you accountable and on track with your goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                className={`text-base md:text-lg py-6 px-8 ${theme.gradient} hover:opacity-90`}
                onClick={handleButtonClick}
              >
                {location.pathname === "/" && session ? "Go to Dashboard" : "Get Your First AI Call"}
              </Button>
              <Button 
                variant="outline" 
                className={`text-base md:text-lg py-6 px-8 ${theme.border} ${theme.primary} ${theme.hover}`}
                onClick={() => window.location.href = "#how-it-works"}
              >
                See How It Works
              </Button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
              <div className="flex md:items-center space-x-2 md:space-x-3 flex-col md:flex-row items-center md:items-center text-center md:text-left">
                <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full ${theme.gradient} flex items-center justify-center flex-shrink-0 mb-1 md:mb-0`}>
                  <PhoneCall className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-base md:font-semibold text-gray-900">Voice Calls</p>
                  <p className="text-sm text-gray-600 hidden md:block">Personal conversations</p>
                </div>
              </div>
              
              <div className="flex md:items-center space-x-2 md:space-x-3 flex-col md:flex-row items-center md:items-center text-center md:text-left">
                <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full ${theme.gradient} flex items-center justify-center flex-shrink-0 mb-1 md:mb-0`}>
                  <MessageCircle className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-base md:font-semibold text-gray-900">Daily Check-ins</p>
                  <p className="text-sm text-gray-600 hidden md:block">WhatsApp support</p>
                </div>
              </div>
              
              <div className="flex md:items-center space-x-2 md:space-x-3 flex-col md:flex-row items-center md:items-center text-center md:text-left">
                <div className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full ${theme.gradient} flex items-center justify-center flex-shrink-0 mb-1 md:mb-0`}>
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-base md:font-semibold text-gray-900">Progress Tracking</p>
                  <p className="text-sm text-gray-600 hidden md:block">Growth insights</p>
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
                    <div className={`w-10 h-10 rounded-full ${theme.gradient} flex items-center justify-center`}>
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
                  <div className={`${theme.light} rounded-2xl p-4`}>
                    <p className="text-sm text-gray-700">Hey! How's your progress with the 5K training? I noticed you missed yesterday's run.</p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-2xl p-4 ml-8">
                    <p className="text-sm text-gray-700">I got caught up with work yesterday. Planning to catch up today!</p>
                  </div>
                  
                  <div className={`${theme.light} rounded-2xl p-4`}>
                    <p className="text-sm text-gray-700">Great! I'll call you at 6pm to confirm. Does that work for you?</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <div className="flex-grow h-10 bg-gray-50 rounded-full border border-gray-200 flex items-center px-3">
                    <div className="h-2 w-20 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className={`w-8 h-8 rounded-full ${theme.gradient} flex items-center justify-center ml-2 flex-shrink-0`}>
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
            <div className={`absolute top-4 right-4 w-20 h-20 ${theme.light} rounded-full opacity-50 animate-float`}></div>
            <div className={`absolute bottom-8 left-4 w-16 h-16 ${theme.light} rounded-full opacity-50 animate-float`} style={{ animationDelay: '2s' }}></div>
            <div className={`absolute top-1/2 -left-4 w-12 h-12 ${theme.light} rounded-full opacity-50 animate-float`} style={{ animationDelay: '4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
