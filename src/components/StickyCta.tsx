import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionContext } from '@/context/SessionContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/hooks/useTheme";
import { useChromeViewport } from "@/hooks/useChromeViewport";

const StickyCta = () => {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const location = useLocation();
  const theme = useTheme();
  const chromeBottomOffset = useChromeViewport();
  
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down 500px
      const scrollThreshold = 500;
      if (window.scrollY > scrollThreshold) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const getContent = () => {
    if (location.pathname === '/mindfulness') {
      return {
        text: "Join our mindful community",
        buttonText: "Start Your Journey",
        buttonClass: theme.gradient
      };
    } else if (location.pathname === '/accountability') {
      return {
        text: "Join our community of goal-oriented people",
        buttonText: session ? "Go to Dashboard" : "Get Your First AI Call",
        buttonClass: theme.gradient
      };
    } else {
      return {
        text: "Create your perfect AI companion",
        buttonText: "Create Your AI Companion",
        buttonClass: theme.gradient
      };
    }
  };

  const content = getContent();

  return (
    <div 
      className={`fixed left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200 transition-all duration-300 transform ${
        visible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}
      style={{ 
        bottom: chromeBottomOffset > 0 ? `${chromeBottomOffset}px` : 0 
      }}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex -space-x-2 mr-3">
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//liv.png" alt="Liv" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//jed.png" alt="Jed" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white w-8 h-8">
              <AvatarImage src="https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//matteo.jpg" alt="Matteo" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </div>
          <p className="font-medium text-gray-700">
            {content.text}
          </p>
        </div>
        <Button 
          className={`text-base py-4 px-6 text-white whitespace-nowrap ${content.buttonClass} hover:opacity-90`}
          onClick={handleButtonClick}
        >
          {content.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default StickyCta;
