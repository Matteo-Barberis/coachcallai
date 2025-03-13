
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Info, Plus, Trash2, X } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Define types for schedule entries
type WeekdaySchedule = {
  id: string;
  day: string;
  time: string;
  selectedGoalIds: string[];
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
  selectedGoalIds: string[];
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
      time: z.string(),
      selectedGoalIds: z.array(z.string()).optional()
    })
  ),
  specificDateSchedules: z.array(
    z.object({
      date: z.date(),
      time: z.string(),
      selectedGoalIds: z.array(z.string()).optional()
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
  const [activeTab, setActiveTab] = useState<'goals' | 'weeklySchedule' | 'specificDates'>('goals');
  
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
      time: '09:00',
      selectedGoalIds: []
    };
    
    setWeekdaySchedules([...weekdaySchedules, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { day: 'monday', time: '09:00', selectedGoalIds: [] }]);
  };

  // Add a specific date schedule
  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const newSchedule: SpecificDateSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00',
      selectedGoalIds: []
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { date: new Date(), time: '09:00', selectedGoalIds: [] }]);
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
    const removedGoalId = updatedGoals[index].id;
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
    
    // Remove this goal from any schedules that reference it
    setWeekdaySchedules(weekdaySchedules.map(schedule => ({
      ...schedule,
      selectedGoalIds: schedule.selectedGoalIds.filter(id => id !== removedGoalId)
    })));
    
    setSpecificDateSchedules(specificDateSchedules.map(schedule => ({
      ...schedule,
      selectedGoalIds: schedule.selectedGoalIds.filter(id => id !== removedGoalId)
    })));
    
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
    
    // Update the form values for schedules too
    form.setValue('weekdaySchedules', weekdaySchedules.map(schedule => ({
      day: schedule.day,
      time: schedule.time,
      selectedGoalIds: schedule.selectedGoalIds.filter(id => id !== removedGoalId)
    })));
    
    form.setValue('specificDateSchedules', specificDateSchedules.map(schedule => ({
      date: schedule.date,
      time: schedule.time,
      selectedGoalIds: schedule.selectedGoalIds.filter(id => id !== removedGoalId)
    })));
  };
  
  // Toggle goal selection for a schedule
  const toggleGoalForWeekdaySchedule = (scheduleIndex: number, goalId: string) => {
    const updatedSchedules = [...weekdaySchedules];
    const schedule = updatedSchedules[scheduleIndex];
    
    if (schedule.selectedGoalIds.includes(goalId)) {
      schedule.selectedGoalIds = schedule.selectedGoalIds.filter(id => id !== goalId);
    } else {
      schedule.selectedGoalIds = [...schedule.selectedGoalIds, goalId];
    }
    
    setWeekdaySchedules(updatedSchedules);
    
    // Update the form value
    const formSchedules = form.getValues('weekdaySchedules');
    if (formSchedules[scheduleIndex]) {
      formSchedules[scheduleIndex].selectedGoalIds = schedule.selectedGoalIds;
      form.setValue('weekdaySchedules', formSchedules);
    }
  };
  
  // Toggle goal selection for a specific date schedule
  const toggleGoalForSpecificDateSchedule = (scheduleIndex: number, goalId: string) => {
    const updatedSchedules = [...specificDateSchedules];
    const schedule = updatedSchedules[scheduleIndex];
    
    if (schedule.selectedGoalIds.includes(goalId)) {
      schedule.selectedGoalIds = schedule.selectedGoalIds.filter(id => id !== goalId);
    } else {
      schedule.selectedGoalIds = [...schedule.selectedGoalIds, goalId];
    }
    
    setSpecificDateSchedules(updatedSchedules);
    
    // Update the form value
    const formSchedules = form.getValues('specificDateSchedules');
    if (formSchedules[scheduleIndex]) {
      formSchedules[scheduleIndex].selectedGoalIds = schedule.selectedGoalIds;
      form.setValue('specificDateSchedules', formSchedules);
    }
  };

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form data:', data);
    
    // Enhanced data with goal assignments
    const enhancedData = {
      ...data,
      weekdaySchedules: data.weekdaySchedules.map((schedule, index) => ({
        ...schedule,
        selectedGoalIds: weekdaySchedules[index]?.selectedGoalIds || []
      })),
      specificDateSchedules: data.specificDateSchedules.map((schedule, index) => ({
        ...schedule,
        selectedGoalIds: specificDateSchedules[index]?.selectedGoalIds || []
      }))
    };
    
    console.log('Enhanced data with goal assignments:', enhancedData);
    
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

  // Navigate between form sections
  const goToNextTab = () => {
    if (activeTab === 'goals') {
      setActiveTab('weeklySchedule');
    } else if (activeTab === 'weeklySchedule') {
      setActiveTab('specificDates');
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === 'specificDates') {
      setActiveTab('weeklySchedule');
    } else if (activeTab === 'weeklySchedule') {
      setActiveTab('goals');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Step indicators */}
        <div className="flex justify-between mb-6">
          <div 
            className={cn(
              "flex flex-col items-center cursor-pointer",
              activeTab === 'goals' ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('goals')}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1",
              activeTab === 'goals' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              1
            </div>
            <span className="text-sm font-medium">Define Goals</span>
          </div>
          
          <div className="border-t border-gray-200 flex-1 self-center mx-2"></div>
          
          <div 
            className={cn(
              "flex flex-col items-center cursor-pointer",
              activeTab === 'weeklySchedule' ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('weeklySchedule')}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1",
              activeTab === 'weeklySchedule' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              2
            </div>
            <span className="text-sm font-medium">Weekly Schedule</span>
          </div>
          
          <div className="border-t border-gray-200 flex-1 self-center mx-2"></div>
          
          <div 
            className={cn(
              "flex flex-col items-center cursor-pointer",
              activeTab === 'specificDates' ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('specificDates')}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-1",
              activeTab === 'specificDates' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              3
            </div>
            <span className="text-sm font-medium">Specific Dates</span>
          </div>
        </div>

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

        {/* Step 1: Goals Definition */}
        {activeTab === 'goals' && (
          <Card>
            <CardHeader>
              <CardTitle>Define Your Coaching Goals</CardTitle>
              <CardDescription>
                Create goals that you want to achieve through your coaching calls. You'll be able to assign these goals to specific sessions later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
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
                              onChange={(e) => {
                                field.onChange(e);
                                const updatedGoals = [...goals];
                                updatedGoals[index].description = e.target.value;
                                setGoals(updatedGoals);
                              }}
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
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addGoal}
                  className="flex items-center gap-1 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Goal
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={goToNextTab}
                  disabled={goals.some(goal => !goal.description.trim())}
                >
                  Next: Set Weekly Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Weekly Schedule */}
        {activeTab === 'weeklySchedule' && (
          <Card>
            <CardHeader>
              <CardTitle>Set Your Weekly Schedule</CardTitle>
              <CardDescription>
                Choose which days of the week you want to have coaching calls and assign goals to each session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {weekdaySchedules.map((schedule, scheduleIndex) => (
                  <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Day Selection */}
                      <FormField
                        control={form.control}
                        name={`weekdaySchedules.${scheduleIndex}.day`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const updated = [...weekdaySchedules];
                                updated[scheduleIndex].day = value;
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
                        name={`weekdaySchedules.${scheduleIndex}.time`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const updated = [...weekdaySchedules];
                                updated[scheduleIndex].time = value;
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
                        onClick={() => removeWeekdaySchedule(scheduleIndex)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Goal selection for this schedule */}
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Assign Goals to This Session</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Select which goals you want to focus on during this session</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {goals.map((goal) => (
                          <div key={goal.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`goal-${schedule.id}-${goal.id}`}
                              checked={schedule.selectedGoalIds.includes(goal.id)}
                              onCheckedChange={() => toggleGoalForWeekdaySchedule(scheduleIndex, goal.id)}
                            />
                            <label 
                              htmlFor={`goal-${schedule.id}-${goal.id}`}
                              className="text-sm leading-tight cursor-pointer"
                            >
                              {goal.description}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
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
                Add Weekday Session
              </Button>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousTab}
                >
                  Back: Edit Goals
                </Button>
                <Button 
                  type="button" 
                  onClick={goToNextTab}
                >
                  Next: Set Specific Dates
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Specific Dates */}
        {activeTab === 'specificDates' && (
          <Card>
            <CardHeader>
              <CardTitle>Set Specific Date Sessions</CardTitle>
              <CardDescription>
                Add calls for specific dates if you have important events coming up and assign relevant goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {specificDateSchedules.map((schedule, scheduleIndex) => (
                  <div key={schedule.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                    <div className="flex items-center gap-3">
                      {/* Date Selection */}
                      <FormField
                        control={form.control}
                        name={`specificDateSchedules.${scheduleIndex}.date`}
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
                                      updated[scheduleIndex].date = date;
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
                        name={`specificDateSchedules.${scheduleIndex}.time`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select 
                              onValueChange={(value) => {
                                field.onChange(value);
                                const updated = [...specificDateSchedules];
                                updated[scheduleIndex].time = value;
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
                        onClick={() => removeSpecificDateSchedule(scheduleIndex)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Goal selection for this schedule */}
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Assign Goals to This Session</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px] text-xs">Select which goals you want to focus on during this specific session</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {goals.map((goal) => (
                          <div key={goal.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`goal-${schedule.id}-${goal.id}`}
                              checked={schedule.selectedGoalIds.includes(goal.id)}
                              onCheckedChange={() => toggleGoalForSpecificDateSchedule(scheduleIndex, goal.id)}
                            />
                            <label 
                              htmlFor={`goal-${schedule.id}-${goal.id}`}
                              className="text-sm leading-tight cursor-pointer"
                            >
                              {goal.description}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
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
                Add Specific Date
              </Button>
              
              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousTab}
                >
                  Back: Weekly Schedule
                </Button>
                <Button type="submit">Schedule All Calls</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Only show submit button on the last step */}
        {activeTab !== 'specificDates' ? null : (
          <Button type="submit" className="w-full mt-6">Schedule All Calls</Button>
        )}
      </form>
    </Form>
  );
};

export default ScheduleCall;
