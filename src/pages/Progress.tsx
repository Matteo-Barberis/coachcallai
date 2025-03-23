import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProgressOverview from '@/components/progress/ProgressOverview';
import InsightCard from '@/components/progress/InsightCard';
import ProgressTimeline from '@/components/progress/ProgressTimeline';
import KeywordCloud from '@/components/progress/KeywordCloud';
import CallTimeline from '@/components/progress/CallTimeline';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, FileBarChart, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import type { CallLog, UserAchievement } from '@/types/supabase';
import AchievementTimeline from '@/components/progress/AchievementTimeline';

const Progress = () => {
  const { session, loading } = useSessionContext();
  const [openCallId, setOpenCallId] = useState<string | null>(null);

  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const { data: callLogs, isLoading: callLogsLoading } = useQuery({
    queryKey: ['callLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!session,
  });

  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: async () => {
      if (!session?.user.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', session.user.id)
        .order('achievement_date', { ascending: false });
      
      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!session,
  });

  const completedCalls = callLogs?.filter(call => call.status === 'completed').length || 0;
  const totalCalls = callLogs?.length || 0;
  
  const mockMilestonesAchieved = 4;
  const mockTotalMilestones = 10;
  const mockObjectivesProgress = 65;

  const mockInsights = [
    {
      text: "Your consistency in attending calls has improved by 20% over the last month.",
      category: "insight" as const,
      date: "Aug 15, 2024"
    },
    {
      text: "You've made significant progress in practicing mindfulness techniques daily.",
      category: "achievement" as const,
      date: "Aug 10, 2024"
    },
    {
      text: "You've had a breakthrough in understanding how work triggers affect your stress levels.",
      category: "breakthrough" as const,
      date: "Aug 5, 2024"
    },
    {
      text: "Try to incorporate more breathing exercises before stressful meetings.",
      category: "insight" as const,
      date: "Jul 28, 2024"
    }
  ];

  const mockAchievements = [
    {
      text: "You've completed 5 consecutive coaching sessions without missing any.",
      category: "achievement" as const,
      date: "Aug 12, 2024"
    },
    {
      text: "Major breakthrough: You successfully managed your anxiety during a high-stakes presentation.",
      category: "breakthrough" as const,
      date: "Aug 8, 2024"
    },
    {
      text: "You've reported improved sleep quality for 2 weeks straight.",
      category: "achievement" as const,
      date: "Aug 1, 2024"
    }
  ];

  const mockTimelineEvents = [
    {
      date: "July 15, 2024",
      title: "First coaching call completed",
      description: "Established baseline and set initial goals",
      type: "milestone" as const,
      details: "During this call, we discussed your current stress levels and identified key triggers. We agreed to focus on developing three specific coping mechanisms over the next month."
    },
    {
      date: "July 22, 2024",
      title: "Started daily mindfulness practice",
      description: "Committed to 5 minutes of mindfulness each morning",
      type: "achievement" as const,
      source: "call" as const,
      details: "You reported successfully integrating a 5-minute mindfulness practice into your morning routine for 7 consecutive days. This is helping you start the day with more focus and less anxiety."
    },
    {
      date: "July 29, 2024",
      title: "Missed scheduled call",
      description: "Due to unexpected work emergency",
      type: "alert" as const
    },
    {
      date: "August 5, 2024",
      title: "Identified core stress trigger",
      description: "Discovered key pattern related to work meetings and deadlines",
      type: "breakthrough" as const,
      source: "call" as const,
      details: "During our session, you had a significant breakthrough when you realized that your stress is primarily triggered by uncertainty around project deadlines rather than the workload itself. This insight allows us to develop much more targeted coping strategies.",
      impact: "high" as const
    },
    {
      date: "August 12, 2024",
      title: "Implemented new stress management technique",
      description: "Started using the 4-7-8 breathing method during work",
      type: "achievement" as const,
      source: "call" as const,
      details: "You've successfully incorporated the 4-7-8 breathing technique during stressful work situations. You reported using it 3-4 times daily with positive results."
    },
    {
      date: "August 19, 2024",
      title: "Connected childhood pattern to current anxiety",
      description: "Identified how past experiences shape current responses",
      type: "breakthrough" as const,
      source: "whatsapp" as const,
      details: "In your WhatsApp message, you shared a powerful insight about how your perfectionism stems from childhood experiences. This awareness is helping you be more compassionate with yourself when you feel anxious about performance.",
      impact: "high" as const
    },
    {
      date: "August 25, 2024",
      title: "Completed first phase of anxiety management program",
      description: "Successfully finished all modules in phase one",
      type: "milestone" as const,
      source: "call" as const,
      details: "You've completed all the foundational modules of the anxiety management program, demonstrating consistent engagement and progress. This completion marks a significant step in your journey.",
      impact: "high" as const
    }
  ];

  const mockKeywords = [
    { text: "Mindfulness", value: 10 },
    { text: "Stress", value: 8 },
    { text: "Anxiety", value: 7 },
    { text: "Sleep", value: 9 },
    { text: "Exercise", value: 6 },
    { text: "Work-life balance", value: 8 },
    { text: "Gratitude", value: 5 },
    { text: "Focus", value: 7 },
    { text: "Breathing", value: 9 },
    { text: "Meditation", value: 8 },
    { text: "Goals", value: 6 },
    { text: "Progress", value: 7 },
    { text: "Routine", value: 5 },
    { text: "Habits", value: 8 },
    { text: "Self-care", value: 7 }
  ];

  const toggleCallDetails = (callId: string) => {
    setOpenCallId(openCallId === callId ? null : callId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Progress Journey</h1>
          <p className="text-muted-foreground mt-2">
            Track your growth, achievements, and insights from your coaching journey
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Call History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ProgressOverview 
              completedCalls={completedCalls}
              totalCalls={totalCalls}
              milestonesAchieved={mockMilestonesAchieved}
              totalMilestones={mockTotalMilestones}
              objectivesProgress={mockObjectivesProgress}
            />
            
            <AchievementTimeline />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="mb-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    Key Moments
                  </CardTitle>
                  <CardDescription>
                    Significant breakthroughs and milestones in your coaching journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {achievementsLoading ? (
                    <div className="text-center py-4">Loading achievements...</div>
                  ) : userAchievements && userAchievements.length > 0 ? (
                    <ScrollArea className="h-[350px] pr-4">
                      <div className="space-y-4">
                        {userAchievements
                          .filter(achievement => achievement.type === 'breakthrough' || achievement.type === 'milestone')
                          .map((achievement, index) => (
                            <div 
                              key={index} 
                              className={`border-l-2 pl-4 py-2 hover:bg-muted/50 rounded-r-md transition-colors ${
                                achievement.type === 'breakthrough' ? 'border-purple-500' : 
                                achievement.type === 'milestone' ? 'border-orange-500' : 
                                'border-green-500'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${
                                  achievement.type === 'breakthrough' ? 'text-purple-500' : 
                                  achievement.type === 'milestone' ? 'text-orange-500' : 
                                  'text-green-500'
                                }`}>
                                  {new Date(achievement.achievement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <Badge variant="outline" className={`text-xs py-0 h-5 ${
                                  achievement.type === 'breakthrough' ? 'bg-purple-100 border-purple-200 text-purple-700' : 
                                  achievement.type === 'milestone' ? 'bg-orange-100 border-orange-200 text-orange-700' : 
                                  'bg-green-100 border-green-200 text-green-700'
                                }`}>
                                  {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                                </Badge>
                              </div>
                              <h3 className="text-base font-medium">
                                {achievement.type === 'breakthrough' ? 'Breakthrough: ' : 
                                 achievement.type === 'milestone' ? 'Milestone: ' : ''}
                                {achievement.description}
                              </h3>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No breakthroughs or milestones recorded yet. Your key moments will be tracked here as you go through your coaching journey.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <KeywordCloud 
                title="Focus Areas" 
                description="Topics frequently discussed in your coaching sessions"
                keywords={mockKeywords}
              />
            </div>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Call History</CardTitle>
                <CardDescription>
                  Review your coaching call history and access summaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {callLogsLoading ? (
                  <div className="text-center py-4">Loading call history...</div>
                ) : callLogs && callLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Summary</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {callLogs.map((call) => (
                        <React.Fragment key={call.id}>
                          <TableRow>
                            <TableCell>{new Date(call.created_at || "").toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                call.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                call.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              }`}>
                                {call.status || 'Pending'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {call.call_summary ? 
                                (call.call_summary.length > 60 ? 
                                  `${call.call_summary.substring(0, 60)}...` : 
                                  call.call_summary) : 
                                'No summary available'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleCallDetails(call.id)}
                                className="h-8 gap-1"
                              >
                                {openCallId === call.id ? 'Hide' : 'View'} 
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow className={openCallId === call.id ? '' : 'hidden'}>
                            <TableCell colSpan={4} className="p-0">
                              <Collapsible open={openCallId === call.id}>
                                <CollapsibleContent className="pb-4 px-4">
                                  <div className="mt-2 rounded-md border p-4 bg-muted/50">
                                    <h4 className="font-medium mb-2">Call Summary</h4>
                                    <p className="text-sm mb-4">{call.call_summary || 'No summary available'}</p>
                                    
                                    {call.call_transcript && (
                                      <>
                                        <h4 className="font-medium mb-2">Call Transcript</h4>
                                        <div className="max-h-40 overflow-y-auto text-sm bg-background p-3 rounded border">
                                          {call.call_transcript}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No call history available. Your completed coaching calls will appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;
