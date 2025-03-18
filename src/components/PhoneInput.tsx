
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Only allow digits, plus sign, and spaces for easier editing
    if (/^[0-9+ ]*$/.test(input)) {
      onChange(input);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number (with country code)</Label>
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          value={value}
          onChange={handleChange}
          className={error ? "border-red-300 pr-10" : ""}
        />
      </div>
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-sm text-gray-500">
        Enter in E.164 format (e.g., +447123456789, +14155552671)
      </p>
    </div>
  );
};

export default PhoneInput;
