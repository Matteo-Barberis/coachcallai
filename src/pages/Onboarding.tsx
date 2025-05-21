
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingStruggles from '@/components/onboarding/OnboardingStruggles';
import OnboardingContactInfo from '@/components/onboarding/OnboardingContactInfo';
import OnboardingCoachSelect from '@/components/onboarding/OnboardingCoachSelect';
import { useToast } from '@/components/ui/use-toast';
import { useSessionContext } from '@/context/SessionContext';

type OnboardingData = {
  modeId: string;
  phone: string;
  objectives: string;
  coachId: string;
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    modeId: '',
    phone: '',
    objectives: '',
    coachId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSessionContext();

  // Check if we should load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('onboardingData');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage as we progress
  useEffect(() => {
    localStorage.setItem('onboardingData', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      if (!session?.user?.id) {
        toast({
          title: "Authentication error",
          description: "You need to be logged in to complete onboarding.",
          variant: "destructive",
        });
        navigate('/auth/sign-in');
        return;
      }

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

      // Update user profile with onboarding data and explicitly set is_onboarding to false
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: data.phone,
          assistant_id: data.coachId,
          objectives: data.objectives,
          current_mode_id: data.modeId,
          is_onboarding: false // Mark onboarding as complete
        })
        .eq('id', session.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
        
        // Check for duplicate phone number error
        if (profileError.code === '23505' && (
          profileError.message.includes('profiles_phone_key') || 
          profileError.message.includes('profiles_phone_unique')
        )) {
          toast({
            title: "Phone number already in use",
            description: "This phone number is already registered with another account. Please use a different phone number.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error saving preferences",
            description: "We couldn't save all your preferences. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Onboarding completed successfully!",
          description: "Welcome to Coach Call AI. You're all set to start your journey.",
        });
        
        // Clear onboarding data from localStorage
        localStorage.removeItem('onboardingData');
        
        // Wait a brief moment to ensure database writes are completed
        setTimeout(() => {
          // Redirect to dashboard directly
          navigate('/dashboard');
        }, 100);
      }
    } catch (error: any) {
      toast({
        title: "Onboarding error",
        description: error.message || "An error occurred during onboarding.",
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
              {[1, 2, 3].map((stepNumber) => (
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
                selectedMode={data.modeId} 
                onSelect={(modeId) => updateData({ modeId })} 
                onNext={nextStep} 
              />
            )}
            
            {step === 2 && (
              <OnboardingContactInfo 
                phone={data.phone}
                objectives={data.objectives}
                onChange={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            
            {step === 3 && (
              <OnboardingCoachSelect 
                selectedCoach={data.coachId}
                onSelect={(coachId) => updateData({ coachId })}
                onBack={prevStep}
                onComplete={handleComplete}
                modeId={data.modeId} // Pass the modeId to filter coaches
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
