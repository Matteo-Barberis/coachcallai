
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckIcon, PlusCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Days of the week for recurring calls
const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

// Time slots
const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [
    { value: `${hour}:00`, label: `${hour}:00` },
    { value: `${hour}:30`, label: `${hour}:30` },
  ];
}).flat();

// Form schema
const formSchema = z.object({
  scheduleType: z.enum(['recurring', 'specific']),
  recurring: z.object({
    days: z.array(z.string()).min(1, 'Select at least one day'),
    time: z.string().min(1, 'Select a time')
  }).optional(),
  specific: z.object({
    date: z.date().optional(),
    time: z.string().optional()
  }).optional(),
  goals: z.array(z.object({
    description: z.string().min(3, 'Goal description must be at least 3 characters')
  })).min(1, 'Add at least one goal'),
  callDuration: z.string().min(1, 'Select call duration')
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleCall = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([{ description: '' }]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduleType: 'recurring',
      recurring: {
        days: [],
        time: ''
      },
      specific: {
        date: undefined,
        time: ''
      },
      goals: [{ description: '' }],
      callDuration: '30'
    },
  });

  // Watch the schedule type to conditionally render fields
  const scheduleType = form.watch('scheduleType');

  // Add a new goal field
  const addGoal = () => {
    setGoals([...goals, { description: '' }]);
    const currentGoals = form.getValues('goals') || [];
    form.setValue('goals', [...currentGoals, { description: '' }]);
  };

  // Remove a goal field
  const removeGoal = (index: number) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
    
    const currentGoals = form.getValues('goals');
    currentGoals.splice(index, 1);
    form.setValue('goals', currentGoals);
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    
    // In a real app, you would save this data to your backend
    // For now, we'll just show a success message and redirect
    
    toast({
      title: "Calls Scheduled",
      description: "Your coaching calls have been scheduled successfully!",
    });
    
    // Redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Schedule Type Selection */}
        <FormField
          control={form.control}
          name="scheduleType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Schedule Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recurring" id="recurring" />
                    <label htmlFor="recurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Recurring Weekly Calls
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />
                    <label htmlFor="specific" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Specific Date Call
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recurring Schedule Fields */}
        {scheduleType === 'recurring' && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="recurring.days"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Days</FormLabel>
                    <FormDescription>
                      Choose which days of the week you want to schedule your calls
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="recurring.days"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection for Recurring Calls */}
            <FormField
              control={form.control}
              name="recurring.time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time for your calls" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This is the time when your calls will start on your selected days
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Specific Date Fields */}
        {scheduleType === 'specific' && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="specific.date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a specific date for your coaching call
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection for Specific Date */}
            <FormField
              control={form.control}
              name="specific.time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time for your call" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This is the time when your call will start on the selected date
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Call Duration */}
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
                How long would you like your coaching calls to be
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <PlusCircle className="h-4 w-4" />
              Add Goal
            </Button>
          </div>
          <FormDescription>
            What do you want to achieve with these coaching calls? Add goals to discuss during your sessions.
          </FormDescription>
          
          {goals.map((goal, index) => (
            <FormField
              key={index}
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
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeGoal(index)}
                        className="mt-2"
                      >
                        Remove
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
