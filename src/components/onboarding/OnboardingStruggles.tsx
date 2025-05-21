
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Mode {
  id: string;
  name: string;
  description: string;
}

interface OnboardingModeProps {
  selectedMode: string;
  onSelect: (modeId: string) => void;
  onNext: () => void;
}

const OnboardingStruggles: React.FC<OnboardingModeProps> = ({ 
  selectedMode, 
  onSelect, 
  onNext 
}) => {
  const [modes, setModes] = useState<Mode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModes = async () => {
      try {
        const { data, error } = await supabase
          .from('modes')
          .select('id, name, description')
          .order('created_at');
          
        if (error) {
          console.error('Error fetching modes:', error);
          setError('Failed to load coaching modes. Please try again.');
        } else {
          setModes(data || []);
        }
      } catch (err) {
        console.error('Exception when fetching modes:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchModes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Select Your Coaching Mode</h1>
        <p className="text-gray-600">
          Choose the type of coaching that best matches your goals. We'll customize your experience accordingly.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMode === mode.id
                  ? 'border-brand-primary bg-brand-light/20 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => onSelect(mode.id)}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{mode.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{mode.description}</p>
                </div>
                {selectedMode === mode.id && (
                  <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          className="bg-brand-primary hover:bg-brand-primary/90"
          disabled={!selectedMode || loading}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStruggles;
