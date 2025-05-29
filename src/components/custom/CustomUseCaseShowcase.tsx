
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Moon, Sun, Coffee, Users, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTheme } from "@/hooks/useTheme";

const CustomUseCaseShowcase = () => {
  const isMobile = useIsMobile();
  const theme = useTheme();
  
  const useCases = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Best Friend Mode",
      description: "Create an AI companion that's like your closest friend — supportive, understanding, and always ready to listen without judgment.",
      persona: "Lonely Professionals & Introverts"
    },
    {
      icon: <Coffee className="h-8 w-8 text-brown-500" />,
      title: "Daily Check-in Buddy",
      description: "Your AI companion checks in throughout the day, asking how you're doing and providing emotional support when you need it most.",
      persona: "People Seeking Daily Support"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Creative Collaborator",
      description: "Brainstorm ideas, work through creative blocks, and get inspired with an AI companion that understands your creative process.",
      persona: "Artists & Creative Professionals"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Social Skills Coach",
      description: "Practice conversations, get advice on social situations, and build confidence with an AI companion that helps you connect better.",
      persona: "Socially Anxious Individuals"
    },
    {
      icon: <Sun className="h-8 w-8 text-orange-500" />,
      title: "Motivation Partner",
      description: "Get the encouragement and motivation you need to tackle your day, pursue goals, and overcome challenges with personalized support.",
      persona: "Goal-Oriented Individuals"
    },
    {
      icon: <Moon className="h-8 w-8 text-indigo-500" />,
      title: "Emotional Support",
      description: "Process difficult emotions, work through stress, and find comfort with an AI companion trained to provide empathetic emotional support.",
      persona: "People Managing Stress & Anxiety"
    }
  ];

  // Render a card (used for both mobile and desktop)
  const renderCard = (useCase, index) => (
    <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full">
      <CardHeader className="pb-2">
        <div className="mb-3">{useCase.icon}</div>
        <CardTitle className="text-xl">{useCase.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{useCase.description}</p>
        <div className={`text-sm font-medium ${theme.light} ${theme.lightText} py-1 px-3 rounded-full inline-block`}>
          {useCase.persona}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className={`py-20 px-4 ${theme.bg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Create Your Perfect AI Companion</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Design an AI companion that fits your personality, communication style, and support needs perfectly.
          </p>
        </div>
        
        {isMobile ? (
          // Mobile Layout: Carousel
          <div className="w-full">
            <Carousel className="w-full">
              <CarouselContent className="-ml-0">
                {useCases.map((useCase, index) => (
                  <CarouselItem key={index} className="pl-4 pr-4 w-full">
                    {renderCard(useCase, index)}
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="relative static transform-none mx-2" />
                <CarouselNext className="relative static transform-none mx-2" />
              </div>
            </Carousel>
          </div>
        ) : (
          // Desktop Layout: Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => renderCard(useCase, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomUseCaseShowcase;
