
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CoachSelect from "@/components/CoachSelect";

const CoachVoiceShowcase = () => {
  const [activeCoach, setActiveCoach] = useState<string | null>(null);
  
  // This component leverages the existing CoachSelect component
  // which already has audio playback functionality

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
                  <Avatar className="h-16 w-16 mr-4 border-2 border-brand-primary">
                    <AvatarImage src="https://pwiqicyfwvwwgqbxhmvv.supabase.co/storage/v1/object/public/images//liv.png" alt="Coach" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Select a Coach</h4>
                    <p className="text-sm text-gray-500">Listen to their voice sample</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <CoachSelect />
                  <p className="text-sm text-gray-500 italic ml-4">
                    Click the speaker icon to hear the voice
                  </p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <Card className="border border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <h4 className="font-medium text-lg mb-3">Coach Personalities</h4>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-brand-primary">Empathetic Supporter</h5>
                      <p className="text-gray-600 mt-1">
                        Focuses on emotional well-being and positive reinforcement. This coach listens deeply, validates your feelings, and encourages self-compassion while gently guiding you toward your goals.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-brand-primary">Results-Driven Motivator</h5>
                      <p className="text-gray-600 mt-1">
                        Direct, focused on metrics and clear outcomes. This coach delivers honest feedback, challenges you to push beyond comfort zones, and emphasizes accountability to achieve measurable results.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="font-semibold text-brand-primary">Analytical Strategist</h5>
                      <p className="text-gray-600 mt-1">
                        Logical, systematic approach to problem-solving. This coach helps break down complex goals into manageable steps, identifies patterns in your behavior, and develops tailored strategies for success.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoachVoiceShowcase;
