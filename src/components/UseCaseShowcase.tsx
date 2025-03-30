
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Calendar, Dumbbell, GraduationCap, User, Clock, Smartphone, Droplet } from "lucide-react";

const UseCaseShowcase = () => {
  const useCases = [
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Morning Motivation",
      description: "Start your day with a wake-up call and morning check-in to set intentions and energy for the day ahead.",
      persona: "Early Risers & Productivity Seekers"
    },
    {
      icon: <Sun className="h-8 w-8 text-orange-500" />,
      title: "Wake-Up Call",
      description: "Replace boring alarms with a motivational coach call that energizes you and helps you start your day with purpose.",
      persona: "Heavy Sleepers & Busy Professionals"
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-red-500" />,
      title: "Fitness Accountability",
      description: "Schedule calls before workouts and get WhatsApp check-ins to track your exercise consistency and progress.",
      persona: "Fitness Enthusiasts"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Project Deadlines",
      description: "Stay on track with project milestones through scheduled check-ins and reminder calls before key deadlines.",
      persona: "Professionals & Freelancers"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Meditation Time",
      description: "Receive a gentle reminder call when it's time for your daily meditation practice, helping you maintain consistency.",
      persona: "Mindfulness Practitioners"
    },
    {
      icon: <Moon className="h-8 w-8 text-indigo-500" />,
      title: "Evening Reflection",
      description: "End your day with an evening call to reflect on accomplishments and prepare for tomorrow.",
      persona: "Self-Improvement Enthusiasts"
    },
    {
      icon: <Droplet className="h-8 w-8 text-cyan-500" />,
      title: "Water Break",
      description: "Get regular reminders throughout the day to stay hydrated with personalized water intake goals.",
      persona: "Health-Conscious Individuals"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-gray-500" />,
      title: "Screen Time Limit",
      description: "Receive calls when you've been on your devices too long to encourage breaks and digital wellness.",
      persona: "Digital Minimalists"
    },
    {
      icon: <User className="h-8 w-8 text-green-500" />,
      title: "Habit Building",
      description: "Create lasting habits with consistent daily WhatsApp reinforcement and celebration of streaks.",
      persona: "Self-Improvers"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
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
                <div className="text-sm font-medium bg-white text-gray-700 py-1 px-3 rounded-full inline-block">
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
