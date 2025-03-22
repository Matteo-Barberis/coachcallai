
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
import { CalendarDays, Sparkles, FileBarChart, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import type { CallLog } from '@/types/supabase';

const Progress = () => {
  const { session, loading } = useSessionContext();
  const [openCallId, setOpenCallId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Fetch call logs for the user
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

  // Mock data for demonstration purposes
  const mockCompletedCalls = callLogs?.length || 0;
  const mockTotalCalls = 12;
  const mockMilestonesAchieved = 4;
  const mockTotalMilestones = 10;
  const mockObjectivesProgress = 65;

  const mockInsights = [
    "Your consistency in attending calls has improved by 20% over the last month.",
    "You've made significant progress in practicing mindfulness techniques daily.",
    "Your stress levels have decreased noticeably according to your self-reporting.",
    "Try to incorporate more breathing exercises before stressful meetings."
  ];

  const mockAchievements = [
    "You've completed 5 consecutive coaching sessions without missing any.",
    "You've reported improved sleep quality for 2 weeks straight.",
    "You've successfully implemented 3 new stress management techniques."
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
      title: "Reported reduced anxiety levels",
      description: "First measurable improvement in well-being metrics",
      type: "achievement" as const,
      source: "whatsapp" as const,
      details: "In your WhatsApp check-in, you reported a noticeable reduction in anxiety during work meetings. Your self-reported anxiety score dropped from 7/10 to 5/10."
    },
    {
      date: "August 12, 2024",
      title: "Implemented new stress management technique",
      description: "Started using the 4-7-8 breathing method during work",
      type: "achievement" as const,
      source: "call" as const,
      details: "You've successfully incorporated the 4-7-8 breathing technique during stressful work situations. You reported using it 3-4 times daily with positive results."
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
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Call History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ProgressOverview 
              completedCalls={mockCompletedCalls}
              totalCalls={mockTotalCalls}
              milestonesAchieved={mockMilestonesAchieved}
              totalMilestones={mockTotalMilestones}
              objectivesProgress={mockObjectivesProgress}
            />
            
            <CallTimeline 
              calls={callLogs || []}
              title="Call Completion Timeline"
              description="View your coaching call history and completion status"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InsightCard 
                title="Key Insights" 
                description="Personalized observations from your coach"
                insights={mockInsights}
              />
              <KeywordCloud 
                title="Focus Areas" 
                description="Topics frequently discussed in your coaching sessions"
                keywords={mockKeywords}
              />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsightCard 
                title="Key Achievements" 
                description="Significant milestones you've reached during your coaching journey"
                insights={mockAchievements}
                type="achievement"
              />
              
              <KeywordCloud 
                title="Growth Areas" 
                description="Topics where you've shown the most improvement"
                keywords={mockKeywords.slice(0, 8)}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>
                  Actionable insights based on your coaching sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">Strengths to Leverage</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 list-disc">
                    <li>Consistent practice of mindfulness techniques</li>
                    <li>Excellent follow-through on action items</li>
                    <li>Openness to trying new approaches</li>
                    <li>Self-awareness of triggers and patterns</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">Opportunities for Growth</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6 list-disc">
                    <li>Implementing boundaries in work situations</li>
                    <li>Practicing self-compassion during setbacks</li>
                    <li>Consistent evening wind-down routine</li>
                    <li>Prioritizing recovery after high-stress periods</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <ProgressTimeline events={mockTimelineEvents} />
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
