
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface StruggleOption {
  id: string;
  label: string;
  description: string;
}

const strugglesOptions: StruggleOption[] = [
  {
    id: 'productivity',
    label: 'Productivity',
    description: 'I struggle with staying focused and getting things done.'
  },
  {
    id: 'fitness',
    label: 'Fitness & Health',
    description: 'I struggle with maintaining consistent exercise and healthy habits.'
  },
  {
    id: 'mindfulness',
    label: 'Mindfulness',
    description: 'I struggle with stress, anxiety, and staying present in the moment.'
  },
  {
    id: 'learning',
    label: 'Learning & Growth',
    description: 'I struggle with making time for skill development and personal growth.'
  }
];

interface OnboardingStrugglesProps {
  selectedArea: string;
  onSelect: (area: string) => void;
  onNext: () => void;
}

const OnboardingStruggles: React.FC<OnboardingStrugglesProps> = ({ 
  selectedArea, 
  onSelect, 
  onNext 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What do you struggle with most?</h1>
        <p className="text-gray-600">
          We'll customize your coach to help you with your specific challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strugglesOptions.map((option) => (
          <div
            key={option.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedArea === option.id
                ? 'border-brand-primary bg-brand-light/20 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{option.label}</h3>
                <p className="text-gray-600 text-sm mt-1">{option.description}</p>
              </div>
              {selectedArea === option.id && (
                <CheckCircle2 className="h-5 w-5 text-brand-primary" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          className="bg-brand-primary hover:bg-brand-primary/90"
          disabled={!selectedArea}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStruggles;
