
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "@/components/PhoneInput";

interface OnboardingContactInfoProps {
  firstName: string;
  lastName: string;
  phone: string;
  objectives: string;
  onChange: (data: { firstName?: string; lastName?: string; phone?: string; objectives?: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingContactInfo: React.FC<OnboardingContactInfoProps> = ({
  firstName,
  lastName,
  phone,
  objectives,
  onChange,
  onNext,
  onBack
}) => {
  const isValid = firstName.trim() !== '' && lastName.trim() !== '' && phone.trim() !== '';

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Coaching Setup</h1>
        <p className="text-gray-600">
          Tell us how to reach you and what you're looking to achieve with coaching.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <PhoneInput
            value={phone}
            onChange={(value) => onChange({ phone: value })}
            placeholder="+1 (555) 123-4567"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your coach will call you at this number to check in on your progress.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Your Coaching Objectives</Label>
          <Textarea
            id="objectives"
            value={objectives || ''}
            onChange={(e) => onChange({ objectives: e.target.value })}
            placeholder="What specific goals would you like to achieve with your coach? E.g., improve work-life balance, develop leadership skills, etc."
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-500 mt-1">
            This helps your coach understand how to best support you.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="bg-brand-primary hover:bg-brand-primary/90"
          disabled={!isValid}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingContactInfo;
