
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    toast({
      title: `${plan} Plan Selected`,
      description: "Thanks for your interest! Early access sign-up confirmed.",
    });
    navigate('/auth/sign-up');
  };

  const plans = {
    starter: {
      name: "Starter",
      description: "Perfect for individuals starting their accountability journey",
      price: 19,
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
    medium: {
      name: "Medium",
      description: "For those committed to consistent accountability",
      price: 39,
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
    pro: {
      name: "Pro",
      description: "Comprehensive accountability solution for serious achievers",
      price: 99,
      features: [
        "Everything in Medium plan",
        "Priority scheduling",
        "Advanced analytics dashboard",
        "Personalized strategy sessions",
        "Custom accountability framework",
        "API access",
        "Dedicated account manager"
      ],
      popular: false,
      colorClass: "border-gray-200 hover:border-brand-primary"
    }
  };

  const selectedPlanData = plans[selectedPlan as keyof typeof plans];

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            
          </p>
          
          <Tabs defaultValue="pro" value={selectedPlan} onValueChange={setSelectedPlan} className="w-full max-w-md mx-auto mt-8">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="starter">Starter</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`rounded-2xl shadow-md p-8 border-2 ${
                key === selectedPlan 
                  ? 'relative border-brand-primary ring-4 ring-brand-primary ring-opacity-20' 
                  : `${plan.colorClass}`
              } bg-white flex flex-col h-full`}
            >
              {key === selectedPlan && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-brand-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Selected
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
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
                  key === selectedPlan 
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
