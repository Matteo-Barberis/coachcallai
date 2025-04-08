
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useSessionContext } from '@/context/SessionContext';

const Auth = () => {
  const { view } = useParams<{ view: string }>();
  const { session } = useSessionContext();

  // Redirect to home if already authenticated
  if (session) {
    return <Navigate to="/" replace />;
  }

  // Validate view param
  const validView = view === 'sign-in' || view === 'sign-up' || view === 'reset-password' 
    ? view 
    : 'sign-in';

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-2xl text-gray-900">Coach Call AI</span>
        </div>
      </div>
      
      <AuthForm view={validView as 'sign-in' | 'sign-up' | 'reset-password'} />
    </div>
  );
};

export default Auth;
