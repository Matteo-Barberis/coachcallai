
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

const CustomHowItWorks = () => {
  const theme = useTheme();

  const steps = [
    {
      title: "Design Your Companion",
      description: "Choose your AI companion's personality, communication style, and voice. Make them supportive like a best friend, wise like a mentor, or empathetic like a calm voice in a storm."
    },
    {
      title: "Connect via WhatsApp",
      description: "Your AI companion lives in WhatsApp - no new apps to download. Simply scan a QR code to connect and start chatting immediately."
    },
    {
      title: "Chat Anytime",
      description: "Text your AI companion throughout the day for support, conversation, or just to share what's on your mind. They're always available to listen."
    },
    {
      title: "Voice Calls When Needed",
      description: "When you need deeper connection, your AI companion can call you or you can call them for real voice conversations that feel genuinely supportive."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>How Your AI Companion Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your perfect AI companion in minutes and start experiencing genuine connection and support.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-4">
                      <div className={`w-8 h-8 rounded-full ${theme.light} flex items-center justify-center`}>
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

export default CustomHowItWorks;
