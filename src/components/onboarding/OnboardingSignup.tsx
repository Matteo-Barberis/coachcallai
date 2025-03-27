
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface OnboardingSignupProps {
  email: string;
  password: string;
  onChange: (data: { email?: string; password?: string }) => void;
  onBack: () => void;
  onComplete: () => void;
}

const OnboardingSignup: React.FC<OnboardingSignupProps> = ({
  email,
  password,
  onChange,
  onBack,
  onComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 6;
  const isValid = isValidEmail && isValidPassword;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-600">
          You're almost done! Create your account to get started with your AI coach.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="johndoe@example.com"
          />
          {email && !isValidEmail && (
            <p className="text-sm text-red-500">Please enter a valid email address</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onChange({ password: e.target.value })}
              placeholder="Create a secure password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password && !isValidPassword && (
            <p className="text-sm text-red-500">Password must be at least 6 characters</p>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-brand-primary hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a>.
        </p>
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
          onClick={onComplete}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSignup;
