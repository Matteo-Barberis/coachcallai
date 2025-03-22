
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'alert';
}

interface ProgressTimelineProps {
  events: TimelineEvent[];
}

const ProgressTimeline = ({ events }: ProgressTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Your Progress Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border bg-background">
                  {event.type === 'achievement' && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                  {event.type === 'milestone' && <Clock className="h-3.5 w-3.5 text-secondary" />}
                  {event.type === 'alert' && <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                
                {/* Event content */}
                <div>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <h3 className="text-base font-medium leading-tight">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTimeline;
