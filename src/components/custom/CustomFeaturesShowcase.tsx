
import React from 'react';
import { PhoneCall, MessageCircle, Heart, Brain, Shield, Zap } from 'lucide-react';

const CustomFeaturesShowcase = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Always Within Reach",
      description: "Your AI companion lives in WhatsApp — no new apps to download or remember. Just text like you would a best friend.",
      highlight: "Zero app dependence"
    },
    {
      icon: <PhoneCall className="w-8 h-8" />,
      title: "Instant Connection",
      description: "Call your AI companion anytime, or let it call you when it senses you need support. Real conversations, real connection.",
      highlight: "Voice & text ready"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Your Style, Your Way",
      description: "Gentle encouragement, tough love, empathetic listening, or playful banter — customize your companion's personality completely.",
      highlight: "100% customizable"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Grows With You",
      description: "Every conversation makes your AI companion smarter about you. It learns your patterns, preferences, and what support you need most.",
      highlight: "Learns from every chat"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Private & Secure",
      description: "Your conversations stay between you and your AI companion. No data selling, no privacy concerns — just genuine support.",
      highlight: "Your data stays yours"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Setup",
      description: "Create your perfect AI companion in minutes. Scan a QR code, customize the personality, and start chatting immediately.",
      highlight: "Ready in minutes"
    }
  ];

  return (
    <section id="features-showcase" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            The AI Companion That's Just a Text or Call Away
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Unlike generic chatbots trapped in apps, your AI companion integrates seamlessly into your daily life through the platforms you already use.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 feature-card"
            >
              <div className="text-brand-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="inline-block bg-brand-light text-brand-primary text-sm px-3 py-1 rounded-full">
                {feature.highlight}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">The Problem with Modern Chatbots</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most AI assistants live trapped in apps you forget to open, with zero customization and no real understanding of who you are.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <div className="text-red-500 font-bold text-2xl">×</div>
              </div>
              <h4 className="font-semibold mb-2 text-red-600">App Dependence</h4>
              <p className="text-gray-600">Stuck in apps you forget to check, creating friction in getting support when you need it most.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <div className="text-red-500 font-bold text-2xl">×</div>
              </div>
              <h4 className="font-semibold mb-2 text-red-600">Zero Customization</h4>
              <p className="text-gray-600">One-size-fits-all personalities that don't understand your unique communication style or needs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <div className="text-red-500 font-bold text-2xl">×</div>
              </div>
              <h4 className="font-semibold mb-2 text-red-600">No Real Connection</h4>
              <p className="text-gray-600">Generic responses that don't learn from your conversations or adapt to your changing needs.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomFeaturesShowcase;
