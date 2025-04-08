
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
  view: 'sign-in' | 'sign-up' | 'reset-password';
};

const AuthForm = ({ view }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (view === 'reset-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });

        if (error) throw error;

        setResetSent(true);
        toast({
          title: "Reset link sent",
          description: "Check your email for a password reset link. Be sure to check your spam/junk folder if you don't see it.",
        });
        return;
      } else if (view === 'sign-up') {
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

        // Updated success message to notify about email verification and checking spam folder
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account. If you don't see it, be sure to check your spam/junk folder.",
        });
        
        // Redirect to dashboard instead of sign-in page
        navigate('/dashboard');
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Updated error message for unverified email during sign-in
          if (error.message.includes('Email not confirmed')) {
            setError("Please confirm your email before signing in. An email has been sent to your inbox. Remember to check your spam/junk folder if you can't find it.");
            return;
          }
          throw error;
        }
        
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

  // Render password reset form
  if (view === 'reset-password') {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetSent ? (
          <div className="text-center space-y-4">
            <div className="p-3 bg-green-50 text-green-700 rounded-md">
              Reset link sent! Please check your email (including spam folder).
            </div>
            <Button 
              onClick={() => navigate('/auth/sign-in')}
              variant="outline"
              className="mt-2"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
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

            <Button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary/90"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Send Reset Link'}
            </Button>

            <div className="text-center text-sm">
              <a 
                href="/auth/sign-in" 
                className="text-brand-primary hover:underline font-medium"
              >
                Back to Sign In
              </a>
            </div>
          </form>
        )}
      </div>
    );
  }

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
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {view === 'sign-in' && (
              <a 
                href="/auth/reset-password" 
                className="text-xs text-brand-primary hover:underline"
              >
                Forgot password?
              </a>
            )}
          </div>
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
