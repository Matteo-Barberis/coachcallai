
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import ScheduleCall from '@/components/ScheduleCall';

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
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Schedule Your Coaching Calls</h1>
          <p className="text-gray-500 mb-6">Set up regular coaching sessions with shared or custom goals for each session</p>
          <ScheduleCall />
        </div>
      </main>
    </div>
  );
};

export default Schedule;
