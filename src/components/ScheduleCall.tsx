
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, Trash2, X, Copy, Save } from 'lucide-react';
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
import ScheduleGoals, { GoalItem } from './ScheduleGoals';

// Define types for schedule entries
type WeekdaySchedule = {
  id: string;
  day: string;
  time: string;
  useCustomGoals: boolean;
  goals: GoalItem[];
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
  useCustomGoals: boolean;
  goals: GoalItem[];
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
  defaultGoals: z.array(
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
  const [defaultGoals, setDefaultGoals] = useState<GoalItem[]>([{ id: '1', description: '' }]);
  
  const form = useFormProvider<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weekdaySchedules: [],
      specificDateSchedules: [],
      defaultGoals: [{ description: '' }],
      callDuration: '30'
    },
  });

  // Add a new weekday schedule
  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const newSchedule: WeekdaySchedule = {
      id: newId,
      day: 'monday',
      time: '09:00',
      useCustomGoals: false,
      goals: []
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
      time: '09:00',
      useCustomGoals: false,
      goals: []
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { date: new Date(), time: '09:00' }]);
  };

  // Add a new default goal
  const addDefaultGoal = () => {
    const newId = `goal-${Date.now()}`;
    setDefaultGoals([...defaultGoals, { id: newId, description: '' }]);
    
    const currentGoals = form.getValues('defaultGoals') || [];
    form.setValue('defaultGoals', [...currentGoals, { description: '' }]);
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

  // Remove a default goal
  const removeDefaultGoal = (index: number) => {
    if (defaultGoals.length <= 1) return; // Keep at least one goal
    
    const updatedGoals = [...defaultGoals];
    updatedGoals.splice(index, 1);
    setDefaultGoals(updatedGoals);
    
    const currentGoals = form.getValues('defaultGoals');
    currentGoals.splice(index, 1);
    form.setValue('defaultGoals', currentGoals);
  };

  // Toggle custom goals for a weekday schedule
  const toggleWeekdayCustomGoals = (index: number) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[index].useCustomGoals = !updatedSchedules[index].useCustomGoals;
    
    // Initialize with copy of default goals if enabling custom goals and none exist
    if (updatedSchedules[index].useCustomGoals && updatedSchedules[index].goals.length === 0) {
      updatedSchedules[index].goals = defaultGoals.map(goal => ({
        id: `custom-${Date.now()}-${Math.random()}`,
        description: goal.description
      }));
    }
    
    setWeekdaySchedules(updatedSchedules);
  };

  // Toggle custom goals for a specific date schedule
  const toggleSpecificDateCustomGoals = (index: number) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[index].useCustomGoals = !updatedSchedules[index].useCustomGoals;
    
    // Initialize with copy of default goals if enabling custom goals and none exist
    if (updatedSchedules[index].useCustomGoals && updatedSchedules[index].goals.length === 0) {
      updatedSchedules[index].goals = defaultGoals.map(goal => ({
        id: `custom-${Date.now()}-${Math.random()}`,
        description: goal.description
      }));
    }
    
    setSpecificDateSchedules(updatedSchedules);
  };

  // Add a custom goal to a weekday schedule
  const addWeekdayCustomGoal = (index: number) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[index].goals.push({
      id: `custom-${Date.now()}-${Math.random()}`,
      description: ''
    });
    setWeekdaySchedules(updatedSchedules);
  };

  // Add a custom goal to a specific date schedule
  const addSpecificDateCustomGoal = (index: number) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[index].goals.push({
      id: `custom-${Date.now()}-${Math.random()}`,
      description: ''
    });
    setSpecificDateSchedules(updatedSchedules);
  };

  // Remove a custom goal from a weekday schedule
  const removeWeekdayCustomGoal = (scheduleIndex: number, goalIndex: number) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[scheduleIndex].goals.splice(goalIndex, 1);
    setWeekdaySchedules(updatedSchedules);
  };

  // Remove a custom goal from a specific date schedule
  const removeSpecificDateCustomGoal = (scheduleIndex: number, goalIndex: number) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[scheduleIndex].goals.splice(goalIndex, 1);
    setSpecificDateSchedules(updatedSchedules);
  };

  // Update a custom goal for a weekday schedule
  const updateWeekdayCustomGoal = (scheduleIndex: number, goalIndex: number, value: string) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[scheduleIndex].goals[goalIndex].description = value;
    setWeekdaySchedules(updatedSchedules);
  };

  // Update a custom goal for a specific date schedule
  const updateSpecificDateCustomGoal = (scheduleIndex: number, goalIndex: number, value: string) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[scheduleIndex].goals[goalIndex].description = value;
    setSpecificDateSchedules(updatedSchedules);
  };

  // Save the current default goals as a template
  const saveDefaultGoalsAsTemplate = () => {
    // In a real app, you'd save this to localStorage or a database
    toast({
      title: "Goals Template Saved",
      description: "Your goals template has been saved for future use.",
    });
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Process the schedule data with their associated goals (default or custom)
    const processedData = {
      ...data,
      weekdaySchedules: weekdaySchedules.map(schedule => ({
        day: schedule.day,
        time: schedule.time,
        goals: schedule.useCustomGoals ? schedule.goals.map(g => g.description) : defaultGoals.map(g => g.description)
      })),
      specificDateSchedules: specificDateSchedules.map(schedule => ({
        date: schedule.date,
        time: schedule.time,
        goals: schedule.useCustomGoals ? schedule.goals.map(g => g.description) : defaultGoals.map(g => g.description)
      }))
    };
    
    console.log('Processed form data:', processedData);
    
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
    <FormProvider {...form}>
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

        {/* Default Goals Section */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Default Goals for All Sessions</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveDefaultGoalsAsTemplate}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save as template
            </Button>
          </div>
          <FormDescription>
            These goals will apply to all your coaching sessions unless you specify custom goals for a specific session.
          </FormDescription>
          
          {defaultGoals.map((goal, index) => (
            <FormField
              key={goal.id}
              control={form.control}
              name={`defaultGoals.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl className="flex-1">
                      <Textarea
                        placeholder="Describe your goal..."
                        {...field}
                        className="resize-none"
                        onChange={(e) => {
                          field.onChange(e);
                          const updatedGoals = [...defaultGoals];
                          updatedGoals[index].description = e.target.value;
                          setDefaultGoals(updatedGoals);
                        }}
                      />
                    </FormControl>
                    {defaultGoals.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeDefaultGoal(index)}
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
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDefaultGoal}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add default goal
          </Button>
        </div>

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
              <div key={schedule.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
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
                
                {/* Goals Section for this schedule */}
                <ScheduleGoals
                  scheduleType="weekday"
                  scheduleIndex={index}
                  customGoalsEnabled={schedule.useCustomGoals}
                  onToggleCustomGoals={() => toggleWeekdayCustomGoals(index)}
                  defaultGoals={defaultGoals}
                  customGoals={schedule.goals}
                  onAddCustomGoal={() => addWeekdayCustomGoal(index)}
                  onRemoveCustomGoal={(goalIndex) => removeWeekdayCustomGoal(index, goalIndex)}
                  onUpdateCustomGoal={(goalIndex, value) => updateWeekdayCustomGoal(index, goalIndex, value)}
                />
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
              <div key={schedule.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
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
                
                {/* Goals Section for this schedule */}
                <ScheduleGoals
                  scheduleType="specific"
                  scheduleIndex={index}
                  customGoalsEnabled={schedule.useCustomGoals}
                  onToggleCustomGoals={() => toggleSpecificDateCustomGoals(index)}
                  defaultGoals={defaultGoals}
                  customGoals={schedule.goals}
                  onAddCustomGoal={() => addSpecificDateCustomGoal(index)}
                  onRemoveCustomGoal={(goalIndex) => removeSpecificDateCustomGoal(index, goalIndex)}
                  onUpdateCustomGoal={(goalIndex, value) => updateSpecificDateCustomGoal(index, goalIndex, value)}
                />
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

        <Button type="submit" className="w-full">Schedule Calls</Button>
      </form>
    </FormProvider>
  );
};

export default ScheduleCall;
