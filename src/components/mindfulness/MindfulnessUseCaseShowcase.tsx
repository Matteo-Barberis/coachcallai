
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sunrise, Heart, Star, Flower2 } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

const MindfulnessUseCaseShowcase = () => {
  const theme = useTheme();

  const useCases = [
    {
      icon: Sunrise,
      title: "Morning Gratitude Rituals",
      description: "Sarah starts each day with her AI companion's gentle gratitude practice, setting a positive tone that transforms her entire outlook on life.",
      quote: "My mornings went from rushed and stressful to peaceful and intentional. I feel grateful for even the smallest things now."
    },
    {
      icon: Heart,
      title: "Self-Love Journey",
      description: "Marcus uses daily affirmations and self-compassion exercises to build a healthier relationship with himself after years of self-criticism.",
      quote: "I'm learning to be my own best friend instead of my worst critic. The daily reminders help me treat myself with kindness."
    },
    {
      icon: Star,
      title: "Mindful Moments",
      description: "Elena receives gentle prompts throughout her busy workday to pause, breathe, and reconnect with the present moment.",
      quote: "Those little mindful check-ins help me stay centered even during the most chaotic days. I feel more at peace."
    },
    {
      icon: Flower2,
      title: "Emotional Well-being",
      description: "David processes difficult emotions with his companion's support, learning healthy ways to honor his feelings without judgment.",
      quote: "Having someone to talk to who never judges and always understands has been life-changing for my emotional health."
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>
            Real Stories of Transformation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how people are cultivating inner peace, gratitude, and self-love with their AI companions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className={`border ${theme.border} border-opacity-20 bg-white hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-8">
                <div className="flex items-start mb-6">
                  <div className={`w-12 h-12 rounded-full ${theme.gradient} flex items-center justify-center mr-4 flex-shrink-0`}>
                    <useCase.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{useCase.title}</h3>
                    <p className="text-gray-600 mb-4">{useCase.description}</p>
                    <blockquote className={`${theme.primary} italic border-l-4 ${theme.border} pl-4`}>
                      "{useCase.quote}"
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MindfulnessUseCaseShowcase;
