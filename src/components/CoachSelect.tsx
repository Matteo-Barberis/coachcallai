
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@/context/SessionContext";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Profile } from "@/types/supabase"; // Explicitly import the Profile type from our types file

type Assistant = {
  id: string;
  name: string;
  personality_id: string;
  personality_name: string;
  personality_behaviour_summary: string;
  vapi_assistant_id: string;
  personality_type?: 'empathetic' | 'results' | 'friendly';
};

interface CoachSelectProps {
  onCoachSelect?: (coachId: string, personalityType: string) => void;
  defaultPersonalityType?: string;
  suppressToast?: boolean;
  modeId?: string;
}

const groupCoachesByPersonality = (coaches: Assistant[]) => {
  const groupedCoaches: Record<string, Assistant[]> = {};
  
  coaches.forEach(coach => {
    if (!groupedCoaches[coach.personality_name]) {
      groupedCoaches[coach.personality_name] = [];
    }
    groupedCoaches[coach.personality_name].push(coach);
  });
  
  return groupedCoaches;
};

// Map coach names to personality types
const getPersonalityType = (coachName: string): string => {
  // This mapping is simplified for demo purposes
  // Real implementation would need proper mapping based on database info
  const lowerName = coachName.toLowerCase();
  
  if (lowerName.includes('elara')) {
    return 'empathetic';
  } else if (lowerName.includes('cole')) {
    return 'results';
  } else {
    return 'friendly'; // Default to friendly for other coaches like Harry
  }
};

const CoachSelect: React.FC<CoachSelectProps> = ({ 
  onCoachSelect, 
  defaultPersonalityType,
  suppressToast = false,
  modeId
}) => {
  const [coaches, setCoaches] = useState<Assistant[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playingCoachId, setPlayingCoachId] = useState<string | null>(null);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);
  const { toast } = useToast();
  const { session, userProfile } = useSessionContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Determine which mode_id to use (explicitly provided or from user profile)
        let effectiveModeId = modeId;
        
        // If no modeId provided and user is authenticated, use their current mode
        if (!modeId && session?.user.id && userProfile?.current_mode_id) {
          effectiveModeId = userProfile.current_mode_id;
        }
        
        // Build query to fetch assistants
        let query = supabase
          .from('assistants')
          .select(`
            id, 
            name, 
            personality_id,
            vapi_assistant_id,
            personalities!inner (
              name, 
              behaviour_summary
            )
          `);
        
        // Filter by mode_id if available
        if (effectiveModeId) {
          query = query.eq('mode_id', effectiveModeId);
        }
        
        const { data: coachesData, error: coachesError } = await query;
        
        if (coachesError) throw coachesError;
        
        const transformedCoaches = coachesData.map(item => ({
          id: item.id,
          name: item.name,
          personality_id: item.personality_id,
          vapi_assistant_id: item.vapi_assistant_id,
          personality_name: item.personalities.name,
          personality_behaviour_summary: item.personalities.behaviour_summary,
          personality_type: getPersonalityType(item.name) as 'empathetic' | 'results' | 'friendly'
        }));
        
        setCoaches(transformedCoaches);
        
        // Only do this once, not on every re-render
        if (!initialSelectionDone) {
          // Handle selection for authenticated users
          if (session?.user.id) {
            let preferredAssistantId = null;
            
            if (effectiveModeId) {
              // Get preferred assistant from mode_preferences
              const { data: modePreference, error: modePreferenceError } = await supabase
                .from('mode_preferences')
                .select('assistant_id')
                .eq('user_id', session.user.id)
                .eq('mode_id', effectiveModeId)
                .maybeSingle();
              
              if (!modePreferenceError && modePreference?.assistant_id) {
                preferredAssistantId = modePreference.assistant_id;
              }
            } else {
              // Fallback to the legacy assistant_id from profiles if no mode filtering
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('assistant_id')
                .eq('id', session.user.id)
                .single();
                
              if (!profileError && profileData?.assistant_id) {
                preferredAssistantId = profileData.assistant_id;
              }
            }
            
            if (preferredAssistantId) {
              setSelectedCoach(preferredAssistantId);
              // Notify parent about selected coach on initial load
              const selectedCoachData = transformedCoaches.find(c => c.id === preferredAssistantId);
              if (selectedCoachData && onCoachSelect) {
                onCoachSelect(selectedCoachData.id, selectedCoachData.personality_type || 'friendly');
              }
            } else if (transformedCoaches.length > 0) {
              setSelectedCoach(transformedCoaches[0].id);
              // Notify parent about default selected coach
              if (onCoachSelect && transformedCoaches[0].personality_type) {
                onCoachSelect(transformedCoaches[0].id, transformedCoaches[0].personality_type);
              }
            }
          } 
          // Handle default selection for non-authenticated users
          else if (transformedCoaches.length > 0) {
            let defaultCoach;
            
            if (defaultPersonalityType) {
              // Try to find a coach with the specified personality type
              defaultCoach = transformedCoaches.find(
                coach => coach.personality_type === defaultPersonalityType
              );
              
              // Fallback to first coach if none with specified type found
              if (!defaultCoach) {
                defaultCoach = transformedCoaches[0];
              }
            } else {
              defaultCoach = transformedCoaches[0];
            }
            
            if (defaultCoach) {
              setSelectedCoach(defaultCoach.id);
              if (onCoachSelect) {
                onCoachSelect(defaultCoach.id, defaultCoach.personality_type || 'friendly');
              }
            }
          }
          
          setInitialSelectionDone(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, onCoachSelect, initialSelectionDone, modeId, userProfile]); // Dependencies

  const handleCoachChange = async (coachId: string) => {
    setSelectedCoach(coachId);
    
    const coach = coaches.find(c => c.id === coachId);
    
    // Only show toast if not suppressed
    if (!suppressToast) {
      toast({
        title: "Coach Selected",
        description: `You've selected ${coach?.name} as your coach.`,
      });
    }
    
    // Notify parent component about the selected coach and its personality type
    if (coach && onCoachSelect) {
      onCoachSelect(coach.id, coach.personality_type || 'friendly');
    }
    
    if (session?.user.id) {
      try {
        // Determine which mode_id to use
        let effectiveModeId = modeId;
        
        // If no modeId provided and user is authenticated, use their current mode
        if (!effectiveModeId && userProfile?.current_mode_id) {
          effectiveModeId = userProfile.current_mode_id;
        }
        
        if (effectiveModeId) {
          // Update the mode_preference for this mode
          const { error } = await supabase
            .from('mode_preferences')
            .update({ assistant_id: coachId })
            .eq('user_id', session.user.id)
            .eq('mode_id', effectiveModeId);
          
          if (error) throw error;
        } else {
          // Fallback to updating the legacy assistant_id in profiles if no mode is available
          const { error } = await supabase
            .from('profiles')
            .update({ assistant_id: coachId })
            .eq('id', session.user.id);
          
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error saving coach selection:', error);
        // Only show error toast if not suppressed
        if (!suppressToast) {
          toast({
            title: "Error",
            description: "Failed to save your coach selection. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const playCoachAudio = (coachId: string) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const coach = coaches.find(c => c.id === coachId);
    
    if (!coach) {
      console.error('Coach not found:', coachId);
      return;
    }
    
    const vapiAssistantId = coach.vapi_assistant_id;
    const audioUrl = `https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/audio/${vapiAssistantId}.wav`;
    
    console.log(`Attempting to play audio from URL: ${audioUrl}`);
    
    const newAudio = new Audio(audioUrl);
    
    newAudio.onplay = () => {
      console.log('Audio started playing successfully');
      setPlayingCoachId(coachId);
    };
    
    newAudio.onended = () => {
      console.log('Audio playback completed');
      setPlayingCoachId(null);
    };
    
    newAudio.onerror = (e) => {
      console.error('Error playing audio:', e);
      console.error('Audio element error code:', newAudio.error?.code);
      console.error('Audio element error message:', newAudio.error?.message);
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
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      toast({
        title: "Audio Error",
        description: "Couldn't play the coach's voice sample.",
        variant: "destructive",
      });
    });
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading coaches...</div>;
  }

  const groupedCoaches = groupCoachesByPersonality(coaches);

  return (
    <div className="flex items-center">
      {coaches.length > 0 ? (
        <div className="flex items-center">
          <Select value={selectedCoach || undefined} onValueChange={handleCoachChange}>
            <SelectTrigger className={`${isMobile ? "w-[100px]" : "w-[140px]"} h-9`}>
              <SelectValue placeholder="Select a coach" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedCoaches).map(([personalityName, personalityCoaches]) => (
                <SelectGroup key={personalityName}>
                  <SelectLabel className="flex items-center">
                    {personalityName}
                  </SelectLabel>
                  {personalityCoaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          {selectedCoach && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 h-8 w-8" 
              onClick={() => playCoachAudio(selectedCoach)}
              aria-label="Play coach voice sample"
            >
              <Volume2 className={`h-4 w-4 ${playingCoachId === selectedCoach ? 'text-primary animate-pulse' : ''}`} />
            </Button>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No coaches available</div>
      )}
    </div>
  );
};

export default CoachSelect;
