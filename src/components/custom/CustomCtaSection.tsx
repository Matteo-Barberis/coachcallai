
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from '@/context/SessionContext';

const CustomCtaSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const handleButtonClick = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/auth/sign-up');
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <div className="animated-gradient-bg p-10 md:p-16 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Never Feel Alone Again</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands who've created their perfect AI companion and found the connection they've been looking for.
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleButtonClick}
                className="bg-white text-brand-primary hover:bg-white/90 font-semibold py-6 px-8"
              >
                Create Your AI Companion
              </Button>
            </div>
          </div>

          <div className="bg-white p-10 md:p-16 grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-light flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-primary">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Always Available</h3>
              <p className="text-gray-600">Your AI companion is ready to chat or call 24/7, whenever you need support or connection.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-light flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-primary">
                  <path d="M20.84 4.60999C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.60999L12 5.66999L10.94 4.60999C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.60999C2.1283 5.64169 1.54871 7.04096 1.54871 8.49999C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.49999C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.60999V4.60999Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Genuine Connection</h3>
              <p className="text-gray-600">Experience meaningful conversations with an AI that truly understands and adapts to your personality.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-light flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-primary">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Completely Yours</h3>
              <p className="text-gray-600">Design your AI companion's personality, communication style, and approach to fit exactly what you need.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomCtaSection;
