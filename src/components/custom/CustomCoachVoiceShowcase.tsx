
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, UserRound, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CoachSelect from "@/components/CoachSelect";
import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

// Custom mode ID - updated to use the correct database ID
const CUSTOM_MODE_ID = "cc5d220e-d1d1-4d5c-b865-f5ff78c70e7d";

const CustomCoachVoiceShowcase = () => {
  const [activeCoach, setActiveCoach] = useState<string | null>(null);
  const [activePersonality, setActivePersonality] = useState<any>(null);
  const [coachName, setCoachName] = useState<string>("Companion");
  const {
    session
  } = useSessionContext();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCoachSelect = (coachId: string, personalityType: string) => {
    setActiveCoach(coachId);
    fetchCoachData(coachId);
  };

  const fetchCoachData = async (coachId: string) => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select(`
          name,
          personalities (
            name,
            behaviour_summary
          )
        `)
        .eq('id', coachId)
        .single();
      
      if (error) {
        console.error("Error fetching coach data:", error);
        return;
      }
      
      if (data) {
        setCoachName(data.name);
        setActivePersonality(data.personalities);
      }
    } catch (error) {
      console.error("Error fetching coach data:", error);
    }
  };

  const handleSignupNavigation = () => {
    navigate('/auth/sign-up');
  };

  return <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme.titleGradient}`}>Choose Your Perfect AI Companion</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose a companion with a voice and personality that resonates with you or create your own</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">Find Your Perfect Companion Match</h3>
              <p className="text-gray-600 mb-6">
                Your AI companion will call and message you with a voice that feels natural and motivating. Select different companions to hear their voices and find one that inspires you.
              </p>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Avatar className={`h-16 w-16 mr-4 border-2 ${theme.border} bg-gray-100 flex items-center justify-center`}>
                    <AvatarFallback>
                      <UserRound className={`h-10 w-10 ${theme.primary}`} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Select a Companion</h4>
                    <p className="text-sm text-gray-500">Listen to their voice sample</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <CoachSelect onCoachSelect={handleCoachSelect} defaultPersonalityType={!session ? "empathetic" : undefined} suppressToast={true} modeId={CUSTOM_MODE_ID} />
                  <p className="text-sm text-gray-500 italic ml-4">
                    Click the speaker icon to hear the voice
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-6">
                  <h4 className="font-medium text-lg mb-3">{coachName}'s Personality</h4>
                  <div className="space-y-4">
                    {activePersonality && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fadeIn">
                        <h5 className={`font-semibold ${theme.primary}`}>
                          {activePersonality.name}
                        </h5>
                        <p className="text-gray-600 mt-1">
                          {activePersonality.behaviour_summary}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default CustomCoachVoiceShowcase;
