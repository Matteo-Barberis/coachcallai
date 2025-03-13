
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, Trash2, X } from 'lucide-react';
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
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
};

type GoalItem = {
  id: string;
  description: string;
};

// Form schema
const formSchema = z.object({
  weekdaySchedules: z.array(
    z.object({
      day: z.string(),
      time: z.string()
    })
  ),
  specificDateSchedules: z.array(
    z.object({
      date: z.date(),
      time: z.string()
    })
  ),
  goals: z.array(
    z.object({
      description: z.string().min(3, 'Goal description must be at least 3 characters')
    })
  ).min(1, 'Add at least one goal'),
  callDuration: z.string().min(1, 'Select call duration')
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

const ScheduleCall = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Local state for managing entries
  const [weekdaySchedules, setWeekdaySchedules] = useState<WeekdaySchedule[]>([]);
  const [specificDateSchedules, setSpecificDateSchedules] = useState<SpecificDateSchedule[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([{ id: '1', description: '' }]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekdaySchedules: [],
      specificDateSchedules: [],
      goals: [{ description: '' }],
      callDuration: '30'
    },
  });

  // Add a new weekday schedule
  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const newSchedule: WeekdaySchedule = {
      id: newId,
      day: 'monday',
      time: '09:00'
    };
    
    setWeekdaySchedules([...weekdaySchedules, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { day: 'monday', time: '09:00' }]);
  };

  // Add a specific date schedule
  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const newSchedule: SpecificDateSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00'
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { date: new Date(), time: '09:00' }]);
  };

  // Add a new goal
  const addGoal = () => {
    const newId = `goal-${Date.now()}`;
    setGoals([...goals, { id: newId, description: '' }]);
    
    const currentGoals = form.getValues('goals') || [];
    form.setValue('goals', [...currentGoals, { description: '' }]);
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
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
    
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
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
        {/* Call Duration - Global Setting */}
        <FormField
          control={form.control}
          name="callDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Call Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select call duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                All your coaching calls will be this duration
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weekday Schedules */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Weekly Schedule</FormLabel>
          </div>
          <FormDescription>
            Select which days of the week you want to have coaching calls.
          </FormDescription>
          
          <div className="space-y-3">
            {weekdaySchedules.map((schedule, index) => (
              <div key={schedule.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {/* Day Selection */}
                <FormField
                  control={form.control}
                  name={`weekdaySchedules.${index}.day`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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
        </div>

        {/* Specific Date Schedules */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Specific Date Schedule</FormLabel>
          </div>
          <FormDescription>
            Add calls for specific dates if you have important events coming up.
          </FormDescription>
          
          <div className="space-y-3">
            {specificDateSchedules.map((schedule, index) => (
              <div key={schedule.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {/* Date Selection */}
                <FormField
                  control={form.control}
                  name={`specificDateSchedules.${index}.date`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
                    <FormItem className="flex-1">
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

        {/* Goals */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Goals for Your Coaching Calls</FormLabel>
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
            What do you want to achieve with these coaching calls? Add goals to discuss during your sessions.
          </FormDescription>
          
          {goals.map((goal, index) => (
            <FormField
              key={goal.id}
              control={form.control}
              name={`goals.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="Describe your goal..."
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    {goals.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeGoal(index)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full">Schedule Calls</Button>
      </form>
    </Form>
  );
};

export default ScheduleCall;
