
import React, { useState, useEffect } from 'react';
import { useSessionContext } from '@/context/SessionContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScheduledCall = {
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
  vapiCallPayload: any | null;
  vapiCallResult: any | null;
  vapiCallError: string | null;
};

const Debug = () => {
  const { session, loading } = useSessionContext();
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  const fetchScheduledCalls = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-scheduled-calls');
      
      if (error) {
        console.error('Error fetching scheduled calls:', error);
        setError(error.message);
        toast({
          title: 'Error',
          description: `Failed to fetch scheduled calls: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        console.log('Scheduled calls data:', data);
        setCalls(data.data || []);
        toast({
          title: 'Success',
          description: `Retrieved ${data.data?.length || 0} scheduled calls`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Unexpected error fetching scheduled calls:', err);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to fetch scheduled calls: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchScheduledCalls();
    }
  }, [session]);

  // Redirect to login if not authenticated
  if (!loading && !session) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleCallExpansion = (id: string) => {
    setExpandedCall(expandedCall === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Debug: Scheduled Calls</h1>
            <Button 
              onClick={fetchScheduledCalls} 
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Timezone</TableHead>
                  <TableHead>Execution Time</TableHead>
                  <TableHead>API Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {isLoading ? 'Loading scheduled calls...' : 'No scheduled calls found in the time window.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  calls.map((call) => (
                    <React.Fragment key={call.id}>
                      <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleCallExpansion(call.id)}>
                        <TableCell>
                          {expandedCall === call.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell>{call.full_name || 'Unknown'}</TableCell>
                        <TableCell>{call.time}</TableCell>
                        <TableCell>
                          {call.weekday !== null 
                            ? weekdayNames[call.weekday] 
                            : 'One-time'}
                        </TableCell>
                        <TableCell>
                          {call.specific_date 
                            ? new Date(call.specific_date).toLocaleDateString() 
                            : 'Recurring'}
                        </TableCell>
                        <TableCell>{call.timezone}</TableCell>
                        <TableCell>{formatDate(call.execution_timestamp)}</TableCell>
                        <TableCell>
                          {call.vapiCallResult ? (
                            <span className="text-green-600 font-medium">Completed</span>
                          ) : call.vapiCallError ? (
                            <span className="text-red-600 font-medium">Error</span>
                          ) : (
                            <span className="text-gray-500">Not Called</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedCall === call.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="p-0 border-t-0">
                            <div className="p-4 bg-gray-50">
                              <Tabs defaultValue="response" className="w-full">
                                <TabsList>
                                  <TabsTrigger value="response">API Response</TabsTrigger>
                                  <TabsTrigger value="request">API Request</TabsTrigger>
                                </TabsList>
                                <TabsContent value="response">
                                  <h3 className="text-lg font-medium mb-2">API Response Details</h3>
                                  {call.vapiCallResult ? (
                                    <div>
                                      <Card className="p-4 bg-white overflow-x-auto">
                                        <pre className="text-xs whitespace-pre-wrap">
                                          {JSON.stringify(call.vapiCallResult, null, 2)}
                                        </pre>
                                      </Card>
                                    </div>
                                  ) : call.vapiCallError ? (
                                    <div className="text-red-600">
                                      <p>Error: {call.vapiCallError}</p>
                                    </div>
                                  ) : (
                                    <p className="text-gray-500">No API call was made for this scheduled call.</p>
                                  )}
                                </TabsContent>
                                <TabsContent value="request">
                                  <h3 className="text-lg font-medium mb-2">API Request Payload</h3>
                                  {call.vapiCallPayload ? (
                                    <div>
                                      <Card className="p-4 bg-white overflow-x-auto">
                                        <pre className="text-xs whitespace-pre-wrap">
                                          {JSON.stringify(call.vapiCallPayload, null, 2)}
                                        </pre>
                                      </Card>
                                    </div>
                                  ) : (
                                    <p className="text-gray-500">No API request payload available.</p>
                                  )}
                                </TabsContent>
                              </Tabs>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>This page displays scheduled calls that are due to be executed within the next 10 minutes.</p>
            <p>Current server time: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Debug;
