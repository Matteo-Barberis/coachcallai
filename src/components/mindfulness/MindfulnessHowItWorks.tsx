
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

const MindfulnessHowItWorks = () => {
  const theme = useTheme();

  const steps = [
    {
      title: "Create Your Peaceful Companion",
      description: "Design an AI companion with a gentle, nurturing personality that resonates with your journey toward inner peace and self-love."
    },
    {
      title: "Connect Through WhatsApp",
      description: "Your mindful companion lives in WhatsApp, making it easy to access daily guidance, affirmations, and check-ins wherever you are."
    },
    {
      title: "Daily Mindful Moments",
      description: "Receive gentle prompts for gratitude, breathing exercises, positive affirmations, and mindful reflections throughout your day."
    },
    {
      title: "Nurturing Voice Conversations",
      description: "When you need deeper connection, enjoy soothing voice calls for guided meditations, emotional check-ins, or simply a caring conversation."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>
            Your Journey to Inner Peace
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Begin your mindfulness journey with gentle guidance and daily practices designed to nurture your well-being.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connection Line */}
          <div className={`hidden md:block absolute top-24 left-0 right-0 h-1 ${theme.gradient} opacity-20 z-0`}></div>
          
          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                <div className={`bg-white rounded-2xl shadow-md p-8 border ${theme.border} border-opacity-20 h-full flex flex-col hover:shadow-lg transition-shadow`}>
                  <div className={`w-12 h-12 rounded-full ${theme.gradient} flex items-center justify-center mb-4 text-white font-bold text-lg`}>
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-4">
                      <div className={`w-8 h-8 rounded-full ${theme.bg} flex items-center justify-center`}>
                        <ArrowRight className={`w-4 h-4 ${theme.primary}`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MindfulnessHowItWorks;
