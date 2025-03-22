
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, addDays } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PhoneCall } from 'lucide-react';

type AchievementType = 'achievement' | 'breakthrough' | 'milestone' | 'missed' | 'call-completed';

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
  { 
    date: addDays(new Date(), -9), 
    description: 'Completed first month of anxiety management program', 
    type: 'milestone' 
  },
  { 
    date: addDays(new Date(), -4), 
    description: 'Reached 30 days of consistent meditation practice', 
    type: 'milestone' 
  },
  { 
    date: addDays(new Date(), -7), 
    description: 'Attended coaching call successfully', 
    type: 'call-completed' 
  },
  { 
    date: addDays(new Date(), -14), 
    description: 'Completed coaching call with progress on anxiety management', 
    type: 'call-completed' 
  },
  { 
    date: addDays(new Date(), -21), 
    description: 'Attended coaching call and shared breakthrough', 
    type: 'call-completed' 
  },
  { 
    date: new Date(2025, 2, 16), // March 16, 2025 (months are 0-indexed in JavaScript)
    description: 'Completed quarterly review coaching call', 
    type: 'call-completed' 
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
      case 'milestone':
        return 'bg-[#F97316] hover:bg-[#ea6c10]';
      case 'missed':
        return 'bg-[#FF7081] hover:bg-[#e5636f]';
      case 'call-completed':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Format the date based on the current view
  const formatDayLabel = (day: Date) => {
    return view === 'weekly' 
      ? format(day, 'd') // Just show the day number for weekly view
      : format(day, 'd'); // Just show the day number for monthly view
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
          <div className="w-3 h-3 rounded-sm bg-[#F97316]"></div>
          <span className="text-xs text-muted-foreground">Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#FF7081]"></div>
          <span className="text-xs text-muted-foreground">Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
          <span className="text-xs text-muted-foreground">Call Completed</span>
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
          {/* Month label at the top */}
          <div className="flex justify-center w-full mb-2">
            <span className="text-sm font-medium">
              {format(days[0], 'MMMM yyyy')}
            </span>
          </div>
          
          {/* Day numbers at the bottom with tooltips for full dates */}
          <div className="flex justify-between absolute bottom-0 w-full pb-2">
            {days.map((day, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center w-full">
                      <div className="text-xs text-muted-foreground">
                        {formatDayLabel(day)}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    {format(day, 'MMMM d, yyyy')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                          >
                            {achievement.type === 'call-completed' && (
                              <div className="flex justify-center items-center h-full">
                                <PhoneCall className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="max-w-[200px]">
                          <div className="text-xs">
                            <div className="font-medium mb-1">{format(achievement.date, 'MMM d, yyyy')}</div>
                            <div className="mb-1">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                                achievement.type === 'breakthrough' ? 'bg-amber-100 text-amber-800' : 
                                achievement.type === 'achievement' ? 'bg-green-100 text-green-800' : 
                                achievement.type === 'milestone' ? 'bg-orange-100 text-orange-800' :
                                achievement.type === 'call-completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {achievement.type === 'call-completed' ? 'Call Completed' : 
                                achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
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
