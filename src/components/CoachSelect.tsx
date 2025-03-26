
import React, { useState, useEffect } from 'react';
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Assistant = {
  id: string;
  name: string;
  personality: string;
};

const CoachSelect = () => {
  const { toast } = useToast();
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);

  // Fetch assistants from the database
  const { data: assistants, isLoading, error } = useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assistants')
        .select('*');
      
      if (error) throw new Error(error.message);
      return data as Assistant[];
    }
  });

  useEffect(() => {
    // Set the first assistant as default if there are assistants and none is selected
    if (assistants && assistants.length > 0 && !selectedCoach) {
      setSelectedCoach(assistants[0].id);
    }
  }, [assistants, selectedCoach]);

  const handleCoachChange = async (coachId: string) => {
    setSelectedCoach(coachId);
    
    // Here you would update the user's preferred coach in your database
    // For now, we'll just show a toast notification
    const selectedAssistant = assistants?.find(a => a.id === coachId);
    
    if (selectedAssistant) {
      toast({
        title: "Coach Selected",
        description: `You've selected ${selectedAssistant.name} as your coach.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-[250px] animate-pulse bg-gray-200 rounded-md"></div>
    );
  }

  if (error || !assistants || assistants.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No coaches available at the moment.
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Your Coach
      </label>
      <Select
        value={selectedCoach || undefined}
        onValueChange={handleCoachChange}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select a coach" />
        </SelectTrigger>
        <SelectContent>
          {assistants.map((assistant) => (
            <HoverCard key={assistant.id}>
              <HoverCardTrigger asChild>
                <SelectItem value={assistant.id} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{assistant.name}</span>
                  </div>
                </SelectItem>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">{assistant.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {assistant.personality}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CoachSelect;
