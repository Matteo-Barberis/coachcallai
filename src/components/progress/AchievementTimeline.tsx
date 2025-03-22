
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type AchievementType = 'achievement' | 'breakthrough' | 'missed';

type Achievement = {
  date: Date;
  description: string;
  type: AchievementType;
};

const mockAchievements: Achievement[] = [
  { 
    date: addDays(new Date(), -6), 
    description: 'Completed morning meditation routine', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -5), 
    description: 'Practiced deep breathing during stressful meeting', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -3), 
    description: 'First breakthrough: Connected childhood pattern to current anxiety', 
    type: 'breakthrough' 
  },
  { 
    date: addDays(new Date(), -2), 
    description: 'Completed daily meditation practice', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -2), 
    description: 'Successful presentation to the board while managing anxiety', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -1), 
    description: 'Missed coaching call', 
    type: 'missed' 
  },
  { 
    date: new Date(), 
    description: 'Used new coping strategies during family gathering', 
    type: 'achievement' 
  },
  { 
    date: new Date(), 
    description: 'Week-long meditation streak achieved', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -5), 
    description: 'Completed stress management workshop', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -4), 
    description: 'Major breakthrough: Identified core stress trigger related to work deadlines', 
    type: 'breakthrough' 
  },
  { 
    date: addDays(new Date(), -3), 
    description: 'Successfully implemented boundary setting with colleague', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -10), 
    description: 'Missed scheduled self-care routine', 
    type: 'missed' 
  },
  { 
    date: addDays(new Date(), -8), 
    description: 'Applied mindfulness techniques during high-pressure meeting', 
    type: 'achievement' 
  },
  { 
    date: addDays(new Date(), -7), 
    description: 'Breakthrough: Connected sleep patterns with stress levels', 
    type: 'breakthrough' 
  },
  { 
    date: addDays(new Date(), -1), 
    description: 'Consistently practiced evening wind-down routine', 
    type: 'achievement' 
  },
  { 
    date: new Date(), 
    description: 'Successfully navigated difficult family conversation using new tools', 
    type: 'achievement' 
  },
];

const AchievementTimeline = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const today = new Date();
  const dateRange = view === 'weekly' 
    ? { start: startOfWeek(today), end: endOfWeek(today) }
    : { start: startOfMonth(today), end: endOfMonth(today) };

  const days = eachDayOfInterval(dateRange);

  const getDayAchievements = (day: Date) => {
    return mockAchievements.filter(achievement => 
      isSameDay(achievement.date, day)
    );
  };

  const getAchievementColor = (type: AchievementType) => {
    switch (type) {
      case 'achievement':
        return 'bg-[#5CE65C] hover:bg-[#4cbc4c]';
      case 'breakthrough':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'missed':
        return 'bg-[#FF7081] hover:bg-[#e5636f]';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Achievement Timeline</h3>
          <p className="text-sm text-muted-foreground">Track your progress and accomplishments over time</p>
        </div>
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

      <div className="flex mb-4 gap-4 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#5CE65C]"></div>
          <span className="text-xs text-muted-foreground">Achievement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
          <span className="text-xs text-muted-foreground">Breakthrough</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#FF7081]"></div>
          <span className="text-xs text-muted-foreground">Missed</span>
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
          <div className="flex justify-between absolute bottom-0 w-full pb-2">
            {days.map((day, index) => (
              <div key={index} className="text-xs text-muted-foreground transform -rotate-45 origin-top-left">
                {format(day, 'MMM d')}
              </div>
            ))}
          </div>

          <div className="flex h-full">
            {days.map((day, dayIndex) => {
              const achievements = getDayAchievements(day);
              const dayWidth = 100 / days.length;

              return (
                <div
                  key={dayIndex}
                  className="flex flex-col-reverse justify-start items-center h-[calc(100%-2rem)]"
                  style={{ width: `${dayWidth}%` }}
                  data-testid={`day-column-${dayIndex}`}
                >
                  <TooltipProvider>
                    {achievements.map((achievement, achievementIndex) => (
                      <Tooltip key={achievementIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-4/5 mx-1 mb-1 rounded ${getAchievementColor(achievement.type)} cursor-pointer`}
                            style={{
                              height: '20px',
                            }}
                            aria-label={achievement.description}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="max-w-[200px]">
                          <div className="text-xs">
                            <div className="font-medium mb-1">{format(achievement.date, 'MMM d, yyyy')}</div>
                            <div className="mb-1">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                                achievement.type === 'breakthrough' ? 'bg-amber-100 text-amber-800' : 
                                achievement.type === 'achievement' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                              </span>
                            </div>
                            <p>{achievement.description}</p>
                          </div>
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
