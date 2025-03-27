
import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface Coach {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

// Updated coaches with proper UUID format values
const coaches: Coach[] = [
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
];

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
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Coach</h1>
        <p className="text-gray-600">
          Select the coach who best fits your needs and personality.
        </p>
      </div>

      <RadioGroup value={selectedCoach} onValueChange={onSelect} className="space-y-4">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className={`border rounded-lg p-4 transition-all ${
              selectedCoach === coach.id
                ? 'border-brand-primary bg-brand-light/20 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-4">
              <RadioGroupItem id={coach.id} value={coach.id} className="sr-only" />
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

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="bg-brand-primary hover:bg-brand-primary/90"
          disabled={!selectedCoach}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCoachSelect;
