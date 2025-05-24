
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, PlayCircle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface Coach {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  vapi_assistant_id?: string;
}

interface OnboardingCoachSelectProps {
  selectedCoach: string;
  onSelect: (coachId: string) => void;
  onBack: () => void;
  onComplete: () => void;
  modeId: string;
}

const OnboardingCoachSelect: React.FC<OnboardingCoachSelectProps> = ({
  selectedCoach,
  onSelect,
  onBack,
  onComplete,
  modeId
}) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingCoachId, setPlayingCoachId] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Fetch coaches filtered by modeId when component mounts or modeId changes
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        
        if (!modeId) {
          console.error('No mode ID provided to filter coaches');
          setError('Cannot load coaches: no coaching mode selected');
          setLoading(false);
          return;
        }
        
        console.log('Fetching coaches for mode ID:', modeId);
        
        // Fetch assistants filtered by the selected mode_id
        const { data, error } = await supabase
          .from('assistants')
          .select(`
            id, 
            name,
            vapi_assistant_id,
            personalities (
              name,
              behaviour_summary
            )
          `)
          .eq('mode_id', modeId);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data into the Coach interface format
          const transformedCoaches = data.map(assistant => ({
            id: assistant.id,
            name: assistant.name,
            title: assistant.personalities?.name || 'Coach',
            description: assistant.personalities?.behaviour_summary || 'Personal assistant to help you achieve your goals.',
            imageUrl: '/placeholder.svg',
            vapi_assistant_id: assistant.vapi_assistant_id
          }));
          
          setCoaches(transformedCoaches);
        } else {
          console.log('No coaches found for mode:', modeId);
          setError(`No coaches available for the selected coaching mode. Please try a different mode.`);
        }
      } catch (err: any) {
        console.error('Error fetching coaches:', err);
        setError('Failed to load coaches');
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [modeId]); // Removed onSelect from dependencies

  // Handle default selection when coaches are loaded and no coach is selected
  useEffect(() => {
    if (coaches.length > 0 && !selectedCoach) {
      onSelect(coaches[0].id);
    }
  }, [coaches, selectedCoach, onSelect]);

  // Function to play coach's voice
  const playCoachVoice = (coachId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const coach = coaches.find(c => c.id === coachId);
    if (!coach || !coach.vapi_assistant_id) {
      toast({
        title: "Audio Not Available",
        description: "Voice sample for this coach is not available.",
        variant: "destructive",
      });
      return;
    }

    const audioUrl = `https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/audio/${coach.vapi_assistant_id}.wav`;
    
    const newAudio = new Audio(audioUrl);
    
    newAudio.onplay = () => {
      setPlayingCoachId(coachId);
    };
    
    newAudio.onended = () => {
      setPlayingCoachId(null);
    };
    
    newAudio.onerror = () => {
      setPlayingCoachId(null);
      toast({
        title: "Audio Error",
        description: "Couldn't play the coach's voice sample.",
        variant: "destructive",
      });
    };
    
    setAudio(newAudio);
    newAudio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Couldn't play the coach's voice sample.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Coach</h1>
        <p className="text-gray-600">
          Select the coach who best fits your needs and personality.
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
      ) : coaches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No coaches available for this coaching mode. Please go back and select a different mode.</p>
          <Button
            onClick={onBack}
            className="mt-4"
          >
            Go Back
          </Button>
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
                <div className="h-16 w-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden relative">
                  <img 
                    src={coach.imageUrl} 
                    alt={coach.name} 
                    className="h-full w-full object-cover"
                  />
                  <button 
                    className={`absolute inset-0 flex items-center justify-center bg-black/30 ${playingCoachId === coach.id ? 'opacity-90' : 'opacity-60'}`}
                    onClick={(e) => playCoachVoice(coach.id, e)}
                    aria-label={`Play ${coach.name}'s voice`}
                  >
                    <PlayCircle className={`w-8 h-8 text-white ${playingCoachId === coach.id ? 'animate-pulse' : ''}`} />
                  </button>
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
          disabled={!selectedCoach || loading || coaches.length === 0}
          onClick={onComplete}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCoachSelect;
