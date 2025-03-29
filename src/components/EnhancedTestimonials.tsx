
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Entrepreneur",
    content: "My coach completely transformed my morning routine. I'm now 3x more productive before noon than I used to be all day!",
    rating: 5,
    imageSrc: "/placeholder.svg",
    achievement: "Established a consistent 5AM routine within 2 weeks"
  },
  {
    name: "Michael T.",
    role: "Marketing Director",
    content: "Having a coach check in with me throughout the day has kept me focused on what matters. My stress levels are down and productivity is way up.",
    rating: 5,
    imageSrc: "/placeholder.svg",
    achievement: "Reduced work stress by 60% in one month"
  },
  {
    name: "Priya K.",
    role: "Fitness Enthusiast",
    content: "The accountability from my coach's calls is what finally helped me stick to my fitness goals. I've never been this consistent!",
    rating: 5,
    imageSrc: "/placeholder.svg",
    achievement: "Maintained daily workout streak for 45 days"
  },
  {
    name: "David W.",
    role: "Software Developer",
    content: "Being able to message my coach whenever I hit a roadblock has been game-changing. They help me refocus and get back on track quickly.",
    rating: 5,
    imageSrc: "/placeholder.svg",
    achievement: "Completed a major project 2 weeks ahead of deadline"
  },
];

const EnhancedTestimonials = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full border border-gray-200 shadow-sm">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={testimonial.imageSrc} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 flex-grow mb-4">"{testimonial.content}"</p>
                  
                  <div className="mt-auto">
                    <div className="text-xs font-medium uppercase text-brand-primary mb-1">Achievement</div>
                    <div className="text-sm font-medium text-gray-900">{testimonial.achievement}</div>
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

export default EnhancedTestimonials;
