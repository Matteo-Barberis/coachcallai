
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      number: "01",
      title: "Set Your Goals",
      description: "Define what you want to achieve, how often you want check-ins, and when you prefer phone calls."
    },
    {
      number: "02",
      title: "Connect Your WhatsApp",
      description: "Link your WhatsApp account to Coach Call AI with a simple QR code scan. No additional apps needed."
    },
    {
      number: "03",
      title: "Regular Check-ins",
      description: "Your AI coach will message you through WhatsApp to check on your progress and provide encouragement."
    },
    {
      number: "04",
      title: "Accountability Calls",
      description: "Receive phone calls at critical moments to ensure you stay on track with your commitments."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">How Coach Call AI Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, powerful process designed to keep you accountable and help you achieve your goals.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connection Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          
          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-4">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-brand-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to stay accountable?</h3>
              <p className="text-white/80">Start your journey to consistent achievement today.</p>
            </div>
            <button 
              onClick={() => navigate('/auth/sign-up')}
              className="px-8 py-3 bg-white text-brand-primary rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
