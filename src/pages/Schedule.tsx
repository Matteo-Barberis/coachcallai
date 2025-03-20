
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ScheduleCall from '@/components/ScheduleCall';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Schedule = () => {
  const { session, loading } = useSessionContext();
  const { toast } = useToast();
  const [upcomingCalls, setUpcomingCalls] = useState<any[]>([]);
  const [fetchingCalls, setFetchingCalls] = useState(false);

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Fetch upcoming calls that are scheduled to be executed soon
  const fetchUpcomingCalls = async () => {
    try {
      setFetchingCalls(true);
      
      const { data, error } = await supabase.functions.invoke('get-scheduled-calls', {
        method: 'GET',
      });
      
      if (error) {
        console.error('Error fetching upcoming calls:', error);
        toast({
          title: "Error",
          description: "Could not fetch upcoming calls. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Upcoming calls data:', data);
      
      if (data && data.data) {
        setUpcomingCalls(data.data);
      }
    } catch (error) {
      console.error('Unexpected error fetching upcoming calls:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setFetchingCalls(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUpcomingCalls();
    }
  }, [session]);

  // Format date and time for display
  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return timestamp;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold mb-2">Schedule Your Coaching Calls</h1>
          <p className="text-gray-500 mb-6">Set up regular coaching sessions or schedule one-time calls using our predefined templates</p>
          <ScheduleCall />
        </div>

        {session && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Calls in the Next 10 Minutes</h2>
            
            <div className="mb-2">
              <button 
                onClick={fetchUpcomingCalls}
                className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded flex items-center"
                disabled={fetchingCalls}
              >
                {fetchingCalls ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : 'Refresh'}
              </button>
            </div>
            
            {fetchingCalls ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : upcomingCalls.length > 0 ? (
              <div className="space-y-4">
                {upcomingCalls.map((call) => (
                  <div key={call.id} className="border p-4 rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Schedule Type:</p>
                        <p>{call.specific_date ? 'Specific Date' : 'Weekly'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Execution Time:</p>
                        <p>{formatDateTime(call.execution_timestamp)}</p>
                      </div>
                      
                      {call.weekday !== null && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Day:</p>
                          <p>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][call.weekday]}</p>
                        </div>
                      )}
                      
                      {call.specific_date && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date:</p>
                          <p>{call.specific_date}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Time:</p>
                        <p>{call.time}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">User:</p>
                        <p>{call.full_name || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Timezone:</p>
                        <p>{call.timezone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No upcoming calls in the next 10 minutes.</p>
                <p className="text-sm mt-2">Scheduled calls will appear here when they're about to be executed.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedule;
