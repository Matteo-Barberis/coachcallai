
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, UserRound, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CoachSelect from "@/components/CoachSelect";
import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Mindfulness mode ID (you'll need to update this with the actual ID)
const MINDFULNESS_MODE_ID = "mindfulness-mode-id";

const coachPersonalities = {
  "empathetic": {
    name: "Compassionate Guide",
    description: "A gentle, nurturing presence that offers deep empathy and understanding. This companion provides emotional support with warmth and helps you process feelings with loving kindness."
  },
  "results": {
    name: "Mindful Motivator", 
    description: "Combines gentle encouragement with purposeful guidance. This companion helps you build positive habits and mindful practices while maintaining a supportive, non-judgmental approach."
  },
  "friendly": {
    name: "Peaceful Friend",
    description: "A warm, uplifting companion that brings joy and positivity to your days. This friend celebrates your journey with genuine enthusiasm and offers constant encouragement for your well-being."
  }
};

const MindfulnessCoachVoiceShowcase = () => {
  const [activeCoach, setActiveCoach] = useState<string | null>(null);
  const [activePersonality, setActivePersonality] = useState<string>("empathetic");
  const [coachName, setCoachName] = useState<string>("Your Companion");
  const { session } = useSessionContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const navigate = useNavigate();
  
  const handleCoachSelect = (coachId: string, personalityType: string) => {
    setActiveCoach(coachId);
    setActivePersonality(personalityType);
    fetchCoachName(coachId);
  };

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

  useEffect(() => {
    if (!audio) {
      const sampleAudio = new Audio();
      
      sampleAudio.oncanplaythrough = () => {
        console.log("Audio has loaded and can be played");
        setAudioLoaded(true);
      };
      
      sampleAudio.onerror = (e) => {
        console.error("Error loading audio:", e);
        setAudioLoaded(false);
      };
      
      sampleAudio.onended = () => {
        setIsPlaying(false);
      };
      
      sampleAudio.src = "https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/audio/call_sample.mp3";
      sampleAudio.load();
      setAudio(sampleAudio);
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  const handlePlaySampleCall = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleSignupNavigation = () => {
    navigate('/auth/sign-up');
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meet Your Mindful AI Companion
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a companion with a voice and personality that brings you peace and comfort
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border border-purple-100">
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <h3 className="text-2xl font-semibold mb-4">Find Your Perfect Mindful Companion</h3>
              <p className="text-gray-600 mb-6">
                Your AI companion will gently guide you through daily mindfulness practices with a voice that feels nurturing and supportive. Listen to different companions to find the one that resonates with your soul.
              </p>
              
              <div className="bg-white p-6 rounded-lg border border-purple-100">
                <div className="flex items-center mb-6">
                  <Avatar className="h-16 w-16 mr-4 border-2 border-purple-200 bg-purple-50 flex items-center justify-center">
                    <AvatarFallback>
                      <UserRound className="h-10 w-10 text-purple-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Select a Companion</h4>
                    <p className="text-sm text-gray-500">Listen to their gentle voice</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <CoachSelect 
                    onCoachSelect={handleCoachSelect} 
                    defaultPersonalityType={!session ? "empathetic" : undefined}
                    suppressToast={true}
                    modeId={MINDFULNESS_MODE_ID}
                  />
                  <p className="text-sm text-gray-500 italic ml-4">
                    Click the speaker icon to hear their voice
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Card className="border border-purple-200 bg-white">
                <CardContent className="p-6">
                  <h4 className="font-medium text-lg mb-3">{coachName}'s Presence</h4>
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 animate-fadeIn">
                      <h5 className="font-semibold text-purple-600">
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.name}
                      </h5>
                      <p className="text-gray-600 mt-1">
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 bg-purple-50 rounded-lg border border-purple-200 p-6">
                <h4 className="font-medium text-lg mb-4">Hear a Mindful Conversation</h4>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Button 
                    onClick={handlePlaySampleCall}
                    variant="outline" 
                    size="sm"
                    className="h-12 w-12 mb-3 sm:mb-0 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50 mx-auto sm:mx-0"
                    disabled={!audioLoaded}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <div>
                    <p className="font-medium text-center sm:text-left">Sample Mindfulness Session</p>
                    <p className="text-sm text-gray-500 text-center sm:text-left">Experience how your companion guides with gentle care</p>
                  </div>
                </div>
                {isPlaying && (
                  <div className="mt-4">
                    <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 animate-progress"></div>
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

export default MindfulnessCoachVoiceShowcase;
