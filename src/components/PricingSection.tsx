
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    toast({
      title: `${plan} Plan Selected`,
      description: "Thanks for your interest! Early access sign-up confirmed.",
    });
    navigate('/auth/sign-up');
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals starting their accountability journey",
      price: isAnnual ? 19 : 29,
      features: [
        "Weekly WhatsApp check-ins",
        "2 phone calls per week",
        "Basic progress tracking",
        "Single goal setting",
        "Email support"
      ],
      popular: false,
      colorClass: "border-gray-200 hover:border-brand-primary"
    },
    {
      name: "Pro",
      description: "For those committed to consistent accountability",
      price: isAnnual ? 39 : 49,
      features: [
        "Daily WhatsApp check-ins",
        "5 phone calls per week",
        "Advanced progress tracking",
        "Multiple goal setting",
        "Priority support",
        "Custom call scheduling",
        "Habit streak tracking"
      ],
      popular: true,
      colorClass: "border-brand-primary"
    },
    {
      name: "Teams",
      description: "Accountability solutions for groups and teams",
      price: isAnnual ? 99 : 129,
      features: [
        "Everything in Pro plan",
        "5 team member accounts",
        "Team progress dashboard",
        "Group accountability calls",
        "Admin controls",
        "API access",
        "Dedicated account manager"
      ],
      popular: false,
      colorClass: "border-gray-200 hover:border-brand-primary"
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your accountability needs. All plans include a 14-day free trial.
          </p>
          
          <div className="flex items-center justify-center mt-8 bg-gray-100 p-1 rounded-full w-72 mx-auto">
            <button
              onClick={() => setIsAnnual(true)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                isAnnual 
                  ? 'bg-white shadow-sm text-brand-primary' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Annual (Save 20%)
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`py-2 px-6 rounded-full text-sm font-medium transition-colors ${
                !isAnnual 
                  ? 'bg-white shadow-sm text-brand-primary' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-md p-8 border-2 ${
                plan.popular 
                  ? 'relative border-brand-primary ring-4 ring-brand-primary ring-opacity-20' 
                  : `${plan.colorClass}`
              } bg-white flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
                {isAnnual && (
                  <div className="text-sm text-brand-primary mt-1">Billed annually (${plan.price * 12}/year)</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-3 mt-1 text-brand-primary">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full py-6 ${
                  plan.popular 
                    ? 'bg-brand-primary hover:bg-brand-primary/90' 
                    : 'bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-light'
                }`}
                onClick={() => handleSubscribe(plan.name)}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
