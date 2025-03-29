
import React from 'react';
import { Check, Phone, MessageCircle, Trophy, PhoneIncoming, Star, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const FeaturesShowcase = () => {
  const isMobile = useIsMobile();
  const features = [
    {
      icon: <Phone className="h-10 w-10 text-brand-primary" />,
      title: "Scheduled Phone Calls",
      description: "Real phone calls to your device when you need motivation the most",
      customImage: (
        <div className="w-full max-w-xs mx-auto bg-brand-dark rounded-2xl shadow-xl p-4">
          <div className="flex flex-col items-center mb-6 mt-4 text-white">
            <h4 className="font-medium text-2xl mb-1">Coach AI</h4>
            <p className="text-gray-400">Incoming Call</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 mb-4">
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-red-500 flex items-center justify-center mb-2">
                <PhoneIncoming className="h-7 w-7 text-white rotate-90" />
              </div>
              <p className="text-white text-sm">Decline</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <p className="text-white text-sm">Answer</p>
            </div>
          </div>
        </div>
      ),
      points: [
        "Schedule calls at your preferred times",
        "Get motivated exactly when you need it",
        "Customize call frequency to match your goals"
      ]
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-brand-primary" />,
      title: "WhatsApp Integration",
      description: "Daily check-ins and conversations with your AI coach via WhatsApp",
      customImage: (
        <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* WhatsApp header */}
          <div className="bg-brand-primary px-4 py-3 flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white">Coach AI</h4>
              <p className="text-xs text-white/70">online</p>
            </div>
          </div>
          
          {/* Chat area */}
          <div className="bg-gray-50 p-3 space-y-3">
            {/* Time header */}
            <div className="flex justify-center">
              <span className="text-xs bg-white rounded-full px-3 py-1 text-gray-500 shadow-sm">Today, 8:24 AM</span>
            </div>
            
            {/* AI message */}
            <div className="flex">
              <div className="bg-white rounded-lg p-3 max-w-[75%] shadow-sm">
                <p className="text-sm">Good morning! How are you feeling about your workout goal today?</p>
                <p className="text-[10px] text-gray-400 text-right mt-1">8:24 AM</p>
              </div>
            </div>
            
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-brand-light rounded-lg p-3 max-w-[75%] shadow-sm">
                <p className="text-sm">A bit tired but I'm still planning to go to the gym this afternoon!</p>
                <p className="text-[10px] text-gray-400 text-right mt-1">8:30 AM</p>
              </div>
            </div>
            
            {/* AI message */}
            <div className="flex">
              <div className="bg-white rounded-lg p-3 max-w-[75%] shadow-sm">
                <p className="text-sm">That's the spirit! I'll check in with you at 3PM to make sure you're on track. Remember why you started!</p>
                <p className="text-[10px] text-gray-400 text-right mt-1">8:31 AM</p>
              </div>
            </div>
          </div>
          
          {/* Input area */}
          <div className="px-3 py-2 bg-white border-t border-gray-200 flex items-center">
            <div className="bg-gray-100 rounded-full flex-1 py-2 px-4 text-sm text-gray-500">
              Type a message
            </div>
          </div>
        </div>
      ),
      points: [
        "3 daily check-ins to keep you accountable",
        "Text your coach anytime for guidance",
        "Natural conversation that feels like texting a friend"
      ]
    },
    {
      icon: <Trophy className="h-10 w-10 text-brand-primary" />,
      title: "Achievement Tracking",
      description: "Every accomplishment automatically recorded to visualize your progress",
      customImage: (
        <div className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> 
              Your Progress Journey
            </h3>
            <p className="text-xs text-gray-500">Track your achievements and milestones</p>
          </div>
          
          {/* Achievements Timeline */}
          <div className="p-4 max-h-60 overflow-y-auto">
            <div className="relative ml-3">
              {/* Vertical line */}
              <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-5">
                {/* Breakthrough */}
                <div className="relative pl-8 hover:translate-x-1 transition-all">
                  {/* Timeline dot */}
                  <div className="absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-purple-400 bg-purple-50">
                    <Star className="h-3.5 w-3.5 text-purple-500" />
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Aug 19, 2023</p>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-200">
                        Breakthrough
                      </span>
                    </div>
                    <h4 className="text-base font-medium">Connected childhood pattern to current anxiety</h4>
                    <p className="text-sm text-gray-600">Identified how past experiences shape current responses</p>
                  </div>
                </div>
                
                {/* Milestone */}
                <div className="relative pl-8 hover:translate-x-1 transition-all">
                  {/* Timeline dot */}
                  <div className="absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-orange-400 bg-orange-50">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Aug 12, 2023</p>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200">
                        Milestone
                      </span>
                    </div>
                    <h4 className="text-base font-medium">Completed first phase of anxiety management</h4>
                    <p className="text-sm text-gray-600">Successfully finished all modules in phase one</p>
                  </div>
                </div>
                
                {/* Achievement */}
                <div className="relative pl-8 hover:translate-x-1 transition-all">
                  {/* Timeline dot */}
                  <div className="absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border border-green-400 bg-green-50">
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  </div>
                  <div className="group">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500">Aug 5, 2023</p>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200">
                        Achievement
                      </span>
                    </div>
                    <h4 className="text-base font-medium">Started daily mindfulness practice</h4>
                    <p className="text-sm text-gray-600">Committed to 5 minutes of mindfulness each morning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      points: [
        "Automatic milestone recording from conversations",
        "Visual progress timeline to celebrate wins",
        "Track improvements over time for motivation"
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Stop Failing Your Goals. Start Taking Real Action.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI coach integrates seamlessly into your life with powerful tools designed for real accountability.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col gap-8">
              {/* Mobile Layout: Image on top */}
              {isMobile && (
                <div className="w-full bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  {feature.customImage}
                </div>
              )}
              
              {/* Content area (always present) */}
              <div className={`flex flex-col ${!isMobile && (index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')} gap-8 items-center`}>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Desktop Layout: Image to the side */}
                {!isMobile && (
                  <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                    {feature.customImage}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
