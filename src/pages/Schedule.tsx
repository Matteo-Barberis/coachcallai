
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import ScheduleCall from '@/components/ScheduleCall';
import { Button } from '@/components/ui/button';
import { BugIcon } from 'lucide-react';

const Schedule = () => {
  const { session, loading } = useSessionContext();

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Schedule Your Coaching Calls</h1>
            <Link to="/debug">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BugIcon className="h-4 w-4" />
                Debug Calls
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-500 mb-6">Set up regular coaching sessions or schedule one-time calls using our predefined templates</p>
            <ScheduleCall />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;
