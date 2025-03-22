
import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, addDays, getMonth, getDaysInMonth, startOfDay, getDay } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const today = new Date();
  let dateRange;
  
  switch(view) {
    case 'weekly':
      dateRange = { start: startOfWeek(today), end: endOfWeek(today) };
      break;
    case 'monthly':
      dateRange = { start: startOfMonth(today), end: endOfMonth(today) };
      break;
    case 'yearly':
      dateRange = { start: startOfYear(today), end: endOfYear(today) };
      break;
    default:
      dateRange = { start: startOfWeek(today), end: endOfWeek(today) };
  }

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

  const renderDateLabel = (day: Date, index: number) => {
    // For yearly view, only show month names at the start of each month or for the first day
    if (view === 'yearly') {
      const isFirstDayOfMonth = day.getDate() === 1;
      const isFirstDay = index === 0;
      
      if (isFirstDayOfMonth || isFirstDay) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {format(day, 'MMM')}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {format(day, 'MMMM yyyy')}
            </TooltipContent>
          </Tooltip>
        );
      }
      return null;
    }
    
    // For weekly and monthly views, show abbreviated date
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {format(day, 'd')}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {format(day, 'MMM d, yyyy')}
        </TooltipContent>
      </Tooltip>
    );
  };

  // Generate calendar grid for yearly view
  const renderMonthGrid = (month: number) => {
    const year = today.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = getDaysInMonth(firstDayOfMonth);
    
    // Calculate offset for first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOffset = getDay(firstDayOfMonth);
    
    // Create array with empty slots for offset and days of the month
    const calendarDays = Array(35).fill(null).map((_, index) => {
      const dayOfMonth = index - firstDayOffset + 1;
      if (dayOfMonth > 0 && dayOfMonth <= daysInMonth) {
        return new Date(year, month, dayOfMonth);
      }
      return null;
    });

    // Create rows of 7 days
    const rows = [];
    for (let i = 0; i < 5; i++) {
      const weekDays = calendarDays.slice(i * 7, (i + 1) * 7);
      rows.push(weekDays);
    }

    return (
      <div className="w-full mb-1">
        <div className="text-xs font-medium mb-1 text-center">
          {format(firstDayOfMonth, 'MMMM')}
        </div>
        <div className="grid grid-cols-7 gap-px bg-muted rounded overflow-hidden">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={`row-${month}-${rowIndex}`}>
              {row.map((day, colIndex) => (
                <div 
                  key={`cell-${month}-${rowIndex}-${colIndex}`} 
                  className="relative aspect-square bg-card"
                >
                  {day && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full h-full p-0.5">
                            <div className="text-[8px] text-muted-foreground absolute top-0.5 left-0.5">
                              {format(day, 'd')}
                            </div>
                            <div className="flex flex-wrap content-center justify-center h-full pt-2">
                              {getDayAchievements(day).map((achievement, index) => (
                                <div
                                  key={index}
                                  className={`w-1 h-1 m-px rounded-full ${getAchievementColor(achievement.type)}`}
                                  aria-label={achievement.description}
                                />
                              ))}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="max-w-[150px]">
                          <div className="text-xs">
                            <div className="font-medium mb-1">{format(day, 'MMM d, yyyy')}</div>
                            {getDayAchievements(day).length > 0 ? (
                              getDayAchievements(day).map((achievement, index) => (
                                <div key={index} className="mb-1">
                                  <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] ${
                                    achievement.type === 'breakthrough' ? 'bg-amber-100 text-amber-800' : 
                                    achievement.type === 'achievement' ? 'bg-green-100 text-green-800' : 
                                    achievement.type === 'milestone' ? 'bg-orange-100 text-orange-800' :
                                    achievement.type === 'call-completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {achievement.type === 'call-completed' ? 'Call' : 
                                    achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                                  </span>
                                  <p className="text-[9px] mt-0.5">{achievement.description}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-[9px] text-muted-foreground">No achievements</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Achievement Timeline</h3>
          <p className="text-sm text-muted-foreground">Track your progress and accomplishments over time</p>
        </div>
        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as 'weekly' | 'monthly' | 'yearly')}>
          <ToggleGroupItem value="weekly" size="sm">Weekly</ToggleGroupItem>
          <ToggleGroupItem value="monthly" size="sm">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="yearly" size="sm">Yearly</ToggleGroupItem>
        </ToggleGroup>
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
        {view === 'yearly' ? (
          <div className="grid grid-cols-3 gap-4 pb-4" style={{ minWidth: '900px' }}>
            {Array.from({ length: 12 }, (_, i) => i).map((month) => (
              <div key={month}>
                {renderMonthGrid(month)}
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="relative"
            style={{ 
              height: '200px',
              minWidth: view === 'weekly' ? '600px' : '900px'
            }}
          >
            <div className="flex justify-between absolute bottom-0 w-full pb-2">
              {days.map((day, index) => (
                <div key={index} className="flex justify-center" style={{ width: `${100 / days.length}%` }}>
                  {renderDateLabel(day, index)}
                </div>
              ))}
            </div>

            <div className="flex h-full">
              {days.map((day, dayIndex) => {
                const achievements = getDayAchievements(day);
                const dayWidth = 100 / days.length;
                
                const achievementHeight = '20px';
                const achievementWidth = 'w-4/5';

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
                              className={`${achievementWidth} mx-1 mb-1 rounded ${getAchievementColor(achievement.type)} cursor-pointer`}
                              style={{
                                height: achievementHeight,
                                minHeight: achievementHeight,
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
        )}
      </ScrollArea>
    </Card>
  );
};

export default AchievementTimeline;
