
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

type Assistant = {
  id: string;
  name: string;
  personality: string;
};

// Group coaches by personality
const groupCoachesByPersonality = (coaches: Assistant[]) => {
  const groupedCoaches: Record<string, Assistant[]> = {};
  
  coaches.forEach(coach => {
    if (!groupedCoaches[coach.personality]) {
      groupedCoaches[coach.personality] = [];
    }
    groupedCoaches[coach.personality].push(coach);
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
          .select('id, name, personality');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCoaches(data);
          // Set the first coach as default if no coach is selected
          if (!selectedCoach) {
            setSelectedCoach(data[0].id);
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
    
    // Find the coach name for the toast
    const coach = coaches.find(c => c.id === coachId);
    
    toast({
      title: "Coach Selected",
      description: `You've selected ${coach?.name} as your coach.`,
    });
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading coaches...</div>;
  }

  // Group coaches by personality
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
              {Object.entries(groupedCoaches).map(([personality, personalityCoaches]) => (
                <SelectGroup key={personality}>
                  <SelectLabel className="flex items-center">
                    {personality}
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60 p-2">
                        <p className="text-sm text-muted-foreground">
                          {personality === "Friendly" ? "Friendly & Encouraging" : 
                           personality === "Supportive" ? "Supportive & Empathetic" : 
                           personality === "Tough Love" ? "Tough Love & No-Nonsense" : 
                           personality}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  </SelectLabel>
                  {personalityCoaches.map((coach) => (
                    <HoverCard key={coach.id}>
                      <HoverCardTrigger asChild>
                        <SelectItem value={coach.id}>{coach.name}</SelectItem>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div>
                          <h4 className="font-semibold mb-1">{coach.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            A {personality.toLowerCase()} coach who helps you develop your skills and achieve your goals.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
