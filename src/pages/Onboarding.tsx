import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingStruggles from '@/components/onboarding/OnboardingStruggles';
import OnboardingContactInfo from '@/components/onboarding/OnboardingContactInfo';
import OnboardingCoachSelect from '@/components/onboarding/OnboardingCoachSelect';
import OnboardingSignup from '@/components/onboarding/OnboardingSignup';
import { useToast } from '@/components/ui/use-toast';

type OnboardingData = {
  focusArea: string;
  firstName: string;
  lastName: string;
  phone: string;
  coachId: string;
  email: string;
  password: string;
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    focusArea: '',
    firstName: '',
    lastName: '',
    phone: '',
    coachId: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onboardingData', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (data.coachId) {
        const { data: coachData, error: coachError } = await supabase
          .from('assistants')
          .select('id')
          .eq('id', data.coachId)
          .single();
          
        if (coachError || !coachData) {
          toast({
            title: "Coach selection error",
            description: "The selected coach is not available. Please try selecting another coach.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
          },
        },
      });

      const isRepeatedSignup = !error && (!authData?.user?.id || authData?.user?.identities?.length === 0);
      
      if (isRepeatedSignup) {
        toast({
          title: "Email already in use",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        
        navigate('/auth/sign-in');
        return;
      }

      if (error) {
        throw error;
      }

      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: data.phone,
            focus_areas: { main: data.focusArea },
            assistant_id: data.coachId,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error("Profile update error:", profileError);
          toast({
            title: "Account created with limited information",
            description: "Your account was created, but we couldn't save all your preferences. You can update them later in your profile.",
            variant: "default",
          });
        } else {
          toast({
            title: "Account created successfully!",
            description: "Welcome to Coach Call AI. You're all set to start your journey.",
          });
        }

        localStorage.removeItem('onboardingData');

        const { data: authSettings } = await supabase.auth.getSession();
        if (authSettings?.session) {
          navigate('/dashboard');
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email for verification before signing in.",
          });
          navigate('/auth/sign-in');
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Coach Call AI</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-gray-100">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className={`flex-1 h-2 rounded-full mx-1 ${
                    stepNumber <= step ? 'bg-brand-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">
            {step === 1 && (
              <OnboardingStruggles 
                selectedArea={data.focusArea} 
                onSelect={(area) => updateData({ focusArea: area })} 
                onNext={nextStep} 
              />
            )}
            
            {step === 2 && (
              <OnboardingContactInfo 
                firstName={data.firstName}
                lastName={data.lastName}
                phone={data.phone}
                onChange={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            
            {step === 3 && (
              <OnboardingCoachSelect 
                selectedCoach={data.coachId}
                onSelect={(coachId) => updateData({ coachId })}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            
            {step === 4 && (
              <OnboardingSignup 
                email={data.email}
                password={data.password}
                onChange={updateData}
                onBack={prevStep}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
