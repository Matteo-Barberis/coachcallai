import React, { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, addDays, isSameMonth, parseISO } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PhoneCall } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSessionContext } from '@/context/SessionContext';
import type { UserAchievement, CallLog } from '@/types/supabase';

type AchievementType = 'achievement' | 'breakthrough' | 'milestone' | 'missed' | 'call-completed';

type Achievement = {
  date: Date;
  description: string;
  type: AchievementType;
  id: string;
};

type TemplateInfo = {
  name: string;
  description: string;
};

const AchievementTimeline = () => {
  const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const { session } = useSessionContext();
  const userId = session?.user.id;

  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('achievement_date', { ascending: false });
      
      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!userId,
  });

  const { data: callLogs, isLoading: callLogsLoading } = useQuery({
    queryKey: ['callLogs', 'withTemplates'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: logs, error: logsError } = await supabase
        .from('call_logs')
        .select(`
          *,
          scheduled_calls:scheduled_call_id (
            template_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (logsError) throw logsError;
      
      const templateIds = Array.from(new Set(
        logs.filter(log => log.scheduled_calls?.template_id)
          .map(log => log.scheduled_calls.template_id)
      ));
      
      let templates: Record<string, TemplateInfo> = {};
      
      if (templateIds.length > 0) {
        const { data: templatesData, error: templatesError } = await supabase
          .from('templates')
          .select('id, name, description')
          .in('id', templateIds);
        
        if (templatesError) throw templatesError;
        
        templates = templatesData.reduce((acc, template) => {
          acc[template.id] = {
            name: template.name,
            description: template.description
          };
          return acc;
        }, {} as Record<string, TemplateInfo>);
      }
      
      return logs.map(log => ({
        ...log,
        template: log.scheduled_calls?.template_id ? templates[log.scheduled_calls.template_id] : null
      }));
    },
    enabled: !!userId,
  });

  const transformDataToAchievements = (): Achievement[] => {
    if (achievementsLoading || callLogsLoading) return [];
    
    const achievements: Achievement[] = [];
    
    if (userAchievements) {
      userAchievements.forEach(achievement => {
        const achievementDate = achievement.achievement_date ? parseISO(achievement.achievement_date) : new Date(achievement.created_at);
        
        achievements.push({
          id: achievement.id,
          date: achievementDate,
          description: achievement.description,
          type: achievement.type as AchievementType,
        });
      });
    }
    
    if (callLogs) {
      callLogs.forEach(call => {
        const callDate = call.created_at ? parseISO(call.created_at) : new Date();
        const callType = call.status === 'completed' ? 'call-completed' : 'missed';
        const templateName = call.template?.name || 'Coaching Call';
        
        achievements.push({
          id: call.id,
          date: callDate,
          description: `${call.status === 'completed' ? 'Completed' : 'Missed'} ${templateName}`,
          type: callType,
        });
      });
    }
    
    return achievements;
  };

  const achievements = transformDataToAchievements();

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
    return achievements.filter(achievement => 
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
        return 'bg-orange-500 hover:bg-orange-600';
      case 'missed':
        return 'bg-[#FF7081] hover:bg-[#e5636f]';
      case 'call-completed':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const renderDateLabel = (day: Date, index: number) => {
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

  const getYearlyViewStructure = () => {
    const year = today.getFullYear();
    const monthsData = [];
    
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const monthStart = new Date(year, monthIndex, 1);
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const monthName = format(monthStart, 'MMM');
      
      monthsData.push({
        month: monthIndex,
        name: monthName,
        days: daysInMonth,
        firstDay: monthStart
      });
    }
    
    return monthsData;
  };
  
  const renderYearlyView = () => {
    const monthsData = getYearlyViewStructure();
    const yearStartDate = startOfYear(today);
    const weekDays = ['Mon', 'Wed', 'Fri'];
    
    const totalDays = monthsData.reduce((acc, month) => acc + month.days, 0);
    
    const getYearData = () => {
      const result = [];
      let currentDate = yearStartDate;
      
      for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
        const weekData = [];
        
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const date = addDays(currentDate, (weekIndex * 7) + dayIndex);
          
          if (date.getFullYear() === today.getFullYear()) {
            weekData.push({
              date,
              month: date.getMonth(),
              day: date.getDay(),
              achievements: getDayAchievements(date)
            });
          } else {
            weekData.push(null);
          }
        }
        
        if (weekData.some(day => day !== null)) {
          result.push(weekData);
        }
        
        if (weekData.every(day => day === null)) {
          break;
        }
      }
      
      return result;
    };
    
    const yearData = getYearData();
    const totalWeeks = yearData.length;
    
    return (
      <div className="pb-4">
        <div className="flex mb-1 pl-10 pr-2">
          {monthsData.map((month, index) => {
            const widthPercentage = (month.days / totalDays) * 100;
            
            return (
              <div 
                key={index} 
                className="text-xs text-muted-foreground text-center overflow-visible whitespace-nowrap"
                style={{ 
                  width: `${widthPercentage}%`,
                }}
              >
                {month.name}
              </div>
            );
          })}
        </div>
        
        <div className="flex">
          <div className="flex flex-col mr-2 pt-1 w-10" style={{ height: "120px" }}>
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className="text-xs text-muted-foreground h-3.5 flex items-center justify-end pr-1"
                style={{ 
                  marginTop: index === 0 ? '8px' : index === 1 ? '28px' : '28px'
                }}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="flex flex-1 overflow-x-auto">
            <div className="flex w-full">
              {yearData.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className="flex flex-col mr-0.5"
                  style={{ 
                    width: `${100 / totalWeeks}%`, 
                    minWidth: "10px",
                    flexGrow: 1,
                  }}
                >
                  {week.map((day, dayIndex) => {
                    if (!day) return <div key={dayIndex} className="aspect-square mb-0.5 opacity-0"></div>;
                    
                    const { date, achievements } = day;
                    
                    return (
                      <TooltipProvider key={dayIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`aspect-square mb-0.5 rounded-sm ${
                                achievements.length > 0 
                                  ? getAchievementColor(achievements[0].type) 
                                  : 'bg-transparent border border-gray-200'
                              }`}
                              style={{
                                minWidth: '6px',
                                minHeight: '6px',
                                width: '100%',
                                height: 'auto',
                              }}
                            >
                              {achievements.length > 1 && (
                                <div className="text-[6px] text-white font-bold flex items-center justify-center h-full">
                                  {achievements.length}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          {achievements.length > 0 && (
                            <TooltipContent side="top" align="center" className="max-w-[200px]">
                              <div className="text-xs">
                                <div className="font-medium mb-1">{format(date, 'MMM d, yyyy')}</div>
                                {achievements.map((achievement, idx) => (
                                  <div key={idx} className="mb-1">
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
                                    <p>{achievement.description}</p>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
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
          <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
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

      {(achievementsLoading || callLogsLoading) ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">Loading your achievements...</p>
        </div>
      ) : achievements.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-muted-foreground">No achievements yet. They will appear here as you make progress.</p>
        </div>
      ) : (
        <ScrollArea className="w-full">
          {view === 'yearly' ? (
            <div className="py-2" style={{ width: "100%", maxWidth: "100%", maxHeight: "220px" }}>
              {renderYearlyView()}
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
                  const dayAchievements = getDayAchievements(day);
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
                        {dayAchievements.map((achievement, achievementIndex) => (
                          <Tooltip key={`${achievement.id}-${achievementIndex}`}>
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
                                  <p>{achievement.description}</p>
                                </div>
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
      )}
    </Card>
  );
};

export default AchievementTimeline;
