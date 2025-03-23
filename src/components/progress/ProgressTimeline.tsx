
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, Award, Target, BookOpen, Sparkles, Star, Flag, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'milestone' | 'alert' | 'insight' | 'goal' | 'breakthrough';
  source?: 'call' | 'whatsapp' | 'manual';
  callId?: string;
  details?: string;
  impact?: 'low' | 'medium' | 'high';
}

interface ProgressTimelineProps {
  events: TimelineEvent[];
  title?: string;
  description?: string;
}

const ProgressTimeline = ({ events, title = "Your Progress Journey", description }: ProgressTimelineProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const filteredEvents = filter 
    ? events.filter(event => event.type === filter) 
    : events;

  const toggleExpand = (eventTitle: string) => {
    setExpandedEvent(expandedEvent === eventTitle ? null : eventTitle);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === null ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            <Button 
              variant={filter === 'breakthrough' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('breakthrough')}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Star className="h-3.5 w-3.5 mr-1" />
              Breakthroughs
            </Button>
            <Button 
              variant={filter === 'achievement' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('achievement')}
              className="bg-primary/90 hover:bg-primary text-white"
            >
              <Trophy className="h-3.5 w-3.5 mr-1" />
              Achievements
            </Button>
            <Button 
              variant={filter === 'milestone' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilter('milestone')}
              className="bg-secondary/90 hover:bg-secondary text-white"
            >
              <Flag className="h-3.5 w-3.5 mr-1" />
              Milestones
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative ml-3">
          {/* Vertical line */}
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={index} 
                className={cn(
                  "relative pl-8 transition-all cursor-pointer",
                  {
                    "hover:translate-x-1": true,
                    "bg-muted/50 p-3 rounded-md -ml-3": expandedEvent === event.title,
                    "animate-pulse": event.type === 'breakthrough' && expandedEvent !== event.title
                  }
                )}
                onClick={() => toggleExpand(event.title)}
              >
                {/* Timeline dot */}
                <div className={`absolute left-0 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full border ${
                  event.type === 'achievement' ? 'border-primary bg-primary/10' :
                  event.type === 'milestone' ? 'border-secondary bg-secondary/10' : 
                  event.type === 'alert' ? 'border-destructive bg-destructive/10' :
                  event.type === 'insight' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900 dark:border-blue-600' :
                  event.type === 'breakthrough' ? 'border-purple-400 bg-purple-50 dark:bg-purple-900 dark:border-purple-600 shadow-glow' :
                  'border-amber-400 bg-amber-50 dark:bg-amber-900 dark:border-amber-600'
                }`}>
                  {event.type === 'achievement' && <CheckCircle className="h-3.5 w-3.5 text-primary" />}
                  {event.type === 'milestone' && <Flag className="h-3.5 w-3.5 text-secondary" />}
                  {event.type === 'alert' && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                  {event.type === 'insight' && <BookOpen className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />}
                  {event.type === 'goal' && <Target className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />}
                  {event.type === 'breakthrough' && <Star className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />}
                </div>
                
                {/* Timeline connecting line highlight for high impact events */}
                {event.impact === 'high' && (
                  <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-primary z-10" />
                )}
                
                {/* Event content */}
                <div className="group">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    {event.type === 'breakthrough' && (
                      <Badge className="bg-purple-500 text-white text-xs py-0 h-5">
                        Breakthrough
                      </Badge>
                    )}
                    {event.type === 'milestone' && (
                      <Badge className="bg-secondary text-white text-xs py-0 h-5">
                        Milestone
                      </Badge>
                    )}
                    {event.impact === 'high' && (
                      <Badge className="bg-amber-500 text-white text-xs py-0 h-5">
                        High Impact
                      </Badge>
                    )}
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <h3 className="text-base font-medium leading-tight flex items-center gap-2">
                        {event.type === 'breakthrough' ? `Breakthrough: ${event.description}` :
                         event.type === 'milestone' ? `Milestone: ${event.description}` :
                         event.title}
                        {event.type === 'achievement' && (
                          <Trophy className="h-4 w-4 text-yellow-500 hidden group-hover:inline" />
                        )}
                        {event.type === 'breakthrough' && (
                          <Sparkles className="h-4 w-4 text-purple-500 hidden group-hover:inline" />
                        )}
                      </h3>
                    </HoverCardTrigger>
                    {event.details && (
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm">{event.details}</p>
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.type === 'breakthrough' || event.type === 'milestone' ? '' : event.description}
                  </p>
                  
                  {/* Expanded content */}
                  {expandedEvent === event.title && event.details && (
                    <div className="mt-3 text-sm bg-background/80 border p-3 rounded-md">
                      <p>{event.details}</p>
                    </div>
                  )}
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
