
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

// Define clean interfaces for our data types
interface Goal {
  id: string;
  name: string;
  description: string;
  isFromDb?: boolean;
}

interface WeekdaySchedule {
  id: string;
  day: string;
  time: string;
  goalId: string | null;
  isFromDb?: boolean;
}

interface SpecificDateSchedule {
  id: string;
  date: Date;
  time: string;
  goalId: string | null;
  isFromDb?: boolean;
}

// Form schema for validation
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
      description: z.string().min(1, 'Goal description is required')
    })
  ).min(1, 'Add at least one goal')
});

const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

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
  
  // State management for form data
  const [weekdaySchedules, setWeekdaySchedules] = useState<WeekdaySchedule[]>([]);
  const [specificDateSchedules, setSpecificDateSchedules] = useState<SpecificDateSchedule[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeZone, setTimeZone] = useState('GMT');
  const [timeZoneWithTimes, setTimeZoneWithTimes] = useState(timeZoneOptions.map(tz => ({
    ...tz,
    currentTime: getTimeInZone(tz.timeZone)
  })));
  
  // Track loading state to prevent multiple submissions
  const [isLoading, setIsLoading] = useState(false);
  
  // Track deleted items for cleanup
  const [deletedGoalIds, setDeletedGoalIds] = useState<string[]>([]);
  const [deletedWeekdayScheduleIds, setDeletedWeekdayScheduleIds] = useState<string[]>([]);
  const [deletedSpecificDateScheduleIds, setDeletedSpecificDateScheduleIds] = useState<string[]>([]);
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone: 'GMT',
      weekdaySchedules: [],
      specificDateSchedules: [],
      goals: [{ name: 'Morning Session', description: 'General coaching session' }],
    },
  });

  // Initialize state with default value if no data exists
  useEffect(() => {
    if (!session) {
      const defaultGoal = { id: `new-${Date.now()}`, name: 'Morning Session', description: 'General coaching session' };
      setGoals([defaultGoal]);
      form.setValue('goals', [{ name: defaultGoal.name, description: defaultGoal.description }]);
      
      const defaultSchedule = { 
        id: `weekday-${Date.now()}`, 
        day: 'monday', 
        time: '09:00', 
        goalId: null 
      };
      setWeekdaySchedules([defaultSchedule]);
      form.setValue('weekdaySchedules', [{ day: 'monday', time: '09:00', goalId: null }]);
    }
  }, [session]);

  // Load user data from Supabase
  useEffect(() => {
    if (session?.user) {
      setIsLoading(true);
      
      // Load all data in parallel
      Promise.all([
        loadUserTimezone(),
        loadGoals(),
        loadScheduledCalls()
      ])
      .catch(error => {
        console.error('Error loading user data:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load your data',
          description: 'Please try refreshing the page'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [session]);

  // Load user timezone preference
  const loadUserTimezone = async () => {
    if (!session?.user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('timezone')
        .eq('id', session.user.id)
        .single();
        
      if (error) throw error;
      
      if (data && data.timezone) {
        setTimeZone(data.timezone);
        form.setValue('timeZone', data.timezone);
        console.log('Loaded timezone from profile:', data.timezone);
      }
    } catch (error) {
      console.error('Error loading user timezone:', error);
      // Continue with default timezone
    }
  };

  // Load existing goals
  const loadGoals = async () => {
    if (!session?.user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('id, name, description')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      console.log('Loaded goals from database:', data);
      
      if (data && data.length > 0) {
        const goalsWithDbFlag = data.map(g => ({ 
          id: g.id, 
          name: g.name, 
          description: g.description || '',
          isFromDb: true
        }));
        
        setGoals(goalsWithDbFlag);
        form.setValue('goals', goalsWithDbFlag.map(g => ({ 
          name: g.name, 
          description: g.description 
        })));
      } else {
        // Add default goal if none exists
        const defaultGoal = { id: `new-${Date.now()}`, name: 'Morning Session', description: 'General coaching session' };
        setGoals([defaultGoal]);
        form.setValue('goals', [{ name: defaultGoal.name, description: defaultGoal.description }]);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
      // Set a default goal
      const defaultGoal = { id: `new-${Date.now()}`, name: 'Morning Session', description: 'General coaching session' };
      setGoals([defaultGoal]);
      form.setValue('goals', [{ name: defaultGoal.name, description: defaultGoal.description }]);
    }
  };

  // Load existing scheduled calls
  const loadScheduledCalls = async () => {
    if (!session?.user) return;
    
    try {
      const { data, error } = await supabase
        .from('scheduled_calls')
        .select('id, weekday, specific_date, time, goal_id')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      console.log('Loaded scheduled calls from database:', data);
      
      if (data && data.length > 0) {
        const weekdayMap: Record<number, string> = {
          1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 
          5: 'friday', 6: 'saturday', 7: 'sunday'
        };
        
        // Process weekday schedules
        const weekdayData = data
          .filter(item => item.weekday !== null)
          .map(item => ({
            id: item.id,
            day: weekdayMap[item.weekday as number] || 'monday',
            time: item.time,
            goalId: item.goal_id,
            isFromDb: true
          }));
        
        // Process specific date schedules
        const dateData = data
          .filter(item => item.specific_date !== null)
          .map(item => ({
            id: item.id,
            date: new Date(item.specific_date as string),
            time: item.time,
            goalId: item.goal_id,
            isFromDb: true
          }));
        
        if (weekdayData.length > 0) {
          setWeekdaySchedules(weekdayData);
          form.setValue('weekdaySchedules', weekdayData.map(item => ({
            day: item.day,
            time: item.time,
            goalId: item.goalId
          })));
        } else {
          // Add default weekday schedule if none exists
          addWeekdaySchedule();
        }
        
        if (dateData.length > 0) {
          setSpecificDateSchedules(dateData);
          form.setValue('specificDateSchedules', dateData.map(item => ({
            date: item.date,
            time: item.time,
            goalId: item.goalId
          })));
        }
      } else {
        // Add default weekday schedule if none exists
        addWeekdaySchedule();
      }
    } catch (error) {
      console.error('Error loading scheduled calls:', error);
      // Add default weekday schedule
      addWeekdaySchedule();
    }
  };

  // Form submission handler
  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!session?.user) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please sign in to schedule calls',
      });
      navigate('/auth/sign-in');
      return;
    }
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('Form data:', formData);
      
      // 1. Save timezone to profile
      await supabase
        .from('profiles')
        .update({ timezone: formData.timeZone })
        .eq('id', session.user.id);
      
      // 2. Process goals (create, update, delete)
      const goalIds = await saveGoals(formData.goals);
      
      // 3. Process schedules (create, update, delete)
      await saveSchedules(formData.weekdaySchedules, formData.specificDateSchedules, goalIds);
      
      // Success notification
      toast({
        title: "Calls Scheduled",
        description: "Your coaching calls have been scheduled successfully!",
      });
      
      // Refresh data
      await loadGoals();
      await loadScheduledCalls();
      
      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save schedule',
        description: 'Please try again or contact support if the issue persists',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save goals to database
  const saveGoals = async (goalsData: z.infer<typeof formSchema>['goals']) => {
    if (!session?.user) return [];
    
    // Handle goal deletions first
    if (deletedGoalIds.length > 0) {
      console.log('Deleting goals with IDs:', deletedGoalIds);
      await supabase
        .from('goals')
        .delete()
        .in('id', deletedGoalIds);
      
      setDeletedGoalIds([]);
    }
    
    const goalIdsMap: Record<number, string> = {};
    
    // Process each goal (create new or update existing)
    for (let i = 0; i < goalsData.length; i++) {
      const goal = goalsData[i];
      const existingGoal = goals[i];
      
      if (!existingGoal || existingGoal.id.startsWith('new-')) {
        // Insert new goal
        const { data, error } = await supabase
          .from('goals')
          .insert({
            user_id: session.user.id,
            name: goal.name,
            description: goal.description
          })
          .select('id')
          .single();
          
        if (error) throw error;
        goalIdsMap[i] = data.id;
        console.log(`New goal inserted: ${data.id}`);
        
      } else {
        // Update existing goal
        await supabase
          .from('goals')
          .update({
            name: goal.name,
            description: goal.description
          })
          .eq('id', existingGoal.id);
        
        goalIdsMap[i] = existingGoal.id;
        console.log(`Goal updated: ${existingGoal.id}`);
      }
    }
    
    // Return array of saved goal IDs in order
    return Object.values(goalIdsMap);
  };

  // Save schedules to database
  const saveSchedules = async (
    weekdayData: z.infer<typeof formSchema>['weekdaySchedules'],
    specificDateData: z.infer<typeof formSchema>['specificDateSchedules'],
    goalIds: string[]
  ) => {
    if (!session?.user) return;
    
    // Handle schedule deletions first
    const idsToDelete = [
      ...deletedWeekdayScheduleIds,
      ...deletedSpecificDateScheduleIds
    ].filter(id => !!id && !id.startsWith('weekday-') && !id.startsWith('date-'));
    
    if (idsToDelete.length > 0) {
      console.log('Deleting scheduled calls with IDs:', idsToDelete);
      await supabase
        .from('scheduled_calls')
        .delete()
        .in('id', idsToDelete);
      
      setDeletedWeekdayScheduleIds([]);
      setDeletedSpecificDateScheduleIds([]);
    }
    
    // Map day strings to numbers for database
    const weekdayMap: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4, 
      friday: 5, saturday: 6, sunday: 7
    };
    
    // Prepare weekday schedules for upsert
    const weekdayUpserts = weekdayData.map((schedule, index) => {
      const originalSchedule = weekdaySchedules[index];
      const isFromDb = originalSchedule?.isFromDb;
      
      // Use valid goal ID or first available goal
      let goalId = schedule.goalId;
      if (!goalId || goalId === "none" || goalId.startsWith('new-')) {
        goalId = goalIds[0];
      }
      
      return {
        ...(isFromDb ? { id: originalSchedule.id } : {}),
        user_id: session.user.id,
        weekday: weekdayMap[schedule.day],
        time: schedule.time,
        goal_id: goalId,
        specific_date: null
      };
    });
    
    // Prepare specific date schedules for upsert
    const dateUpserts = specificDateData.map((schedule, index) => {
      const originalSchedule = specificDateSchedules[index];
      const isFromDb = originalSchedule?.isFromDb;
      
      // Format date as YYYY-MM-DD for Supabase
      const formattedDate = schedule.date.toISOString().split('T')[0];
      
      // Use valid goal ID or first available goal
      let goalId = schedule.goalId;
      if (!goalId || goalId === "none" || goalId.startsWith('new-')) {
        goalId = goalIds[0];
      }
      
      return {
        ...(isFromDb ? { id: originalSchedule.id } : {}),
        user_id: session.user.id,
        specific_date: formattedDate,
        time: schedule.time,
        goal_id: goalId,
        weekday: null
      };
    });
    
    // Combine and upsert all schedules
    const allSchedules = [...weekdayUpserts, ...dateUpserts];
    
    if (allSchedules.length > 0) {
      console.log('Upserting schedules:', allSchedules);
      const { error } = await supabase
        .from('scheduled_calls')
        .upsert(allSchedules);
        
      if (error) throw error;
      console.log('Schedules saved successfully');
    }
  };

  // UI Handlers for adding/removing items
  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const newSchedule: WeekdaySchedule = {
      id: newId,
      day: 'monday',
      time: '09:00',
      goalId: null
    };
    
    setWeekdaySchedules(prev => [...prev, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { 
      day: 'monday', 
      time: '09:00', 
      goalId: null 
    }]);
  };

  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const newSchedule: SpecificDateSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00',
      goalId: null
    };
    
    setSpecificDateSchedules(prev => [...prev, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { 
      date: new Date(), 
      time: '09:00', 
      goalId: null 
    }]);
  };

  const addGoal = () => {
    const newId = `new-${Date.now()}`;
    const newGoal: Goal = { 
      id: newId, 
      name: '', 
      description: '' 
    };
    
    setGoals(prev => [...prev, newGoal]);
    
    const currentGoals = form.getValues('goals') || [];
    form.setValue('goals', [...currentGoals, { 
      name: '', 
      description: '' 
    }]);
  };

  const removeWeekdaySchedule = (index: number) => {
    const schedule = weekdaySchedules[index];
    
    // Track for deletion if it's from the database
    if (schedule.isFromDb && !schedule.id.startsWith('weekday-')) {
      setDeletedWeekdayScheduleIds(prev => [...prev, schedule.id]);
    }
    
    // Update state
    setWeekdaySchedules(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Update form
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules.splice(index, 1);
    form.setValue('weekdaySchedules', currentSchedules);
  };

  const removeSpecificDateSchedule = (index: number) => {
    const schedule = specificDateSchedules[index];
    
    // Track for deletion if it's from the database
    if (schedule.isFromDb && !schedule.id.startsWith('date-')) {
      setDeletedSpecificDateScheduleIds(prev => [...prev, schedule.id]);
    }
    
    // Update state
    setSpecificDateSchedules(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Update form
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules.splice(index, 1);
    form.setValue('specificDateSchedules', currentSchedules);
  };

  const removeGoal = (index: number) => {
    if (goals.length <= 1) return; // Always keep at least one goal
    
    const goal = goals[index];
    
    // Track for deletion if it's from the database
    if (goal.isFromDb) {
      setDeletedGoalIds(prev => [...prev, goal.id]);
    }
    
    // Update references in schedules
    setWeekdaySchedules(prev => 
      prev.map(schedule => 
        schedule.goalId === goal.id ? {...schedule, goalId: null} : schedule
      )
    );
    
    setSpecificDateSchedules(prev => 
      prev.map(schedule => 
        schedule.goalId === goal.id ? {...schedule, goalId: null} : schedule
      )
    );
    
    // Update state
    setGoals(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Update form
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
  };

  // Update time display
  useEffect(() => {
    const updateTimes = () => {
      setTimeZoneWithTimes(timeZoneOptions.map(tz => ({
        ...tz,
        currentTime: getTimeInZone(tz.timeZone)
      })));
    };
    
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

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
                    value={field.value}
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
                            setWeekdaySchedules(prev => {
                              const updated = [...prev];
                              updated[index] = {...updated[index], day: value};
                              return updated;
                            });
                          }}
                          value={field.value}
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
                            setWeekdaySchedules(prev => {
                              const updated = [...prev];
                              updated[index] = {...updated[index], time: value};
                              return updated;
                            });
                          }}
                          value={field.value}
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
                    name={`weekdaySchedules.${index}.goalId`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <Select 
                          onValueChange={(value) => {
                            const goalIdValue = value === "none" ? null : value;
                            field.onChange(goalIdValue);
                            setWeekdaySchedules(prev => {
                              const updated = [...prev];
                              updated[index] = {...updated[index], goalId: goalIdValue};
                              return updated;
                            });
                          }}
                          value={field.value || "none"}
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
                  onClick={() => removeWeekdaySchedule(index)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
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
                                if (date) {
                                  field.onChange(date);
                                  setSpecificDateSchedules(prev => {
                                    const updated = [...prev];
                                    updated[index] = {...updated[index], date};
                                    return updated;
                                  });
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
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
                            setSpecificDateSchedules(prev => {
                              const updated = [...prev];
                              updated[index] = {...updated[index], time: value};
                              return updated;
                            });
                          }}
                          value={field.value}
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
                            const goalIdValue = value === "none" ? null : value;
                            field.onChange(goalIdValue);
                            setSpecificDateSchedules(prev => {
                              const updated = [...prev];
                              updated[index] = {...updated[index], goalId: goalIdValue};
                              return updated;
                            });
                          }}
                          value={field.value || "none"}
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
              className="flex items-center gap-1"
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
                              setGoals(prev => {
                                const updated = [...prev];
                                updated[index] = {...updated[index], name: e.target.value};
                                return updated;
                              });
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
                              setGoals(prev => {
                                const updated = [...prev];
                                updated[index] = {...updated[index], description: e.target.value};
                                return updated;
                              });
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
