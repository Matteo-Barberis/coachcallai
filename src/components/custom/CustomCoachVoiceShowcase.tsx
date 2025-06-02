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

// Hardcoded accountability mode ID as requested
const ACCOUNTABILITY_MODE_ID = "a62991a7-2e22-4f17-bd3c-4752a5b6b13a";
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
const CustomCoachVoiceShowcase = () => {
  const [activeCoach, setActiveCoach] = useState<string | null>(null);
  const [activePersonality, setActivePersonality] = useState<string>("empathetic"); // Default to empathetic
  const [coachName, setCoachName] = useState<string>("Coach"); // Default coach name
  const {
    session
  } = useSessionContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const handleCoachSelect = (coachId: string, personalityType: string) => {
    setActiveCoach(coachId);
    setActivePersonality(personalityType);
    fetchCoachName(coachId);
  };
  const fetchCoachName = async (coachId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('assistants').select('name').eq('id', coachId).single();
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
      sampleAudio.onerror = e => {
        console.error("Error loading audio:", e);
        console.error("Audio error details:", sampleAudio.error);
        setAudioLoaded(false);
      };
      sampleAudio.onended = () => {
        setIsPlaying(false);
      };

      // Update the audio source to the specific Supabase storage URL
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
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
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
              <h3 className="text-2xl font-semibold mb-4">Find Your Perfect Coach Match</h3>
              <p className="text-gray-600 mb-6">
                Your AI coach will call and message you with a voice that feels natural and motivating. Select different coaches to hear their voices and find one that inspires you.
              </p>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Avatar className={`h-16 w-16 mr-4 border-2 ${theme.border} bg-gray-100 flex items-center justify-center`}>
                    <AvatarFallback>
                      <UserRound className={`h-10 w-10 ${theme.primary}`} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Select a Coach</h4>
                    <p className="text-sm text-gray-500">Listen to their voice sample</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <CoachSelect onCoachSelect={handleCoachSelect} defaultPersonalityType={!session ? "empathetic" : undefined} suppressToast={true} modeId={ACCOUNTABILITY_MODE_ID} // Pass the hardcoded mode ID
                />
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
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fadeIn">
                      <h5 className={`font-semibold ${theme.primary}`}>
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.name}
                      </h5>
                      <p className="text-gray-600 mt-1">
                        {coachPersonalities[activePersonality as keyof typeof coachPersonalities]?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h4 className="font-medium text-lg mb-4">Hear a Real Coaching Call</h4>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <Button onClick={handlePlaySampleCall} variant="outline" size="sm" className={`h-12 w-12 mb-3 sm:mb-0 rounded-full ${theme.border} ${theme.primary} ${theme.hover} mx-auto sm:mx-0`} disabled={!audioLoaded}>
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <div>
                    <p className="font-medium text-center sm:text-left">Sample Accountability Call</p>
                    <p className="text-sm text-gray-500 text-center sm:text-left">Listen to how our AI coaches keep users on track</p>
                  </div>
                </div>
                {isPlaying && <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${theme.progressBg} animate-progress`}></div>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CustomCoachVoiceShowcase;