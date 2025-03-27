
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const StickyCta = () => {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  
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

  const handleEarlyAccess = () => {
    navigate('/onboarding');
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200 transition-all duration-300 transform ${
        visible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="flex -space-x-2 mr-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-brand-secondary border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-brand-accent border-2 border-white"></div>
          </div>
          <p className="font-medium text-gray-700">
            Join our community of goal-oriented people
          </p>
        </div>
        <Button 
          className="text-base py-4 px-6 bg-brand-primary hover:bg-brand-primary/90 whitespace-nowrap"
          onClick={handleEarlyAccess}
        >
          Get Your First AI Call
        </Button>
      </div>
    </div>
  );
};

export default StickyCta;
