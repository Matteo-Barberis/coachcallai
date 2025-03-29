
import React from 'react';
import { Check, Phone, MessageCircle, Trophy, PhoneIncoming, Award, Medal } from "lucide-react";
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
          {/* Achievement board header */}
          <div className="bg-gradient-to-r from-brand-primary to-purple-600 px-4 py-3">
            <h4 className="font-medium text-white text-center">Achievement Board</h4>
          </div>
          
          {/* Achievement timeline */}
          <div className="bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-700">Your Progress</h5>
              <span className="text-xs bg-brand-primary/10 text-brand-primary rounded-full px-3 py-1">This Week</span>
            </div>
            
            {/* Achievement items */}
            <div className="space-y-4">
              {/* Achievement 1 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-green-500">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Trophy className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Workout Streak</p>
                    <p className="text-xs text-gray-500 mt-1">Completed 5 workouts in a row</p>
                    <p className="text-[10px] text-gray-400 mt-2">Today, 2:30 PM</p>
                  </div>
                </div>
              </div>
              
              {/* Achievement 2 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Medal className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Nutrition Goal</p>
                    <p className="text-xs text-gray-500 mt-1">Hit protein target for 7 days</p>
                    <p className="text-[10px] text-gray-400 mt-2">Yesterday, 9:15 AM</p>
                  </div>
                </div>
              </div>
              
              {/* Achievement 3 */}
              <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-amber-500">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <Award className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Personal Record</p>
                    <p className="text-xs text-gray-500 mt-1">Added 10kg to your squat max</p>
                    <p className="text-[10px] text-gray-400 mt-2">Monday, 6:45 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* View more button */}
            <button className="w-full mt-3 text-xs text-center py-2 text-brand-primary font-medium hover:bg-brand-primary/5 rounded-lg transition-colors">
              View All Achievements
            </button>
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
                  {feature.customImage ? (
                    feature.customImage
                  ) : feature.image ? (
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="rounded-lg shadow-lg max-h-80 object-cover"
                    />
                  ) : null}
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
                    {feature.customImage ? (
                      feature.customImage
                    ) : feature.image ? (
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="rounded-lg shadow-lg max-h-80 object-cover"
                      />
                    ) : null}
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
