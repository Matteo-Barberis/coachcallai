
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sun, Star, Flower2, Sparkles, Smile } from 'lucide-react';

const MindfulnessFeaturesShowcase = () => {
  const features = [
    {
      icon: Heart,
      title: "Self-Love Guidance",
      description: "Receive gentle reminders and practices to cultivate self-compassion and embrace your authentic self with kindness."
    },
    {
      icon: Sun,
      title: "Daily Gratitude Rituals",
      description: "Start and end your days with personalized gratitude practices that help you appreciate life's beautiful moments."
    },
    {
      icon: Star,
      title: "Mindful Moments",
      description: "Get gentle prompts throughout your day to pause, breathe, and reconnect with the present moment."
    },
    {
      icon: Flower2,
      title: "Positive Affirmations",
      description: "Receive uplifting messages and affirmations tailored to boost your confidence and inner strength."
    },
    {
      icon: Sparkles,
      title: "Emotional Check-ins",
      description: "Regular, caring conversations about your emotional well-being to help you process and understand your feelings."
    },
    {
      icon: Smile,
      title: "Celebration of Progress",
      description: "Your AI companion celebrates your journey, acknowledging every small step toward greater peace and happiness."
    }
  ];

  return (
    <section id="features-showcase" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Nurture Your Inner Light
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience features designed to cultivate positivity, gratitude, and mindfulness in your daily life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MindfulnessFeaturesShowcase;
