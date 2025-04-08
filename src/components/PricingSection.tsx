
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface PlanFeature {
  text: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: PlanFeature[];
  popular: boolean;
  colorClass: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: Json;
  stripe_price_id: string;
  is_active: boolean;
  interval: string;
}

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState("Medium");
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true });

        if (error) {
          console.error('Error fetching subscription plans:', error);
          return;
        }

        if (data) {
          const formattedPlans: Record<string, Plan> = {};
          
          data.forEach((plan: SubscriptionPlan, index: number) => {
            const planKey = plan.name.toLowerCase().replace(/\s+/g, '_');
            
            // Parse features from JSON to array of PlanFeature objects
            let formattedFeatures: PlanFeature[] = [];
            
            if (plan.features) {
              // Handle different potential formats of features in the database
              if (Array.isArray(plan.features)) {
                formattedFeatures = plan.features.map(feature => {
                  if (typeof feature === 'string') {
                    return { text: feature };
                  } else if (typeof feature === 'object' && feature !== null && 'text' in feature) {
                    return { text: String(feature.text) };
                  }
                  return { text: String(feature) };
                });
              } else if (typeof plan.features === 'string') {
                try {
                  // Try to parse if it's a JSON string
                  const parsedFeatures = JSON.parse(plan.features);
                  if (Array.isArray(parsedFeatures)) {
                    formattedFeatures = parsedFeatures.map(f => 
                      typeof f === 'string' ? { text: f } : { text: String(f.text || f) }
                    );
                  }
                } catch (e) {
                  // If not valid JSON, just use as a single feature
                  formattedFeatures = [{ text: plan.features as string }];
                }
              }
            }
            
            formattedPlans[planKey] = {
              id: plan.id,
              name: plan.name,
              description: plan.description || `Perfect for ${plan.name.toLowerCase()} users`,
              price: plan.price,
              features: formattedFeatures,
              popular: index === 1, // Middle plan is popular
              colorClass: index === 1 
                ? 'border-brand-primary' 
                : 'border-gray-200 hover:border-brand-primary'
            };
          });
          
          setPlans(formattedPlans);
          
          // Set default selected plan to the middle one (if exists)
          if (Object.keys(formattedPlans).length > 0) {
            const keys = Object.keys(formattedPlans);
            if (keys.length > 1) {
              const middleIdx = Math.floor(keys.length / 2);
              setSelectedPlan(formattedPlans[keys[middleIdx]].name);
            } else {
              setSelectedPlan(formattedPlans[keys[0]].name);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchSubscriptionPlans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSubscribe = (plan: string) => {
    toast({
      title: `${plan} Plan Selected`,
      description: "Thanks for your interest! Early access sign-up confirmed.",
    });
    navigate('/auth/sign-up');
  };

  // Fallback to hardcoded plans if database fetch fails or is empty
  const getFallbackPlans = () => {
    return {
      starter: {
        name: "Starter",
        description: "Perfect for individuals starting their accountability journey",
        price: 19,
        features: [
          { text: "Weekly WhatsApp check-ins" },
          { text: "2 phone calls per week" },
          { text: "Basic progress tracking" },
          { text: "Single goal setting" },
          { text: "Email support" }
        ],
        popular: false,
        colorClass: "border-gray-200 hover:border-brand-primary"
      },
      medium: {
        name: "Medium",
        description: "For those committed to consistent accountability",
        price: 39,
        features: [
          { text: "Daily WhatsApp check-ins" },
          { text: "5 phone calls per week" },
          { text: "Advanced progress tracking" },
          { text: "Multiple goal setting" },
          { text: "Priority support" },
          { text: "Custom call scheduling" },
          { text: "Habit streak tracking" }
        ],
        popular: true,
        colorClass: "border-brand-primary"
      },
      pro: {
        name: "Pro",
        description: "Comprehensive accountability solution for serious achievers",
        price: 99,
        features: [
          { text: "Everything in Medium plan" },
          { text: "Priority scheduling" },
          { text: "Advanced analytics dashboard" },
          { text: "Personalized strategy sessions" },
          { text: "Custom accountability framework" },
          { text: "API access" },
          { text: "Dedicated account manager" }
        ],
        popular: false,
        colorClass: "border-gray-200 hover:border-brand-primary"
      }
    };
  };

  // Use fetched plans or fallback to hardcoded plans if empty
  const displayPlans = Object.keys(plans).length > 0 ? plans : getFallbackPlans();
  const planNames = Object.values(displayPlans).map(plan => plan.name);

  if (loading) {
    // Return skeleton loading UI that matches the existing design
    return (
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto"></p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl shadow-md p-8 border-2 border-gray-200 bg-white flex flex-col h-full animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-3 mb-8 flex-grow">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-start">
                      <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            
          </p>
          
          {isMobile && (
            <Tabs 
              defaultValue={selectedPlan} 
              value={selectedPlan} 
              onValueChange={setSelectedPlan} 
              className="w-full max-w-md mx-auto mt-8"
            >
              <TabsList className="grid grid-cols-3 w-full">
                {planNames.map((name) => (
                  <TabsTrigger key={name} value={name}>{name}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>

        {isMobile ? (
          // Mobile view - Show only the selected plan
          <div className="flex justify-center">
            {Object.entries(displayPlans).map(([key, plan]) => {
              if (plan.name === selectedPlan) {
                return (
                  <div
                    key={key}
                    className={`rounded-2xl shadow-md p-8 border-2 border-brand-primary ring-4 ring-brand-primary ring-opacity-20 bg-white flex flex-col h-full max-w-md w-full relative`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                        <Badge variant="default" className="bg-brand-primary text-white px-4 py-1">
                          Most Popular
                        </Badge>
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
                          <span className="text-gray-700">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full py-6 bg-brand-primary hover:bg-brand-primary/90"
                      onClick={() => handleSubscribe(plan.name)}
                    >
                      Get Started
                    </Button>
                  </div>
                );
              }
              return null;
            })}
          </div>
        ) : (
          // Desktop view - Show all plans
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(displayPlans).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl shadow-md p-8 border-2 ${
                  plan.name === selectedPlan 
                    ? 'relative border-brand-primary ring-4 ring-brand-primary ring-opacity-20' 
                    : `${plan.colorClass}`
                } bg-white flex flex-col h-full`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <Badge variant="default" className="bg-brand-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
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
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full py-6 ${
                    plan.name === selectedPlan 
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
        )}
      </div>
    </section>
  );
};

export default PricingSection;
