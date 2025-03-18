
import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// A selection of common country codes
const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+91', country: 'India' },
  { code: '+52', country: 'Mexico' },
  { code: '+55', country: 'Brazil' },
  { code: '+34', country: 'Spain' },
  { code: '+39', country: 'Italy' },
  { code: '+7', country: 'Russia' },
  { code: '+27', country: 'South Africa' },
  { code: '+31', country: 'Netherlands' },
  { code: '+65', country: 'Singapore' },
  // Add more as needed
];

const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
  // Extract country code and number parts from the full value
  const [selectedCode, setSelectedCode] = useState(() => {
    const matchedCode = countryCodes.find(c => value?.startsWith(c.code));
    return matchedCode?.code || '+1';
  });
  
  const [nationalNumber, setNationalNumber] = useState(() => {
    if (!value) return '';
    const matchedCode = countryCodes.find(c => value.startsWith(c.code));
    return matchedCode ? value.substring(matchedCode.code.length).trim() : value;
  });

  // When country code changes, update the full value
  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
    const newValue = `${code}${nationalNumber.replace(/\s+/g, '')}`;
    onChange(newValue);
  };

  // When number part changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Only allow digits and spaces
    if (/^[0-9 ]*$/.test(input)) {
      setNationalNumber(input);
      const newValue = `${selectedCode}${input.replace(/\s+/g, '')}`;
      onChange(newValue);
    }
  };

  // Format example based on selected country code
  const getPlaceholder = useMemo(() => {
    switch(selectedCode) {
      case '+1': return '(555) 123 4567';
      case '+44': return '7911 123456';
      case '+61': return '4 1234 5678';
      default: return '123 456 7890';
    }
  }, [selectedCode]);

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex space-x-2">
        <div className="w-[130px]">
          <Select value={selectedCode} onValueChange={handleCodeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map(({ code, country }) => (
                <SelectItem key={code} value={code}>
                  {code} {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Input
            id="phone"
            type="tel"
            placeholder={getPlaceholder}
            value={nationalNumber}
            onChange={handleNumberChange}
            className={error ? "border-red-300" : ""}
          />
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PhoneInput;
