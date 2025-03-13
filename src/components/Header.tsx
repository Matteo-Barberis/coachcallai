
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const { toast } = useToast();

  const handleEarlyAccess = () => {
    toast({
      title: "Early Access Requested",
      description: "Thanks for your interest! We'll be in touch soon.",
    });
  };

  return (
    <header className="py-4 px-4 md:px-6 w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-lg md:text-xl text-gray-900">Coach Call AI</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-brand-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-brand-primary transition-colors">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-brand-primary transition-colors">Testimonials</a>
          <a href="#pricing" className="text-gray-600 hover:text-brand-primary transition-colors">Pricing</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="hidden md:inline-flex"
            onClick={() => window.location.href = "#contact"}
          >
            Contact
          </Button>
          <Button 
            className="bg-brand-primary hover:bg-brand-primary/90"
            onClick={handleEarlyAccess}
          >
            Get Early Access
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
