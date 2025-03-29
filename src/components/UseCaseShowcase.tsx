
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Calendar, Dumbbell, GraduationCap, User } from "lucide-react";

const UseCaseShowcase = () => {
  const useCases = [
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Morning Motivation",
      description: "Start your day with a wake-up call and morning check-in to set intentions and energy for the day ahead.",
      persona: "Early Risers & Productivity Seekers"
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-red-500" />,
      title: "Fitness Accountability",
      description: "Schedule calls before workouts and get WhatsApp check-ins to track your exercise consistency and progress.",
      persona: "Fitness Enthusiasts"
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-blue-500" />,
      title: "Study Consistency",
      description: "Set regular study sessions with accountability calls and progress tracking for academic goals.",
      persona: "Students & Lifelong Learners"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Project Deadlines",
      description: "Stay on track with project milestones through scheduled check-ins and reminder calls before key deadlines.",
      persona: "Professionals & Freelancers"
    },
    {
      icon: <User className="h-8 w-8 text-green-500" />,
      title: "Habit Building",
      description: "Create lasting habits with consistent daily WhatsApp reinforcement and celebration of streaks.",
      persona: "Self-Improvers"
    },
    {
      icon: <Moon className="h-8 w-8 text-indigo-500" />,
      title: "Evening Reflection",
      description: "End your day with an evening call to reflect on accomplishments and prepare for tomorrow.",
      persona: "Mindfulness Practitioners"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How People Use Coach Call AI</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how our AI coach adapts to different goals and lifestyles for maximum accountability.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="mb-3">{useCase.icon}</div>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <div className="text-sm font-medium bg-gray-100 text-gray-700 py-1 px-3 rounded-full inline-block">
                  {useCase.persona}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseShowcase;
