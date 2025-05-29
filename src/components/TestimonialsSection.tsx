
import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";

const TestimonialsSection = () => {
  const theme = useTheme();
  
  const testimonials = [
    {
      name: "Olivia Nichols",
      role: "Fitness Enthusiast",
      content: "Coach Call AI has been a game-changer for my fitness routine. The WhatsApp check-ins are friendly but firm, and the phone calls always come right when I'm about to skip a workout!",
      rating: 5,
      achievement: "Lost 15lbs in 3 months"
    },
    {
      name: "Jessica Williams",
      role: "Grad Student",
      content: "I was skeptical at first, but the phone calls from Coach Call AI actually feel like talking to a real coach. It's helped me stay on track with my thesis when I would have otherwise fallen behind.",
      rating: 4,
      achievement: "Completed thesis 2 weeks early"
    },
    {
      name: "Matteo Barberis",
      role: "Entrepreneur",
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

        <div className="grid md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex flex-col"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.content}"</p>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className={`w-10 h-10 rounded-full ${theme.gradient} flex items-center justify-center text-white font-bold`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className={`${theme.light} ${theme.lightText} text-sm px-3 py-1 rounded-full inline-block`}>
                    Achievement: {testimonial.achievement}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg font-medium mb-6">Join hundreds of users improving their accountability every day</p>
          <div className="flex flex-wrap justify-center gap-8">
            {["90% of users report improved goal completion", "Average 4.8/5 satisfaction rating", "78% increase in daily habit consistency"].map((stat, i) => (
              <div key={i} className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
