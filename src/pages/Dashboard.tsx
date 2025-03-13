
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/schedule" className="flex items-center gap-2">
                <CalendarPlus className="h-5 w-5" />
                Schedule a Call
              </Link>
            </Button>
          </div>
          <p className="text-gray-600">
            Welcome to your Coach Call AI dashboard! This is where you'll manage your coaching sessions and review analytics.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
