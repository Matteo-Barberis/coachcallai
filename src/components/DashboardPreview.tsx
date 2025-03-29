
import React from 'react';
import { Card } from "@/components/ui/card";

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
        <div className="bg-gray-800 py-3 px-4 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto text-white text-sm font-medium">Your Progress Dashboard</div>
        </div>
        <div className="bg-white aspect-video relative">
          <img 
            src="/placeholder.svg" 
            alt="Dashboard Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Track Your Achievements</h3>
              <p className="text-white/90 max-w-lg">See all your milestones, completed goals, and progress analytics in one place.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-brand-primary/10 rounded-full blur-2xl -z-10"></div>
      <div className="absolute -top-4 -left-4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
    </div>
  );
};

export default DashboardPreview;
