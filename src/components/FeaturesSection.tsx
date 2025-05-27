
import React from 'react';
import { Check, MessageCircle, PhoneCall, TrendingUp, Target, Bot, User, Activity } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const FeaturesSection = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <MessageCircle className={`w-10 h-10 ${theme.primary}`} />,
      title: "WhatsApp Integration",
      description: "Connect with your AI coach directly through WhatsApp for seamless communication and regular check-ins."
    },
    {
      icon: <PhoneCall className={`w-10 h-10 ${theme.primary}`} />,
      title: "Accountability Calls",
      description: "Receive personalized phone calls that keep you accountable to your goals and commitments."
    },
    {
      icon: <TrendingUp className={`w-10 h-10 ${theme.primary}`} />,
      title: "Progress Tracking",
      description: "Visualize your progress with detailed analytics and insights to stay motivated."
    },
    {
      icon: <Bot className={`w-10 h-10 ${theme.primary}`} />,
      title: "AI Powered Coach",
      description: "Our advanced AI understands your goals and adapts to your unique needs and schedule."
    },
    {
      icon: <Target className={`w-10 h-10 ${theme.primary}`} />,
      title: "Goal Setting",
      description: "Set clear, achievable goals with guidance from your AI coach to ensure success."
    },
    {
      icon: <Activity className={`w-10 h-10 ${theme.primary}`} />,
      title: "Habit Formation",
      description: "Build lasting habits with consistent follow-ups and personalized reinforcement."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Powerful Features to Keep You on Track</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Coach Call AI combines the best of AI technology with practical accountability tools to help you achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Coach Call AI?</h3>
              <p className="text-gray-600 mb-6">
                Unlike traditional coaching apps that rely solely on notifications, Coach Call AI creates a true accountability partnership through:
              </p>
              <ul className="space-y-3">
                {[
                  "Real human-like conversations through WhatsApp",
                  "Actual phone calls for maximum accountability",
                  "AI coach that learns your patterns and habits",
                  "Personalized approach to your specific goals",
                  "No judgement, just consistent support"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1 bg-green-100 rounded-full p-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <User className={`w-6 h-6 ${theme.primary} mr-2`} />
                  <h4 className="font-medium text-lg">Personalized To Your Needs</h4>
                </div>
                <p className="text-gray-600 mb-6">
                  Coach Call AI adapts to your communication style, schedule, and goals to provide personalized coaching that feels natural.
                </p>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className={`h-full w-4/5 ${theme.progressBg} rounded-full`}></div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full w-2/3 bg-brand-secondary rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full w-3/4 bg-brand-accent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
