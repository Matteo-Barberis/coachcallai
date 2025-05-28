
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
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="flex flex-col space-y-8 animate-fade-in">
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
            <div className="flex flex-col sm:flex-row gap-4">
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
          </div>

          <div className="flex items-center space-x-4 text-sm md:text-base text-gray-500">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-1 mr-2">
                <PhoneCall className="w-4 h-4 text-green-600" />
              </div>
              <span>Phone Call Check-ins</span>
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

        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md animate-float">
            <div className={`absolute -top-6 -left-6 w-24 h-24 rounded-full ${theme.light} opacity-70`}></div>
            <div className={`absolute -bottom-10 -right-6 w-32 h-32 rounded-full ${theme.light} opacity-70`}></div>
            
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
              <div className="h-14 bg-gray-100 flex items-center px-4 border-b">
                <div className={`w-10 h-10 rounded-full ${theme.gradient} flex-shrink-0`}></div>
                <div className="ml-3">
                  <div className="h-3 w-32 bg-gray-300 rounded-full"></div>
                  <div className="h-2 w-20 bg-gray-200 rounded-full mt-2"></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <div className={`${theme.gradient} rounded-2xl p-5 text-white mb-4 max-w-xs ml-auto`}>
                  Hey! How's your progress with the 5K training? I noticed you missed yesterday's run.
                </div>
                <div className="bg-gray-200 rounded-2xl p-5 text-gray-800 mb-4 max-w-xs">
                  I got caught up with work yesterday. Planning to catch up today!
                </div>
                <div className={`${theme.gradient} rounded-2xl p-5 text-white mb-4 max-w-xs ml-auto`}>
                  Great! I'll call you at 6pm to confirm. Does that work for you?
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
    </section>
  );
};

export default HeroSection;
