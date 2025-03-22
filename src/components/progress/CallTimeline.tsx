
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar, Clock, CheckCircle, XCircle, Phone } from "lucide-react";
import type { CallLog } from '@/types/supabase';

interface CallTimelineProps {
  calls: CallLog[];
  title?: string;
  description?: string;
}

type TimeRange = 'week' | 'month' | 'year';

const CallTimeline = ({ calls, title = "Call Timeline", description = "Track your coaching session completion" }: CallTimelineProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  // Get dates for the selected time range
  const getDateRange = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    let daysToShow = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.unshift(date); // Add to beginning to show oldest first
    }
    
    return dates;
  };
  
  // Group calls by date
  const groupCallsByDate = () => {
    const dateRange = getDateRange();
    const groupedCalls = new Map<string, CallLog[]>();
    
    // Initialize all dates in our range with empty arrays
    dateRange.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      groupedCalls.set(dateStr, []);
    });
    
    // Add calls to their respective dates
    calls.forEach(call => {
      if (!call.created_at) return;
      
      const callDate = new Date(call.created_at);
      const dateStr = callDate.toISOString().split('T')[0];
      
      if (groupedCalls.has(dateStr)) {
        groupedCalls.get(dateStr)?.push(call);
      }
    });
    
    return { dateRange, groupedCalls };
  };
  
  const { dateRange, groupedCalls } = groupCallsByDate();
  
  const getFormattedDate = (date: Date) => {
    if (timeRange === 'week') {
      return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
    } else if (timeRange === 'month') {
      return date.toLocaleDateString(undefined, { day: 'numeric' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <ToggleGroup type="single" defaultValue="week" value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <ToggleGroupItem value="week" aria-label="View weekly">
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="View monthly">
            Month
          </ToggleGroupItem>
          <ToggleGroupItem value="year" aria-label="View yearly">
            Year
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          <div 
            className="grid gap-2 items-center" 
            style={{ 
              gridTemplateColumns: `5rem repeat(${dateRange.length}, 1fr)`
            }}
          >
            {/* Left axis label */}
            <div className="text-sm font-medium text-muted-foreground">
              Sessions
            </div>
            
            {/* Date headers */}
            {dateRange.map((date, index) => (
              <div key={`date-${index}`} className="text-xs text-center text-muted-foreground">
                {getFormattedDate(date)}
              </div>
            ))}
            
            {/* Call visualization */}
            <div className="text-sm font-medium text-muted-foreground flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Calls
            </div>
            
            {dateRange.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const dateCalls = groupedCalls.get(dateStr) || [];
              const hasAtLeastOneCall = dateCalls.length > 0;
              const hasCompletedCall = dateCalls.some(call => call.status === 'completed');
              const missedCalls = dateCalls.filter(call => call.status !== 'completed');
              
              return (
                <div key={dateStr} className="flex justify-center">
                  {hasAtLeastOneCall ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div 
                          className={`h-16 w-full rounded-md ${
                            hasCompletedCall 
                              ? missedCalls.length > 0 
                                ? 'bg-gradient-to-t from-orange-200 to-green-200 dark:from-orange-950 dark:to-green-950'
                                : 'bg-green-200 dark:bg-green-950' 
                              : 'bg-orange-200 dark:bg-orange-950'
                          } flex items-center justify-center cursor-pointer`}
                        >
                          {hasCompletedCall ? (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </h4>
                          <div className="text-xs text-muted-foreground">
                            {dateCalls.length} call{dateCalls.length !== 1 ? 's' : ''} scheduled
                          </div>
                          <div className="space-y-2">
                            {dateCalls.map((call) => (
                              <div 
                                key={call.id} 
                                className={`p-2 rounded-md ${
                                  call.status === 'completed' 
                                    ? 'bg-green-100 dark:bg-green-900' 
                                    : 'bg-orange-100 dark:bg-orange-900'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {call.status === 'completed' ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  )}
                                  <span className="text-xs font-medium">
                                    {new Date(call.created_at || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                                {call.call_summary && (
                                  <p className="text-xs mt-1">{call.call_summary}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <div className="h-16 w-full rounded-md bg-muted flex items-center justify-center">
                      <Clock className="h-4 w-4 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* You could add more rows here for other metrics */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CallTimeline;
