
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Achievement = {
  date: Date;
  description: string;
  type: 'achievement' | 'missed';
};

// Mock data - replace with real data later
const mockAchievements: Achievement[] = [
  { 
    date: new Date('2024-04-10'), 
    description: 'Completed daily meditation practice', 
    type: 'achievement' 
  },
  { 
    date: new Date('2024-04-10'), 
    description: 'Successful presentation to the board', 
    type: 'achievement' 
  },
  { 
    date: new Date('2024-04-12'), 
    description: 'Missed coaching call', 
    type: 'missed' 
  },
  { 
    date: new Date('2024-04-15'), 
    description: 'Week-long meditation streak achieved', 
    type: 'achievement' 
  },
  { 
    date: new Date('2024-04-15'), 
    description: 'Completed stress management workshop', 
    type: 'achievement' 
  },
];

const AchievementTimeline = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  // Get date range based on view
  const today = new Date();
  const dateRange = view === 'weekly' 
    ? { start: startOfWeek(today), end: endOfWeek(today) }
    : { start: startOfMonth(today), end: endOfMonth(today) };

  // Get all days in the range
  const days = eachDayOfInterval(dateRange);

  // Get achievements for a specific day
  const getDayAchievements = (day: Date) => {
    return mockAchievements.filter(achievement => 
      isSameDay(achievement.date, day)
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Achievement Timeline</h3>
        <div className="space-x-2">
          <Button 
            variant={view === 'weekly' ? 'default' : 'outline'}
            onClick={() => setView('weekly')}
            size="sm"
          >
            Weekly
          </Button>
          <Button 
            variant={view === 'monthly' ? 'default' : 'outline'}
            onClick={() => setView('monthly')}
            size="sm"
          >
            Monthly
          </Button>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div 
          className="relative"
          style={{ 
            height: '200px',
            minWidth: view === 'weekly' ? '600px' : '900px'
          }}
        >
          {/* Date labels */}
          <div className="flex justify-between absolute bottom-0 w-full pb-2">
            {days.map((day, index) => (
              <div key={index} className="text-xs text-muted-foreground transform -rotate-45 origin-top-left">
                {format(day, 'MMM d')}
              </div>
            ))}
          </div>

          {/* Achievement bars */}
          <div className="flex h-full">
            {days.map((day, dayIndex) => {
              const achievements = getDayAchievements(day);
              const dayWidth = 100 / days.length;

              return (
                <div
                  key={dayIndex}
                  className="flex flex-col-reverse justify-start items-center h-[calc(100%-2rem)]"
                  style={{ width: `${dayWidth}%` }}
                >
                  <TooltipProvider>
                    {achievements.map((achievement, achievementIndex) => (
                      <Tooltip key={achievementIndex}>
                        <TooltipTrigger>
                          <div
                            className={`w-full mx-1 mb-1 rounded ${
                              achievement.type === 'achievement' 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                            style={{
                              height: '20px',
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{achievement.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default AchievementTimeline;
