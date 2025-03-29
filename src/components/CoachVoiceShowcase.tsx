
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, UserRound, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CoachSelect from "@/components/CoachSelect";
import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/integrations/supabase/client";

// Define coach personalities
const coachPersonalities = {
  "empathetic": {
    name: "Empathetic Supporter",
    description: "Focuses on emotional well-being and positive reinforcement. This coach listens deeply, validates your feelings, and encourages self-compassion while gently guiding you toward your goals."
  },
  "results": {
    name: "Results-Driven Motivator",
    description: "Direct, focused on metrics and clear outcomes. This coach delivers honest feedback, challenges you to push beyond comfort zones, and emphasizes accountability to achieve measurable results."
  },
  "friendly": {
    name: "Friendly Encourager",
    description: "Provides positive, uplifting feedback and motivational support. This coach celebrates your wins, offers encouraging words during setbacks, and maintains an optimistic outlook to keep you inspired."
  }
};

const CoachVoiceShowcase = () => {
  const [activeCoach, setActiveCoach] = useState<string | null>(null);
  const [activePersonality, setActivePersonality] = useState<string>("empathetic"); // Default to empathetic
  const [coachName, setCoachName] = useState<string>("Coach"); // Default coach name
  const { session } = useSessionContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  // This function will be passed to CoachSelect to update the active coach and personality
  const handleCoachSelect = (coachId: string, personalityType: string) => {
    setActiveCoach(coachId);
    setActivePersonality(personalityType);
    
    // Fetch the coach's name when a coach is selected
    fetchCoachName(coachId);
  };
  
  // Function to fetch the coach's name from the database
  const fetchCoachName = async (coachId: string) => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select('name')
        .eq('id', coachId)
        .single();
      
      if (error) {
        console.error("Error fetching coach name:", error);
        return;
      }
      
      if (data) {
        setCoachName(data.name);
      }
    } catch (error) {
      console.error("Error fetching coach name:", error);
    }
  };

  // Function to handle playing the sample coaching call
  const handlePlaySampleCall = () => {
    // If audio is already playing, pause it
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Create a new audio element if none exists
    const sampleAudio = audio || new Audio("/sample-coaching-call.mp3");
    
    sampleAudio.onended = () => {
      setIsPlaying(false);
    };

    sampleAudio.play().catch(error => {
      console.error("Error playing audio:", error);
    });

    setAudio(sampleAudio);
    setIsPlaying(true);
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Meet Your Personal AI Coach</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a coach with a voice and personality that resonates with you. Listen to samples below.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">Find Your Perfect Coach Match</h3>
              <p className="text-gray-600 mb-6">
                Your AI coach will call and message you with a voice that feels natural and motivating. Select different coaches to hear their voices and find one that inspires you.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-brand-primary bg-gray-100 flex items-center justify-center">
                    <AvatarFallback>
                      <UserRound className="h-10 w-10 text-brand-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Select a Coach</h4>
                    <p className="text-sm text-gray-500">Listen to their voice sample</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <CoachSelect 
                    onCoachSelect={handleCoachSelect} 
                    defaultPersonalityType={!session ? "empathetic" : undefined}
                    suppressToast={true} // Add prop to suppress toast notifications
                  />
                  <p className="text-sm text-gray-500 italic ml-4">
                    Click the speaker icon to hear the voice
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <h4 className="font-medium text-lg mb-3">{coachName}'s Personality</h4>
                  <div className="space-y-4">
                    {/* Show only the selected personality */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200 animate-fadeIn">
                      <h5 className="font-semibold text-brand-primary">
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.name}
                      </h5>
                      <p className="text-gray-600 mt-1">
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* New section: Sample coaching call */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-medium text-lg mb-4">Hear a Real Coaching Call</h4>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handlePlaySampleCall}
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 rounded-full border-brand-primary text-brand-primary hover:bg-brand-light"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <div>
                    <p className="font-medium">Sample Accountability Call</p>
                    <p className="text-sm text-gray-500">Listen to how our AI coaches keep users on track</p>
                  </div>
                </div>
                {isPlaying && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary animate-progress"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachVoiceShowcase;
