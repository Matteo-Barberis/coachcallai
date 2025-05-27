
import React from 'react';
import { Star } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from '@/hooks/useTheme';

const EnhancedTestimonials = () => {
  const theme = useTheme();

  const testimonials = [
    {
      name: "Olivia Nichols",
      role: "Fitness Enthusiast",
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/woman-1.jpg",
      content: "Coach Call AI has been a game-changer for my fitness routine. The WhatsApp check-ins are friendly but firm, and the phone calls always come right when I'm about to skip a workout!",
      rating: 5,
      achievement: "Lost 15lbs in 3 months"
    },
    {
      name: "Jed Merrington",
      role: "Software Developer",
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/man-2.jpg",
      content: "The consistency of the WhatsApp check-ins has helped me maintain my coding practice every day. I've built more projects in the last month than in the previous six months.",
      rating: 5,
      achievement: "Completed 30-day coding challenge"
    },
    {
      name: "Matteo Barberis",
      role: "Entrepreneur",
      image: "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images/man-1.jpg",
      content: "As someone who struggles with procrastination, having an AI coach call me to check on my business goals has been revolutionary. It's like having an accountability partner without the awkwardness.",
      rating: 5,
      achievement: "Launched 2 products ahead of schedule"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real people who have transformed their accountability with Coach Call AI.
          </p>
        </div>

        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent className="-ml-0">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 pr-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col h-full">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.content}"</p>
                    
                    <div>
                      <div className="flex items-center mb-3">
                        <Avatar className="h-10 w-10 mr-3">
                          {testimonial.image ? (
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          ) : (
                            <AvatarFallback className={theme.gradient + " text-white"}>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <div className={`${theme.light} ${theme.lightText} text-sm px-3 py-1 rounded-full inline-block`}>
                          Achievement: {testimonial.achievement}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative static transform-none mx-2" />
              <CarouselNext className="relative static transform-none mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;
