import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useSessionContext } from '@/context/SessionContext';
const Auth = () => {
  const {
    view
  } = useParams<{
    view: string;
  }>();
  const {
    session
  } = useSessionContext();
  const location = useLocation();
  const isUpdatePasswordPath = location.pathname === '/auth/update-password';

  // Determine if this is a password update route (from email link)
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up' | 'reset-password' | 'update-password'>(isUpdatePasswordPath ? 'update-password' : view as any || 'sign-in');
  useEffect(() => {
    // Handle URL-based view changes
    if (isUpdatePasswordPath) {
      setAuthView('update-password');
    } else if (view === 'sign-in' || view === 'sign-up' || view === 'reset-password') {
      setAuthView(view);
    } else {
      setAuthView('sign-in');
    }
  }, [view, isUpdatePasswordPath]);

  // Only redirect if it's not a password reset flow
  if (session && !isUpdatePasswordPath && authView !== 'reset-password') {
    return <Navigate to="/" replace />;
  }
  return <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-2xl text-gray-900">Coach Call AI</span>
        </div>
      </div>
      
      <AuthForm view={authView as 'sign-in' | 'sign-up' | 'reset-password' | 'update-password'} />
    </div>;
};
export default Auth;