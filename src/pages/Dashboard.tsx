
import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { CalendarDays, Target, MessageCircle, BarChart2, HelpCircle, AlertCircle } from "lucide-react";
import CoachSelect from '@/components/CoachSelect';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { session, loading, userProfile } = useSessionContext();
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isCallingDemo, setIsCallingDemo] = useState(false);
  const [lastDemoCallAt, setLastDemoCallAt] = useState<string | null>(null);
  const { toast } = useToast();

  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!session?.user.id) return;
      
      try {
        console.log('Checking onboarding status...');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_onboarding, last_demo_call_at')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Could not fetch your profile data.',
            variant: 'destructive',
          });
        } else {
          console.log('Profile data:', data);
          
          if (data.is_onboarding === true) {
            console.log('User is in onboarding, navigating...');
            navigate('/onboarding');
          }
          
          if (data.last_demo_call_at) {
            setLastDemoCallAt(data.last_demo_call_at);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    if (session?.user.id) {
      checkOnboardingStatus();
    } else {
      setIsCheckingProfile(false);
    }
  }, [session, navigate, toast]);

  const getDaysRemaining = () => {
    if (!userProfile?.trial_start_date) return 0;
    
    const trialStartDate = new Date(userProfile.trial_start_date);
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7); // Changed to 7-day trial
    
    const today = new Date();
    const daysRemaining = Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysRemaining);
  };

  const handleTestCall = async () => {
    if (!session?.user.id) return;
    
    setIsCallingDemo(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('update-last-demo-call', {
        body: { userId: session.user.id }
      });
      
      if (error) {
        throw error;
      }
      
      setLastDemoCallAt(new Date().toISOString());
      
      toast({
        title: "Test Call Initiated",
        description: "Your test call has been successfully set up!",
      });
    } catch (error) {
      console.error('Error initiating test call:', error);
      toast({
        title: "Error",
        description: "Could not initiate test call. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCallingDemo(false);
    }
  };

  const isTestCallAvailable = () => {
    if (!lastDemoCallAt) return true;
    
    const lastCallDate = new Date(lastDemoCallAt);
    const now = new Date();
    const hoursDifference = (now.getTime() - lastCallDate.getTime()) / (1000 * 60 * 60);
    
    return hoursDifference >= 24;
  };
  
  const getTestCallTooltip = () => {
    if (!lastDemoCallAt) return null;
    
    if (!isTestCallAvailable()) {
      const lastCallDate = new Date(lastDemoCallAt);
      const now = new Date();
      const hoursPassed = Math.floor((now.getTime() - lastCallDate.getTime()) / (1000 * 60 * 60));
      const hoursRemaining = 24 - hoursPassed;
      
      return `You can try another test call in ${hoursRemaining} hours. Test calls are limited to one every 24 hours.`;
    }
    
    return null;
  };

  const handleUpgradeClick = () => {
    navigate('/account');
  };

  if (loading || isCheckingProfile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {userProfile?.subscription_status === 'trial' && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-1" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {getDaysRemaining() > 0 
                  ? `You are using a free trial. Your free trial will last ${getDaysRemaining()} more days.` 
                  : "Your trial has ended. Set up a subscription to continue using all features."}
              </span>
              <Button size="sm" onClick={handleUpgradeClick}>
                Upgrade Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center flex-wrap gap-2">
              <CoachSelect />
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button 
                        onClick={handleTestCall}
                        disabled={isCallingDemo || !isTestCallAvailable()}
                        size="sm"
                        className={`flex items-center gap-1 ${!isTestCallAvailable() ? 'opacity-70' : ''}`}
                      >
                        {isCallingDemo ? "Setting up..." : "Try Test Call"}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!isTestCallAvailable() && (
                    <TooltipContent>
                      <p>{getTestCallTooltip()}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Info about test calls</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">
                      This is a test call to verify everything is working correctly. 
                      The call won't last longer than 30 seconds. For a proper coaching 
                      session, please schedule a call from the Schedule section.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Set Your Objectives</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Define what you want to achieve with your coaching sessions to get personalized guidance.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/objectives" className="flex items-center gap-2">
                    <Target className="h-4 w-4" /> 
                    Set Objectives
                  </Link>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Schedule Your Coaching Calls</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Set up regular coaching calls that fit your schedule, or schedule calls for specific dates.
                </p>
                <Button asChild>
                  <Link to="/schedule" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> 
                    Schedule Calls
                  </Link>
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">Connect to WhatsApp</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Link your WhatsApp account to receive coaching checkins and chat with your coach.
                </p>
                <Button className="bg-[#25D366] hover:bg-[#128C7E]" asChild>
                  <Link to="/connect-whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Connect WhatsApp
                  </Link>
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">See Your Progress</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Track your growth and achievements over time with personalized analytics.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/progress" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    View Progress
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
