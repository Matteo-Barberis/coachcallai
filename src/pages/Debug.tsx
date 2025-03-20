
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ScheduledCall {
  id: string;
  user_id: string;
  time: string;
  weekday: number | null;
  specific_date: string | null;
  template_id: string | null;
  timezone: string;
  execution_timestamp: string;
  profile_id: string;
  avatar_url: string | null;
  created_at: string;
  full_name: string | null;
  objectives: string | null;
  phone: string | null;
  phone_verification_code: string | null;
  phone_verification_expires_at: string | null;
  phone_verified: boolean | null;
  updated_at: string;
}

const Debug = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['scheduledCalls'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-scheduled-calls');
        
        if (error) {
          throw new Error(error.message);
        }

        console.log('Edge function response:', data);
        return data;
      } catch (err) {
        console.error('Error fetching scheduled calls:', err);
        throw err;
      }
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: 'Data refreshed',
        description: 'The scheduled calls data has been refreshed.',
      });
    } catch (err) {
      toast({
        title: 'Error refreshing data',
        description: 'There was an error refreshing the data.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format the date/time for display
  const formatDateTime = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    return time.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const getWeekdayName = (day: number | null) => {
    if (day === null) return 'N/A';
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[day];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Debug: Scheduled Calls</h1>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh Data
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading scheduled calls...</span>
            </div>
          ) : error ? (
            <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
              <p className="font-medium">Error fetching data</p>
              <p className="text-sm">{(error as Error).message}</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Raw response from edge function:
                </p>
                <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto text-xs">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Formatted Results</h2>
                {data?.data && data.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">User</th>
                          <th className="p-2 text-left">Schedule</th>
                          <th className="p-2 text-left">Time</th>
                          <th className="p-2 text-left">Execution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((call: ScheduledCall) => (
                          <tr key={call.id} className="border-t border-gray-200">
                            <td className="p-2 text-sm text-gray-800">{call.id.substring(0, 8)}...</td>
                            <td className="p-2 text-sm">
                              <div className="font-medium">{call.full_name || 'Anonymous'}</div>
                              <div className="text-xs text-gray-500">{call.timezone}</div>
                            </td>
                            <td className="p-2 text-sm">
                              {call.specific_date ? (
                                <span>One-time: {new Date(call.specific_date).toLocaleDateString()}</span>
                              ) : (
                                <span>Weekly: {getWeekdayName(call.weekday)}</span>
                              )}
                            </td>
                            <td className="p-2 text-sm">{formatTime(call.time)}</td>
                            <td className="p-2 text-sm">{formatDateTime(call.execution_timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 py-4">No scheduled calls found in the time window (-10 min to +10 min from now).</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Debug;
