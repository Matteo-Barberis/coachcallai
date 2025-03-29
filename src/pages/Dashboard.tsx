
import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { CalendarDays, Target, MessageCircle, BarChart2, HelpCircle, Phone } from "lucide-react";
import CoachSelect from '@/components/CoachSelect';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Dashboard = () => {
  const { session, loading } = useSessionContext();
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [isCallingDemo, setIsCallingDemo] = useState(false);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user is still in onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!session?.user.id) return;
      
      try {
        console.log('Checking onboarding status...');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_onboarding')
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

  // Function to trigger the demo call
  const handleDemoCall = async () => {
    if (!session?.user.id) return;
    
    try {
      setIsCallingDemo(true);
      
      console.log("Initiating demo call for user:", session.user.id);
      
      const response = await supabase.functions.invoke('update-last-demo-call', {
        body: { user_id: session.user.id }
      });
      
      console.log("Edge function response:", response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to initiate demo call');
      }
      
      toast({
        title: 'Demo Call Initiated',
        description: 'You should receive a test call within 30 seconds.',
      });
    } catch (error) {
      console.error('Error initiating demo call:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate the demo call. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCallingDemo(false);
    }
  };

  // Show loading while checking profile status
  if (loading || isCheckingProfile) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <CoachSelect />
          </div>
          
          <div className="mt-2 mb-6">
            <TooltipProvider>
              <div className="flex items-center">
                <Button 
                  onClick={handleDemoCall}
                  disabled={isCallingDemo}
                  className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90"
                >
                  <Phone className="h-4 w-4" /> 
                  {isCallingDemo ? 'Initiating Test Call...' : 'Try Test Call'}
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 ml-2 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>This will initiate a test call that lasts no more than 30 seconds to verify your integration is working correctly.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
          
          <p className="text-gray-600 mb-6">
            Welcome to your Coach Call AI dashboard! This is where you'll manage your coaching sessions and review analytics.
          </p>
          
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Get Started</h2>
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
