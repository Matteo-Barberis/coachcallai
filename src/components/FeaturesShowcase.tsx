
import React from 'react';
import { Check, Phone, MessageCircle, Trophy } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const FeaturesShowcase = () => {
  const isMobile = useIsMobile();
  const features = [
    {
      icon: <Phone className="h-10 w-10 text-brand-primary" />,
      title: "Scheduled Phone Calls",
      description: "Real phone calls to your device when you need motivation the most",
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/dashboard-calls.png",
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
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/whatsapp-preview.png",
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
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/achievements-board.png",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Key Features That Drive Results</h2>
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
                  {feature.image && (
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="rounded-lg shadow-lg max-h-80 object-cover"
                    />
                  )}
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
                    {feature.image && (
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="rounded-lg shadow-lg max-h-80 object-cover"
                      />
                    )}
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
