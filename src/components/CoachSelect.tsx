import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data, error } = await supabase
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
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const transformedData = data.map(item => ({
            id: item.id,
            name: item.name,
            personality_id: item.personality_id,
            personality_name: item.personalities.name,
            personality_behavior: item.personalities.behavior
          }));
          
          setCoaches(transformedData);
          if (!selectedCoach) {
            setSelectedCoach(transformedData[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching coaches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [selectedCoach]);

  const handleCoachChange = (coachId: string) => {
    setSelectedCoach(coachId);
    
    const coach = coaches.find(c => c.id === coachId);
    
    toast({
      title: "Coach Selected",
      description: `You've selected ${coach?.name} as your coach.`,
    });
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
