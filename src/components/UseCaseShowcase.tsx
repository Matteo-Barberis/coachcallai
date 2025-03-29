
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlarmClock, Trophy, MessageCircle, Phone } from "lucide-react";

const useCases = [
  {
    title: "Morning Motivation",
    description: "Your coach calls or texts you in the morning to kick-start your day with energy and purpose.",
    icon: AlarmClock,
  },
  {
    title: "Achievement Celebration",
    description: "Celebrate wins with your coach who tracks and acknowledges your achievements.",
    icon: Trophy,
  },
  {
    title: "On-Demand Support",
    description: "Message your coach anytime you need guidance, advice, or just someone to talk to.",
    icon: MessageCircle,
  },
  {
    title: "Scheduled Check-ins",
    description: "Regular calls to keep you accountable and provide structured feedback on your progress.",
    icon: Phone,
  },
];

const UseCaseShowcase = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon;
          return (
            <Card key={index} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="mb-4 bg-brand-light/30 w-12 h-12 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UseCaseShowcase;
