
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import Header from '@/components/Header';

const Objectives = () => {
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
          <h1 className="text-2xl font-bold mb-2">Set Your Objectives</h1>
          <p className="text-gray-500 mb-6">Define what you want to achieve with your coaching sessions</p>
          {/* Placeholder for objectives content */}
          <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            Objectives setting form will be added here
          </div>
        </div>
      </main>
    </div>
  );
};

export default Objectives;
