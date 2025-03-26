
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@/context/SessionContext";

type Assistant = {
  id: string;
  name: string;
  personality_id: string;
  personality_name: string;
  personality_behavior: string;
};

// Group coaches by personality
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

const CoachSelect = () => {
  const [coaches, setCoaches] = useState<Assistant[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { session } = useSessionContext();

  // Fetch user's stored coach preference and all coaches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all coaches
        const { data: coachesData, error: coachesError } = await supabase
          .from('assistants')
          .select(`
            id, 
            name, 
            personality_id,
            personalities!inner (
              name, 
              behavior
            )
          `);
        
        if (coachesError) throw coachesError;
        
        // Transform coaches data
        const transformedCoaches = coachesData.map(item => ({
          id: item.id,
          name: item.name,
          personality_id: item.personality_id,
          personality_name: item.personalities.name,
          personality_behavior: item.personalities.behavior
        }));
        
        setCoaches(transformedCoaches);
        
        // If user is logged in, fetch their profile to get selected coach
        if (session?.user.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('assistant_id')
            .eq('id', session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          if (profileData?.assistant_id) {
            setSelectedCoach(profileData.assistant_id);
          } else if (transformedCoaches.length > 0) {
            // Default to first coach if user has no selection
            setSelectedCoach(transformedCoaches[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Save user's coach selection
  const handleCoachChange = async (coachId: string) => {
    setSelectedCoach(coachId);
    
    const coach = coaches.find(c => c.id === coachId);
    
    // Show toast notification
    toast({
      title: "Coach Selected",
      description: `You've selected ${coach?.name} as your coach.`,
    });
    
    // Save selection to user profile if logged in
    if (session?.user.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ assistant_id: coachId })
          .eq('id', session.user.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error saving coach selection:', error);
        toast({
          title: "Error",
          description: "Failed to save your coach selection. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading coaches...</div>;
  }

  const groupedCoaches = groupCoachesByPersonality(coaches);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium mr-1">Coach:</span>
      {coaches.length > 0 ? (
        <div className="flex items-center">
          <Select value={selectedCoach || undefined} onValueChange={handleCoachChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select a coach" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedCoaches).map(([personalityName, personalityCoaches]) => (
                <SelectGroup key={personalityName}>
                  <SelectLabel className="flex items-center">
                    {personalityName}
                  </SelectLabel>
                  {personalityCoaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>{coach.name}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No coaches available</div>
      )}
    </div>
  );
};

export default CoachSelect;
