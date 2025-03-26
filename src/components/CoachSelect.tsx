
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Assistant = {
  id: string;
  name: string;
  personality: string;
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

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Coach:</span>
      {coaches.length > 0 ? (
        <Select value={selectedCoach || undefined} onValueChange={handleCoachChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select a coach" />
          </SelectTrigger>
          <SelectContent>
            {coaches.map((coach) => (
              <HoverCard key={coach.id}>
                <HoverCardTrigger asChild>
                  <SelectItem value={coach.id}>{coach.name}</SelectItem>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4">
                  <div>
                    <h4 className="font-semibold mb-1">{coach.name}</h4>
                    <p className="text-sm text-muted-foreground">{coach.personality}</p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-sm text-gray-500">No coaches available</div>
      )}
    </div>
  );
};

export default CoachSelect;
