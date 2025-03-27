
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Coach {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface OnboardingCoachSelectProps {
  selectedCoach: string;
  onSelect: (coachId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingCoachSelect: React.FC<OnboardingCoachSelectProps> = ({
  selectedCoach,
  onSelect,
  onNext,
  onBack
}) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch coaches only once when component mounts
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        
        // Fetch assistants with their personality information
        const { data, error } = await supabase
          .from('assistants')
          .select(`
            id, 
            name,
            personalities (
              name,
              behavior
            )
          `);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data into the Coach interface format
          const transformedCoaches = data.map(assistant => ({
            id: assistant.id,
            name: assistant.name,
            title: assistant.personalities?.name || 'Coach',
            description: assistant.personalities?.behavior || 'Personal assistant to help you achieve your goals.',
            imageUrl: '/placeholder.svg'
          }));
          
          setCoaches(transformedCoaches);
          
          // If no coach is selected yet, select the first one by default
          if (!selectedCoach && transformedCoaches.length > 0) {
            onSelect(transformedCoaches[0].id);
          }
        } else {
          // If no coaches are found in the database, set a fallback
          setCoaches([
            {
              id: '5c8d3aba-0c2e-4cc5-a114-d4558c8efed2',
              name: 'Alex',
              title: 'Productivity Coach',
              description: 'Helps you build effective routines and stay focused on your most important tasks.',
              imageUrl: '/placeholder.svg'
            },
            {
              id: '45a76abb-e468-4cc4-badb-9567d3b13193',
              name: 'Sam',
              title: 'Mindfulness Coach',
              description: 'Guides you to reduce stress and be more present in your daily life.',
              imageUrl: '/placeholder.svg'
            },
            {
              id: '6d2edf2a-bc0f-4a05-a8c0-3b11c4bfe3ba',
              name: 'Taylor',
              title: 'Fitness Coach',
              description: 'Keeps you accountable for your physical health and exercise goals.',
              imageUrl: '/placeholder.svg'
            }
          ]);
        }
      } catch (err: any) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Coach</h1>
        <p className="text-gray-600">
          Select the coach who best fits your needs and personality.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading coaches...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <RadioGroup value={selectedCoach} onValueChange={onSelect} className="space-y-4">
          {coaches.map((coach) => (
            <div
              key={coach.id}
              onClick={() => onSelect(coach.id)}
              className={`block border rounded-lg p-4 transition-all cursor-pointer ${
                selectedCoach === coach.id
                  ? 'border-brand-primary bg-brand-light/20 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                  <img 
                    src={coach.imageUrl} 
                    alt={coach.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={coach.id} className="font-medium text-lg text-gray-900 mb-1 block">
                    {coach.name}
                  </Label>
                  <p className="text-brand-primary font-medium text-sm">{coach.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{coach.description}</p>
                </div>
                {selectedCoach === coach.id && (
                  <div className="h-6 w-6 rounded-full bg-brand-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="bg-brand-primary hover:bg-brand-primary/90"
          disabled={!selectedCoach || loading}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCoachSelect;
