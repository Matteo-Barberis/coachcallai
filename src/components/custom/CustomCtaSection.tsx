
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from '@/context/SessionContext';
import { useTheme } from "@/hooks/useTheme";

const CustomCtaSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const theme = useTheme();

  const handleButtonClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/auth/sign-up');
    }
  };

  return (
    <section className={`py-20 px-4 ${theme.gradient}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Never Feel Alone Again
        </h2>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands who've created their perfect AI companion and found the connection they've been looking for.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className={`text-lg px-8 py-4 bg-white ${theme.primary} hover:bg-gray-100`}
            onClick={handleButtonClick}
          >
            Create Your AI Companion
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-4 border-white text-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Always Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Genuine Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Completely Yours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomCtaSection;
