import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type AuthFormProps = {
  view: 'sign-in' | 'sign-up';
};

const AuthForm = ({ view }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'sign-up') {
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        // Check specifically for repeated signup (email already exists)
        // Supabase returns a 200 status for duplicate emails but with specific data patterns
        const isRepeatedSignup = !error && (!authData?.user?.id || authData?.user?.identities?.length === 0);
        
        if (isRepeatedSignup) {
          setError("This email is already registered. Please sign in instead.");
          toast({
            title: "Email already in use",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
          return;
        }

        if (error) throw error;

        // Changed success message to notify about email verification
        toast({
          title: "Account created successfully!",
          description: "Please check your email and verify your account before proceeding.",
        });
        
        // Redirect to dashboard instead of sign-in page
        navigate('/dashboard');
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // Changed from '/' to '/dashboard' to redirect to dashboard after sign-in
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {view === 'sign-in' ? 'Sign In' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {view === 'sign-in'
            ? 'Enter your credentials to access your account'
            : 'Fill out the form to create your account'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {view === 'sign-up' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          disabled={loading}
        >
          {loading ? 'Processing...' : view === 'sign-in' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>

      <div className="text-center text-sm">
        {view === 'sign-in' ? (
          <p>
            Don't have an account?{' '}
            <a 
              href="/auth/sign-up" 
              className="text-brand-primary hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a 
              href="/auth/sign-in" 
              className="text-brand-primary hover:underline font-medium"
            >
              Sign In
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
