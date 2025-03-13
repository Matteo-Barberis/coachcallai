
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

const Dashboard = () => {
  const { session, loading } = useSessionContext();

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to your Coach Call AI dashboard! This is where you'll manage your coaching sessions and review analytics.
          </p>
          
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h3 className="font-medium mb-2">Your Coaching Sessions</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You don't have any upcoming coaching sessions scheduled yet.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/schedule">Set up your first call</Link>
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
