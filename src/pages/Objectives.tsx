
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type FormValues = {
  custom_instructions: string;
};

const Objectives = () => {
  const { session, loading, userProfile } = useSessionContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      custom_instructions: '',
    },
  });

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Fetch user's custom instructions from mode preferences
  useEffect(() => {
    const fetchCustomInstructions = async () => {
      if (session?.user && userProfile?.current_mode_id) {
        try {
          const { data, error } = await supabase
            .from('mode_preferences')
            .select('custom_instructions')
            .eq('user_id', session.user.id)
            .eq('mode_id', userProfile.current_mode_id)
            .single();
          
          if (error) {
            console.error('Error fetching custom instructions:', error);
            return;
          }
          
          if (data && data.custom_instructions) {
            form.setValue('custom_instructions', data.custom_instructions);
          }
        } catch (error) {
          console.error('Error fetching custom instructions:', error);
        }
      }
    };

    fetchCustomInstructions();
  }, [session, userProfile, form]);

  const onSubmit = async (data: FormValues) => {
    if (!session?.user || !userProfile?.current_mode_id) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('mode_preferences')
        .update({ custom_instructions: data.custom_instructions })
        .eq('user_id', session.user.id)
        .eq('mode_id', userProfile.current_mode_id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Instructions saved',
        description: 'Your custom instructions have been updated successfully.',
      });
      
    } catch (error) {
      console.error('Error saving custom instructions:', error);
      toast({
        title: 'Failed to save',
        description: 'There was an error saving your instructions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile?.current_mode_id) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
              You need to select a coaching mode before setting your objectives. Please complete the onboarding process.
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Set Your Coaching Objectives</h1>
          <p className="text-gray-500 mb-6">Tell us what you want to focus on and improve in your coaching sessions</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="custom_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What would you like to focus on?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you want to work on, your goals, challenges you're facing, or areas where you'd like to improve..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Objectives'}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Objectives;
