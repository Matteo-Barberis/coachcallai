
import React, { useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { CalendarDays, Target, MessageCircle, BarChart2 } from "lucide-react";
import CoachSelect from '@/components/CoachSelect';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { session, loading } = useSessionContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user is still in onboarding
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_onboarding')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session,
    staleTime: 0, // Force a new fetch on every render
    refetchOnWindowFocus: true // Refetch when window regains focus
  });

  // Redirect to onboarding if is_onboarding is true
  useEffect(() => {
    if (!profileLoading && profileData?.is_onboarding === true) {
      navigate('/onboarding');
    }
  }, [profileData, profileLoading, navigate]);

  // Show loading while checking profile status
  if (loading || profileLoading) {
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
                  Link your WhatsApp account to receive coaching session reminders and quick updates.
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
