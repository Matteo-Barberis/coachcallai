
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type Profile = {
  id: string;
  subscription_status?: string;
  trial_start_date?: string;
  subscription_end_date?: string;
  subscription_plan_id?: string;
  // Other profile fields can be added here as needed
};

type SessionContextType = {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: Profile | null;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  signOut: async () => {},
  userProfile: null,
});

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the URL contains the confirmation token
    const urlParams = new URLSearchParams(window.location.search);
    const hasConfirmToken = urlParams.get('type') === 'email_confirmation';
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      // If we have a session and confirmation token in URL, this is an automatic login
      if (session && hasConfirmToken && window.location.pathname === '/') {
        // Redirect to dashboard or onboarding as needed
        navigate('/dashboard', { replace: true });
      }
      
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      // Handle automatic sign-in from email confirmation
      if (event === 'SIGNED_IN' && hasConfirmToken && window.location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
      
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, subscription_status, trial_start_date, subscription_end_date, subscription_plan_id')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SessionContext.Provider value={{ session, loading, signOut, userProfile }}>
      {children}
    </SessionContext.Provider>
  );
};
