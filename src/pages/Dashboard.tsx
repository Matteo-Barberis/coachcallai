
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import CoachInterface from '@/components/CoachInterface';

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
              <p className="text-gray-600 mb-6">
                Welcome to your Coach Call AI dashboard! This is where you'll interact with your AI coach and track your progress.
              </p>
              <CoachInterface />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Calls</h2>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-500 text-sm italic">
                  No upcoming calls scheduled. Use the coaching interface to set up your next check-in.
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Goal Tracker</h2>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-500 text-sm italic">
                  No goals set yet. Chat with your coach to establish goals and milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
