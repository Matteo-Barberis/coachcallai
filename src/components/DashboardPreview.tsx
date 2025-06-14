
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/useTheme';

const DashboardPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const theme = useTheme();
  
  const handleSignupNavigation = () => {
    navigate('/auth/sign-up');
  };
  
  const getContent = () => {
    if (location.pathname === '/accountability') {
      return {
        description: "Every conversation with your coach becomes part of your progress story. Watch as daily achievements transform into lasting change."
      };
    } else {
      return {
        description: "Every conversation with your companion becomes part of your progress story. Watch as daily achievements transform into lasting change."
      };
    }
  };

  const content = getContent();
  const videoUrl = isMobile ? "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//progress_mobile.mp4" : "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//progress.mp4";
  
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Track Your Journey</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.description}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="ml-4 text-sm font-medium text-gray-600">Coach Call AI Dashboard</div>
            </div>
          </div>
          <div className="p-4">
            <video src={videoUrl} className="w-full rounded shadow-sm" autoPlay loop muted playsInline />
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our intelligent system automatically captures achievements from your conversations and phone calls, building a visual record of your progress over time.
          </p>
          <Button className={`text-base py-6 px-8 ${theme.gradient} hover:from-indigo-700 hover:to-purple-700`} onClick={handleSignupNavigation}>
            Experience Your Progress Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
