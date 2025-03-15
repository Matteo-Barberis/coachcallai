
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
  objectives: string;
};

const Objectives = () => {
  const { session, loading } = useSessionContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      objectives: '',
    },
  });

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Fetch user's objectives
  useEffect(() => {
    const fetchObjectives = async () => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('objectives')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching objectives:', error);
            return;
          }
          
          if (data && data.objectives) {
            form.setValue('objectives', data.objectives);
          }
        } catch (error) {
          console.error('Error fetching objectives:', error);
        }
      }
    };

    fetchObjectives();
  }, [session, form]);

  const onSubmit = async (data: FormValues) => {
    if (!session?.user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ objectives: data.objectives })
        .eq('id', session.user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Objectives saved',
        description: 'Your coaching objectives have been updated successfully.',
      });
      
    } catch (error) {
      console.error('Error saving objectives:', error);
      toast({
        title: 'Failed to save',
        description: 'There was an error saving your objectives. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Set Your Objectives</h1>
          <p className="text-gray-500 mb-6">Define what you want to achieve with your coaching sessions</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Objectives</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List the goals you want to achieve through coaching..."
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
