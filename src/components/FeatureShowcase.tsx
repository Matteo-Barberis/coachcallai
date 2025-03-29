
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  imageSrc: string;
}

const features: Feature[] = [
  {
    title: "WhatsApp Check-ins",
    description: "Your coach checks in with you three times daily via WhatsApp to keep you accountable and motivated.",
    imageSrc: "/placeholder.svg"
  },
  {
    title: "Personal Phone Calls",
    description: "Schedule calls at times that work for you and receive coaching directly on your phone.",
    imageSrc: "/placeholder.svg"
  },
  {
    title: "Achievement Tracking",
    description: "Everything you share with your coach is recorded in your progress page, helping you track milestones.",
    imageSrc: "/placeholder.svg"
  },
  {
    title: "Custom Guidance",
    description: "Personalized advice and feedback based on your goals and progress to ensure continued improvement.",
    imageSrc: "/placeholder.svg"
  }
];

const FeatureShowcase = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <img 
                      src={feature.imageSrc} 
                      alt={feature.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 lg:-left-12" />
        <CarouselNext className="right-0 lg:-right-12" />
      </Carousel>
    </div>
  );
};

export default FeatureShowcase;
