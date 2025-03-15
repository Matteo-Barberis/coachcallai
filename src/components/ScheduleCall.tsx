
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSessionContext } from '@/context/SessionContext';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Types for goals and schedules
type Goal = {
  id: string;
  name: string;
  description: string;
  isFromDb?: boolean;
};

type WeekdaySchedule = {
  id: string;
  day: string;
  time: string;
  goalId: string | null;
  isFromDb?: boolean;
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
  goalId: string | null;
  isFromDb?: boolean;
};

const formSchema = z.object({
  timeZone: z.string().default('GMT'),
  weekdaySchedules: z.array(
    z.object({
      day: z.string(),
      time: z.string(),
      goalId: z.string().nullable()
    })
  ),
  specificDateSchedules: z.array(
    z.object({
      date: z.date(),
      time: z.string(),
      goalId: z.string().nullable()
    })
  ),
  goals: z.array(
    z.object({
      name: z.string().min(1, 'Goal name is required'),
      description: z.string().min(3, 'Goal description must be at least 3 characters')
    })
  ).min(1, 'Add at least one goal')
});

const dayOptions = [
  { value: 'monday', label: 'Monday', weekday: 1 },
  { value: 'tuesday', label: 'Tuesday', weekday: 2 },
  { value: 'wednesday', label: 'Wednesday', weekday: 3 },
  { value: 'thursday', label: 'Thursday', weekday: 4 },
  { value: 'friday', label: 'Friday', weekday: 5 },
  { value: 'saturday', label: 'Saturday', weekday: 6 },
  { value: 'sunday', label: 'Sunday', weekday: 0 },
];

const getDayNumberFromName = (dayName: string): number => {
  const day = dayOptions.find(d => d.value === dayName);
  return day ? day.weekday : 1; // Default to Monday (1) if not found
};

const getDayNameFromNumber = (weekdayNum: number): string => {
  const day = dayOptions.find(d => d.weekday === weekdayNum);
  return day ? day.value : 'monday'; // Default to Monday if not found
};

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourFormatted = hour.toString().padStart(2, '0');
    options.push({ value: `${hourFormatted}:00`, label: `${hourFormatted}:00` });
    options.push({ value: `${hourFormatted}:30`, label: `${hourFormatted}:30` });
  }
  return options;
};

const timeOptions = generateTimeOptions();

const getTimeInZone = (timeZone: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timeZone
    };
    return new Date().toLocaleTimeString(undefined, options);
  } catch (error) {
    return '';
  }
};

const timeZoneOptions = [
  { value: 'GMT', label: 'Greenwich Mean Time (GMT)', timeZone: 'GMT' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)', timeZone: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', timeZone: 'America/New_York' },
  { value: 'America/Chicago', label: 'Central Time (CT)', timeZone: 'America/Chicago' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', timeZone: 'America/Denver' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', timeZone: 'America/Los_Angeles' },
  { value: 'Europe/London', label: 'British Time (BST)', timeZone: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', timeZone: 'Europe/Paris' },
  { value: 'Europe/Athens', label: 'Eastern European Time (EET)', timeZone: 'Europe/Athens' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', timeZone: 'Asia/Dubai' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', timeZone: 'Asia/Kolkata' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)', timeZone: 'Asia/Shanghai' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', timeZone: 'Asia/Tokyo' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', timeZone: 'Australia/Sydney' },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time (NZST)', timeZone: 'Pacific/Auckland' },
];

const ScheduleCall = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  
  // State for UI elements
  const [weekdaySchedules, setWeekdaySchedules] = useState<WeekdaySchedule[]>([]);
  const [specificDateSchedules, setSpecificDateSchedules] = useState<SpecificDateSchedule[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeZone, setTimeZone] = useState('GMT');
  const [timeZoneWithTimes, setTimeZoneWithTimes] = useState(timeZoneOptions.map(tz => ({
    ...tz,
    currentTime: getTimeInZone(tz.timeZone)
  })));
  
  // State for tracking deletions
  const [deletedGoalIds, setDeletedGoalIds] = useState<string[]>([]);
  const [deletedScheduleIds, setDeletedScheduleIds] = useState<string[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone: 'GMT',
      weekdaySchedules: [],
      specificDateSchedules: [],
      goals: [],
    },
  });

  // Fetch goals from the database
  const fetchGoals = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('id, name, description')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Mark goals as coming from the database
        const dbGoals = data.map(goal => ({
          ...goal,
          isFromDb: true
        }));
        
        setGoals(dbGoals);
        
        // Update form values
        form.setValue('goals', data.map(({ name, description }) => ({ 
          name, 
          description 
        })));
      } else {
        // Add a default goal if none exist
        const defaultGoal = { id: `goal-${Date.now()}`, name: 'Morning Session', description: '', isFromDb: false };
        setGoals([defaultGoal]);
        form.setValue('goals', [{ name: 'Morning Session', description: '' }]);
      }
    } catch (error) {
      console.error('Error in fetchGoals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch schedules from the database
  const fetchSchedules = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('scheduled_calls')
        .select('id, weekday, time, goal_id, specific_date')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching schedules:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Process weekday schedules
        const weekdays = data
          .filter(schedule => schedule.weekday !== null)
          .map(schedule => ({
            id: schedule.id,
            day: getDayNameFromNumber(schedule.weekday),
            time: schedule.time || '09:00',
            goalId: schedule.goal_id,
            isFromDb: true
          }));
        
        setWeekdaySchedules(weekdays);
        
        if (weekdays.length > 0) {
          form.setValue('weekdaySchedules', weekdays.map(({ day, time, goalId }) => ({ 
            day, 
            time, 
            goalId 
          })));
        }
        
        // Process specific date schedules (implementation removed for now)
      } else if (weekdaySchedules.length === 0) {
        // Add a default weekday schedule if none exist
        addWeekdaySchedule();
      }
    } catch (error) {
      console.error('Error in fetchSchedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchSchedules();
  }, [session]);

  // Add a new goal
  const addGoal = () => {
    const newId = `goal-${Date.now()}`;
    const newGoal = { 
      id: newId, 
      name: '', 
      description: '',
      isFromDb: false
    };
    
    setGoals([...goals, newGoal]);
    
    const currentGoals = form.getValues('goals') || [];
    form.setValue('goals', [...currentGoals, { name: '', description: '' }]);
  };

  // Remove a goal
  const removeGoal = (index: number) => {
    if (goals.length <= 1) return;
    
    const goalToRemove = goals[index];
    const updatedGoals = [...goals];
    
    // If the goal is from the database, track it for deletion
    if (goalToRemove.isFromDb) {
      setDeletedGoalIds([...deletedGoalIds, goalToRemove.id]);
    }
    
    // Remove the goal from the state
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
    
    // Remove the goal from the form values
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your schedules",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, process goals
      
      // 1. Delete any goals that were removed
      if (deletedGoalIds.length > 0) {
        for (const goalId of deletedGoalIds) {
          // Only attempt to delete DB goals (not temporary frontend ones)
          if (goalId.startsWith('goal-')) continue;
          
          const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId)
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error(`Failed to delete goal ${goalId}:`, error);
            // If the goal is linked to schedules, notify the user
            if (error.code === '23503') {
              toast({
                title: "Cannot delete goal",
                description: "This goal is assigned to one or more schedules. Please remove the assignments first.",
                variant: "destructive"
              });
              setIsLoading(false);
              return;
            }
          }
        }
      }
      
      // 2. Update existing goals and insert new ones
      const savedGoals: Goal[] = [];
      
      for (let i = 0; i < goals.length; i++) {
        const goal = goals[i];
        const formGoal = data.goals[i];
        
        if (goal.isFromDb) {
          // Update existing goal
          const { data: updatedGoal, error } = await supabase
            .from('goals')
            .update({
              name: formGoal.name,
              description: formGoal.description
            })
            .eq('id', goal.id)
            .eq('user_id', session.user.id)
            .select('id, name, description')
            .single();
            
          if (error) {
            console.error(`Failed to update goal ${goal.id}:`, error);
            continue;
          }
          
          savedGoals.push({ ...updatedGoal, isFromDb: true });
        } else {
          // Insert new goal
          const { data: newGoal, error } = await supabase
            .from('goals')
            .insert({
              name: formGoal.name,
              description: formGoal.description,
              user_id: session.user.id
            })
            .select('id, name, description')
            .single();
            
          if (error) {
            console.error('Failed to insert new goal:', error);
            continue;
          }
          
          savedGoals.push({ ...newGoal, isFromDb: true });
        }
      }
      
      // 3. Process weekday schedules
      
      // Delete any schedules that were removed
      if (deletedScheduleIds.length > 0) {
        for (const scheduleId of deletedScheduleIds) {
          // Only attempt to delete DB schedules (not temporary frontend ones)
          if (scheduleId.startsWith('weekday-')) continue;
          
          const { error } = await supabase
            .from('scheduled_calls')
            .delete()
            .eq('id', scheduleId)
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error(`Failed to delete schedule ${scheduleId}:`, error);
          }
        }
      }
      
      // Update existing weekday schedules and insert new ones
      const savedWeekdaySchedules: WeekdaySchedule[] = [];
      
      for (let i = 0; i < weekdaySchedules.length; i++) {
        const schedule = weekdaySchedules[i];
        const formSchedule = data.weekdaySchedules[i];
        
        // Skip if no day or time selected
        if (!formSchedule.day || !formSchedule.time) continue;
        
        const weekdayNum = getDayNumberFromName(formSchedule.day);
        
        if (schedule.isFromDb) {
          // Update existing schedule
          const { data: updatedSchedule, error } = await supabase
            .from('scheduled_calls')
            .update({
              weekday: weekdayNum,
              time: formSchedule.time,
              goal_id: formSchedule.goalId || savedGoals[0].id // Default to first goal if none selected
            })
            .eq('id', schedule.id)
            .eq('user_id', session.user.id)
            .select('id, weekday, time, goal_id')
            .single();
            
          if (error) {
            console.error(`Failed to update schedule ${schedule.id}:`, error);
            continue;
          }
          
          savedWeekdaySchedules.push({ 
            id: updatedSchedule.id, 
            day: getDayNameFromNumber(updatedSchedule.weekday),
            time: updatedSchedule.time || '09:00',
            goalId: updatedSchedule.goal_id,
            isFromDb: true 
          });
        } else {
          // Insert new schedule
          const { data: newSchedule, error } = await supabase
            .from('scheduled_calls')
            .insert({
              weekday: weekdayNum,
              time: formSchedule.time,
              goal_id: formSchedule.goalId || savedGoals[0].id, // Default to first goal if none selected
              user_id: session.user.id
            })
            .select('id, weekday, time, goal_id')
            .single();
            
          if (error) {
            console.error('Failed to insert new schedule:', error);
            continue;
          }
          
          savedWeekdaySchedules.push({ 
            id: newSchedule.id, 
            day: getDayNameFromNumber(newSchedule.weekday),
            time: newSchedule.time || '09:00',
            goalId: newSchedule.goal_id,
            isFromDb: true 
          });
        }
      }
      
      // Update state with saved goals and schedules
      setGoals(savedGoals);
      setWeekdaySchedules(savedWeekdaySchedules);
      setDeletedGoalIds([]);
      setDeletedScheduleIds([]);
      
      toast({
        title: "Saved Successfully",
        description: "Your coaching goals and schedule have been saved!",
      });
      
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with a default weekday schedule if none exists
  useEffect(() => {
    if (weekdaySchedules.length === 0) {
      addWeekdaySchedule();
    }
  }, []);

  // Update time zone displays
  useEffect(() => {
    const updateTimes = () => {
      setTimeZoneWithTimes(timeZoneOptions.map(tz => ({
        ...tz,
        currentTime: getTimeInZone(tz.timeZone)
      })));
    };
    
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Functions for schedules
  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const newSchedule = {
      id: newId,
      day: 'monday',
      time: '09:00',
      goalId: null,
      isFromDb: false
    };
    
    setWeekdaySchedules([...weekdaySchedules, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { day: 'monday', time: '09:00', goalId: null }]);
  };

  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const newSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00',
      goalId: null,
      isFromDb: false
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { date: new Date(), time: '09:00', goalId: null }]);
  };

  const removeWeekdaySchedule = (index: number) => {
    const scheduleToRemove = weekdaySchedules[index];
    const updatedSchedules = [...weekdaySchedules];
    
    // If the schedule is from the database, track it for deletion
    if (scheduleToRemove.isFromDb) {
      setDeletedScheduleIds([...deletedScheduleIds, scheduleToRemove.id]);
    }
    
    // Remove the schedule from the state
    updatedSchedules.splice(index, 1);
    setWeekdaySchedules(updatedSchedules);
    
    // Remove the schedule from the form values
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules.splice(index, 1);
    form.setValue('weekdaySchedules', currentSchedules);
  };

  const removeSpecificDateSchedule = (index: number) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules.splice(index, 1);
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules.splice(index, 1);
    form.setValue('specificDateSchedules', currentSchedules);
  };

  const setWeekdayScheduleGoal = (index: number, goalId: string | null) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[index].goalId = goalId;
    setWeekdaySchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules[index].goalId = goalId;
    form.setValue('weekdaySchedules', currentSchedules);
  };

  const setSpecificDateScheduleGoal = (index: number, goalId: string | null) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[index].goalId = goalId;
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules[index].goalId = goalId;
    form.setValue('specificDateSchedules', currentSchedules);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div>
            <FormLabel className="text-base">Weekly Schedule</FormLabel>
            <FormDescription className="mb-4">
              Select which days of the week you want to have coaching calls and assign goals to each session.
            </FormDescription>
            
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem className="mb-4 max-w-[250px]">
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeZone(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[350px]">
                      {timeZoneWithTimes.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label} ({tz.currentTime})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-3">
            {weekdaySchedules.map((schedule, index) => (
              <div key={schedule.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                  <FormField
                    control={form.control}
                    name={`weekdaySchedules.${index}.day`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[120px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const updated = [...weekdaySchedules];
                            updated[index].day = value;
                            setWeekdaySchedules(updated);
                          }}
                          defaultValue={schedule.day}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dayOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`weekdaySchedules.${index}.time`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[120px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const updated = [...weekdaySchedules];
                            updated[index].time = value;
                            setWeekdaySchedules(updated);
                          }}
                          defaultValue={schedule.time || "09:00"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {timeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {/* Goal selection field - hidden for now as per instruction */}
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name={`weekdaySchedules.${index}.goalId`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-[180px]">
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              setWeekdayScheduleGoal(index, value === "none" ? null : value);
                            }}
                            defaultValue={schedule.goalId || "none"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Assign a goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No specific goal</SelectItem>
                              {goals.map(goal => (
                                <SelectItem key={goal.id} value={goal.id}>
                                  {goal.name || `Goal ${goals.indexOf(goal) + 1}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeWeekdaySchedule(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3 hidden">
            {/* Specific date schedules section hidden for now */}
            {specificDateSchedules.map((schedule, index) => (
              <div key={schedule.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                  <FormField
                    control={form.control}
                    name={`specificDateSchedules.${index}.date`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                if (date) {
                                  const updated = [...specificDateSchedules];
                                  updated[index].date = date;
                                  setSpecificDateSchedules(updated);
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`specificDateSchedules.${index}.time`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[120px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const updated = [...specificDateSchedules];
                            updated[index].time = value;
                            setSpecificDateSchedules(updated);
                          }}
                          defaultValue={schedule.time || "09:00"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {timeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`specificDateSchedules.${index}.goalId`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSpecificDateScheduleGoal(index, value === "none" ? null : value);
                          }}
                          defaultValue={schedule.goalId || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Assign a goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No specific goal</SelectItem>
                            {goals.map(goal => (
                              <SelectItem key={goal.id} value={goal.id}>
                                {goal.name || `Goal ${goals.indexOf(goal) + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeSpecificDateSchedule(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addWeekdaySchedule}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add weekday
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecificDateSchedule}
              className="flex items-center gap-1 hidden"
            >
              <Plus className="h-4 w-4" />
              Add specific date
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <FormLabel className="text-base">Define Your Coaching Goals</FormLabel>
            <FormDescription>
              Define goals for your coaching sessions. You'll be able to assign these goals to specific time slots.
            </FormDescription>
          </div>
          
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  {goals.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeGoal(index)}
                      className="flex-shrink-0 h-8 w-8 ml-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name={`goals.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Goal Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Morning Session, Evening Reflection..."
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const updatedGoals = [...goals];
                              updatedGoals[index].name = e.target.value;
                              setGoals(updatedGoals);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`goals.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Goal Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you want to achieve..."
                            className="resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const updatedGoals = [...goals];
                              updatedGoals[index].description = e.target.value;
                              setGoals(updatedGoals);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addGoal}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Schedule Calls"}
        </Button>
      </form>
    </Form>
  );
};

export default ScheduleCall;
