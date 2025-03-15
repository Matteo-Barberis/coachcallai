import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Globe, Plus, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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

// Define types for schedule entries
type WeekdaySchedule = {
  id: string;
  day: string;
  time: string;
  goalId: string | null;
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
  goalId: string | null;
};

type GoalItem = {
  id: string;
  name: string;
  description: string;
};

// Form schema
const formSchema = z.object({
  timeZone: z.string().default('UTC'),
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

// Days of the week
const dayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

// Generate time options in 30-minute intervals
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

// Time zones - a selection of common time zones
const timeZoneOptions = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'GMT/BST (UK)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

const ScheduleCall = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Local state for managing entries
  const [weekdaySchedules, setWeekdaySchedules] = useState<WeekdaySchedule[]>([]);
  const [specificDateSchedules, setSpecificDateSchedules] = useState<SpecificDateSchedule[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([{ id: '1', name: 'Morning Session', description: '' }]);
  const [timeZone, setTimeZone] = useState('UTC');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone: 'UTC',
      weekdaySchedules: [],
      specificDateSchedules: [],
      goals: [{ name: 'Morning Session', description: '' }],
    },
  });

  // Add a new weekday schedule
  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const newSchedule: WeekdaySchedule = {
      id: newId,
      day: 'monday',
      time: '09:00',
      goalId: null
    };
    
    setWeekdaySchedules([...weekdaySchedules, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { day: 'monday', time: '09:00', goalId: null }]);
  };

  // Add a specific date schedule
  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const newSchedule: SpecificDateSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00',
      goalId: null
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { date: new Date(), time: '09:00', goalId: null }]);
  };

  // Add a new goal
  const addGoal = () => {
    const newId = `goal-${Date.now()}`;
    setGoals([...goals, { id: newId, name: '', description: '' }]);
    
    const currentGoals = form.getValues('goals') || [];
    form.setValue('goals', [...currentGoals, { name: '', description: '' }]);
  };

  // Remove a weekday schedule
  const removeWeekdaySchedule = (index: number) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules.splice(index, 1);
    setWeekdaySchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules.splice(index, 1);
    form.setValue('weekdaySchedules', currentSchedules);
  };

  // Remove a specific date schedule
  const removeSpecificDateSchedule = (index: number) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules.splice(index, 1);
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules.splice(index, 1);
    form.setValue('specificDateSchedules', currentSchedules);
  };

  // Remove a goal
  const removeGoal = (index: number) => {
    if (goals.length <= 1) return; // Keep at least one goal
    
    const updatedGoals = [...goals];
    const removedGoalId = updatedGoals[index].id;
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
    
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
    
    // Remove references to the deleted goal from schedules
    const updatedWeekdaySchedules = weekdaySchedules.map(schedule => {
      if (schedule.goalId === removedGoalId) {
        return { ...schedule, goalId: null };
      }
      return schedule;
    });
    setWeekdaySchedules(updatedWeekdaySchedules);
    
    const updatedSpecificDateSchedules = specificDateSchedules.map(schedule => {
      if (schedule.goalId === removedGoalId) {
        return { ...schedule, goalId: null };
      }
      return schedule;
    });
    setSpecificDateSchedules(updatedSpecificDateSchedules);
  };

  // Set goal for a weekday schedule
  const setWeekdayScheduleGoal = (index: number, goalId: string | null) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[index].goalId = goalId;
    setWeekdaySchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules[index].goalId = goalId;
    form.setValue('weekdaySchedules', currentSchedules);
  };

  // Set goal for a specific date schedule
  const setSpecificDateScheduleGoal = (index: number, goalId: string | null) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[index].goalId = goalId;
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules[index].goalId = goalId;
    form.setValue('specificDateSchedules', currentSchedules);
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form data:', data);
    
    toast({
      title: "Calls Scheduled",
      description: "Your coaching calls have been scheduled successfully!",
    });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  // Initialize with one weekday schedule if empty
  React.useEffect(() => {
    if (weekdaySchedules.length === 0) {
      addWeekdaySchedule();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Weekday Schedules */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Weekly Schedule</FormLabel>
            
            {/* Time Zone Dropdown */}
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>Time Zone:</span>
                  </div>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTimeZone(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeZoneOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            Select which days of the week you want to have coaching calls and assign goals to each session.
          </FormDescription>
          
          <div className="space-y-3">
            {weekdaySchedules.map((schedule, index) => (
              <div key={schedule.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                  {/* Day Selection */}
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

                  {/* Time Selection */}
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
                          defaultValue={schedule.time}
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
                  
                  {/* Goal Selection */}
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

                {/* Delete button */}
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
                  {/* Date Selection */}
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

                  {/* Time Selection */}
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
                          defaultValue={schedule.time}
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
                  
                  {/* Goal Selection */}
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

                {/* Delete button */}
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

        {/* Goals Definition */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Define Your Coaching Goals</FormLabel>
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
          <FormDescription>
            Define goals for your coaching sessions. You'll be able to assign these goals to specific time slots.
          </FormDescription>
          
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
                  {/* Goal Name */}
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
                  
                  {/* Goal Description */}
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
        </div>

        <Button type="submit" className="w-full">Schedule Calls</Button>
      </form>
    </Form>
  );
};

export default ScheduleCall;
