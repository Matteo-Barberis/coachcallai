
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, Award, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'alert' | 'insight' | 'goal';
  source?: 'call' | 'whatsapp' | 'manual';
  callId?: string;
}

interface ProgressTimelineProps {
  events: TimelineEvent[];
  title?: string;
  description?: string;
}

const ProgressTimeline = ({ events, title = "Your Progress Journey", description }: ProgressTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={index} className="relative pl-8 transition-all hover:translate-x-1">
                {/* Timeline dot */}
                <div className={`absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border ${
                  event.type === 'achievement' ? 'border-primary bg-primary/10' :
                  event.type === 'milestone' ? 'border-secondary bg-secondary/10' : 
                  event.type === 'alert' ? 'border-destructive bg-destructive/10' :
                  event.type === 'insight' ? 'border-blue-400 bg-blue-50' :
                  'border-amber-400 bg-amber-50'
                }`}>
                  {event.type === 'achievement' && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                  {event.type === 'milestone' && <Clock className="h-3.5 w-3.5 text-secondary" />}
                  {event.type === 'alert' && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                  {event.type === 'insight' && <BookOpen className="h-3.5 w-3.5 text-blue-500" />}
                  {event.type === 'goal' && <Target className="h-3.5 w-3.5 text-amber-500" />}
                </div>
                
                {/* Event content */}
                <div className="group">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    {event.source && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        {event.source === 'call' ? 'Call' : 
                         event.source === 'whatsapp' ? 'WhatsApp' : 'Manual'}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-base font-medium leading-tight flex items-center gap-2">
                    {event.title}
                    {event.type === 'achievement' && (
                      <Award className="h-4 w-4 text-yellow-500 hidden group-hover:inline" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
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
