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
import { UserObjective } from '@/types/supabase';

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

type Template = {
  id: string;
  name: string;
  description: string;
};

type WeekdaySchedule = {
  id: string;
  day: string;
  time: string;
  templateId: string | null;
  isFromDb?: boolean;
};

type SpecificDateSchedule = {
  id: string;
  date: Date;
  time: string;
  templateId: string | null;
  isFromDb?: boolean;
};

const formSchema = z.object({
  timeZone: z.string().default('GMT'),
  weekdaySchedules: z.array(
    z.object({
      day: z.string(),
      time: z.string(),
      templateId: z.string().refine(val => val !== "none" && val !== null, {
        message: "Please select a template for this schedule"
      })
    })
  ),
  specificDateSchedules: z.array(
    z.object({
      date: z.date(),
      time: z.string(),
      templateId: z.string().refine(val => val !== "none" && val !== null, {
        message: "Please select a template for this schedule"
      })
    })
  ),
  objectives: z.string().min(3, 'Please provide at least 3 characters for your objectives')
});

const dayOptions = [
  { value: 'monday', label: 'Monday', weekdayNum: 1 },
  { value: 'tuesday', label: 'Tuesday', weekdayNum: 2 },
  { value: 'wednesday', label: 'Wednesday', weekdayNum: 3 },
  { value: 'thursday', label: 'Thursday', weekdayNum: 4 },
  { value: 'friday', label: 'Friday', weekdayNum: 5 },
  { value: 'saturday', label: 'Saturday', weekdayNum: 6 },
  { value: 'sunday', label: 'Sunday', weekdayNum: 0 },
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

interface ScheduleCallProps {
  hideObjectives?: boolean;
}

const ScheduleCall = ({ hideObjectives = false }: ScheduleCallProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session } = useSessionContext();
  
  const [weekdaySchedules, setWeekdaySchedules] = useState<WeekdaySchedule[]>([]);
  const [specificDateSchedules, setSpecificDateSchedules] = useState<SpecificDateSchedule[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [userObjectives, setUserObjectives] = useState('');
  const [timeZone, setTimeZone] = useState('GMT');
  const [timeZoneWithTimes, setTimeZoneWithTimes] = useState(timeZoneOptions.map(tz => ({
    ...tz,
    currentTime: getTimeInZone(tz.timeZone)
  })));
  
  const [deletedWeekdayScheduleIds, setDeletedWeekdayScheduleIds] = useState<string[]>([]);
  const [deletedSpecificDateScheduleIds, setDeletedSpecificDateScheduleIds] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone: 'GMT',
      weekdaySchedules: [],
      specificDateSchedules: [],
      objectives: ''
    },
  });

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('id, name, description');
      
      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error in fetchTemplates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserObjectives = async () => {
    if (!session?.user?.id || hideObjectives) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('objectives')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user objectives:', error);
        return;
      }
      
      if (data) {
        setUserObjectives(data.objectives || '');
        form.setValue('objectives', data.objectives || '');
      }
    } catch (error) {
      console.error('Error in fetchUserObjectives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data: weekdayData, error: weekdayError } = await supabase
        .from('scheduled_calls')
        .select('id, weekday, time, template_id')
        .eq('user_id', session.user.id)
        .not('weekday', 'is', null);
      
      if (weekdayError) {
        console.error('Error fetching weekday schedules:', weekdayError);
      } else if (weekdayData && weekdayData.length > 0) {
        const weekdaySchedulesFromDb = weekdayData.map((schedule) => {
          const weekdayNum = schedule.weekday;
          const dayOption = dayOptions.find(day => day.weekdayNum === weekdayNum);
          const dayString = dayOption ? dayOption.value : 'monday';
          
          let timeValue = schedule.time;
          if (typeof timeValue === 'string' && timeValue.includes(':')) {
            const timeParts = timeValue.split(':');
            if (timeParts.length >= 2) {
              timeValue = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
            }
          }
          
          return {
            id: schedule.id,
            day: dayString,
            time: timeValue,
            templateId: schedule.template_id,
            isFromDb: true
          };
        });
        
        setWeekdaySchedules(weekdaySchedulesFromDb);
        
        form.setValue('weekdaySchedules', weekdaySchedulesFromDb.map(({ day, time, templateId }) => ({ 
          day, 
          time, 
          templateId: templateId || templates[0]?.id || ""
        })));
      }
      
      const { data: dateData, error: dateError } = await supabase
        .from('scheduled_calls')
        .select('id, specific_date, time, template_id')
        .eq('user_id', session.user.id)
        .not('specific_date', 'is', null);
      
      if (dateError) {
        console.error('Error fetching specific date schedules:', dateError);
      } else if (dateData && dateData.length > 0) {
        const specificDateSchedulesFromDb = dateData.map((schedule) => {
          let timeValue = schedule.time;
          if (typeof timeValue === 'string' && timeValue.includes(':')) {
            const timeParts = timeValue.split(':');
            if (timeParts.length >= 2) {
              timeValue = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
            }
          }
          
          return {
            id: schedule.id,
            date: new Date(schedule.specific_date),
            time: timeValue,
            templateId: schedule.template_id,
            isFromDb: true
          };
        });
        
        setSpecificDateSchedules(specificDateSchedulesFromDb);
        
        form.setValue('specificDateSchedules', specificDateSchedulesFromDb.map(({ date, time, templateId }) => ({ 
          date, 
          time, 
          templateId: templateId || templates[0]?.id || ""
        })));
      }
    } catch (error) {
      console.error('Error in fetchSchedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates().then(() => {
      fetchUserObjectives();
      fetchSchedules();
    });
  }, [session]);

  const addWeekdaySchedule = () => {
    const newId = `weekday-${Date.now()}`;
    const defaultTemplateId = templates.length > 0 ? templates[0].id : null;
    
    const newSchedule = {
      id: newId,
      day: 'monday',
      time: '09:00',
      templateId: defaultTemplateId,
      isFromDb: false
    };
    
    setWeekdaySchedules([...weekdaySchedules, newSchedule]);
    
    const currentSchedules = form.getValues('weekdaySchedules') || [];
    form.setValue('weekdaySchedules', [...currentSchedules, { 
      day: 'monday', 
      time: '09:00', 
      templateId: defaultTemplateId || "" 
    }]);
  };

  const removeWeekdaySchedule = (index: number) => {
    const scheduleToRemove = weekdaySchedules[index];
    const updatedSchedules = [...weekdaySchedules];
    
    if (scheduleToRemove.isFromDb) {
      setDeletedWeekdayScheduleIds([...deletedWeekdayScheduleIds, scheduleToRemove.id]);
    }
    
    updatedSchedules.splice(index, 1);
    setWeekdaySchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules.splice(index, 1);
    form.setValue('weekdaySchedules', currentSchedules);
  };

  const addSpecificDateSchedule = () => {
    const newId = `date-${Date.now()}`;
    const defaultTemplateId = templates.length > 0 ? templates[0].id : null;
    
    const newSchedule = {
      id: newId,
      date: new Date(),
      time: '09:00',
      templateId: defaultTemplateId,
      isFromDb: false
    };
    
    setSpecificDateSchedules([...specificDateSchedules, newSchedule]);
    
    const currentSchedules = form.getValues('specificDateSchedules') || [];
    form.setValue('specificDateSchedules', [...currentSchedules, { 
      date: new Date(), 
      time: '09:00', 
      templateId: defaultTemplateId || "" 
    }]);
  };

  const removeSpecificDateSchedule = (index: number) => {
    const scheduleToRemove = specificDateSchedules[index];
    const updatedSchedules = [...specificDateSchedules];
    
    if (scheduleToRemove.isFromDb) {
      setDeletedSpecificDateScheduleIds([...deletedSpecificDateScheduleIds, scheduleToRemove.id]);
    }
    
    updatedSchedules.splice(index, 1);
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules.splice(index, 1);
    form.setValue('specificDateSchedules', currentSchedules);
  };

  const setWeekdayScheduleTemplate = (index: number, templateId: string | null) => {
    const updatedSchedules = [...weekdaySchedules];
    updatedSchedules[index].templateId = templateId;
    setWeekdaySchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('weekdaySchedules');
    currentSchedules[index].templateId = templateId || "";
    form.setValue('weekdaySchedules', currentSchedules);
  };

  const setSpecificDateScheduleTemplate = (index: number, templateId: string | null) => {
    const updatedSchedules = [...specificDateSchedules];
    updatedSchedules[index].templateId = templateId;
    setSpecificDateSchedules(updatedSchedules);
    
    const currentSchedules = form.getValues('specificDateSchedules');
    currentSchedules[index].templateId = templateId || "";
    form.setValue('specificDateSchedules', currentSchedules);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your schedules and objectives",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!hideObjectives) {
        console.log('Updating objectives:', data.objectives);
        const { error: objectivesError } = await supabase
          .from('profiles')
          .update({
            objectives: data.objectives,
            updated_at: new Date().toISOString()
          })
          .eq('id', session.user.id);
        
        if (objectivesError) {
          console.error('Error updating objectives:', objectivesError);
          toast({
            title: "Error",
            description: "Failed to update your objectives. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }
      
      if (deletedWeekdayScheduleIds.length > 0) {
        console.log('Deleting weekday schedules:', deletedWeekdayScheduleIds);
        for (const scheduleId of deletedWeekdayScheduleIds) {
          if (scheduleId.startsWith('weekday-')) continue;
          
          const { error } = await supabase
            .from('scheduled_calls')
            .delete()
            .eq('id', scheduleId)
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error(`Failed to delete weekday schedule ${scheduleId}:`, error);
          }
        }
      }
      
      if (deletedSpecificDateScheduleIds.length > 0) {
        console.log('Deleting specific date schedules:', deletedSpecificDateScheduleIds);
        for (const scheduleId of deletedSpecificDateScheduleIds) {
          if (scheduleId.startsWith('date-')) continue;
          
          const { error } = await supabase
            .from('scheduled_calls')
            .delete()
            .eq('id', scheduleId)
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error(`Failed to delete specific date schedule ${scheduleId}:`, error);
          }
        }
      }
      
      const savedWeekdaySchedules: WeekdaySchedule[] = [];
      
      for (let i = 0; i < weekdaySchedules.length; i++) {
        const schedule = weekdaySchedules[i];
        const formSchedule = data.weekdaySchedules[i];
        
        const dayOption = dayOptions.find(day => day.value === formSchedule.day);
        const weekdayNum = dayOption ? dayOption.weekdayNum : 1;
        
        const templateId = formSchedule.templateId;
        
        console.log(`Processing weekday schedule ${i}:`, {
          isFromDb: schedule.isFromDb,
          day: formSchedule.day,
          weekdayNum,
          time: formSchedule.time,
          templateId
        });
        
        if (schedule.isFromDb) {
          const { data: updatedSchedule, error } = await supabase
            .from('scheduled_calls')
            .update({
              weekday: weekdayNum,
              time: formSchedule.time,
              template_id: templateId,
              goal_id: null
            })
            .eq('id', schedule.id)
            .eq('user_id', session.user.id)
            .select('id, weekday, time, template_id')
            .single();
            
          if (error) {
            console.error(`Failed to update weekday schedule ${schedule.id}:`, error);
            continue;
          }
          
          console.log('Updated weekday schedule:', updatedSchedule);
          
          const updatedDayOption = dayOptions.find(day => day.weekdayNum === updatedSchedule.weekday);
          const dayString = updatedDayOption ? updatedDayOption.value : 'monday';
          
          savedWeekdaySchedules.push({ 
            id: updatedSchedule.id, 
            day: dayString, 
            time: updatedSchedule.time, 
            templateId: updatedSchedule.template_id,
            isFromDb: true 
          });
        } else {
          const { data: newSchedule, error } = await supabase
            .from('scheduled_calls')
            .insert({
              weekday: weekdayNum,
              time: formSchedule.time,
              template_id: templateId,
              user_id: session.user.id,
              specific_date: null,
              goal_id: null
            })
            .select('id, weekday, time, template_id')
            .single();
            
          if (error) {
            console.error('Failed to insert new weekday schedule:', error);
            continue;
          }
          
          console.log('Inserted new weekday schedule:', newSchedule);
          
          const newDayOption = dayOptions.find(day => day.weekdayNum === newSchedule.weekday);
          const dayString = newDayOption ? newDayOption.value : 'monday';
          
          savedWeekdaySchedules.push({ 
            id: newSchedule.id, 
            day: dayString, 
            time: newSchedule.time, 
            templateId: newSchedule.template_id,
            isFromDb: true 
          });
        }
      }
      
      const savedSpecificDateSchedules: SpecificDateSchedule[] = [];
      
      for (let i = 0; i < specificDateSchedules.length; i++) {
        const schedule = specificDateSchedules[i];
        const formSchedule = data.specificDateSchedules[i];
        
        const templateId = formSchedule.templateId;
        
        const formattedDate = formSchedule.date.toISOString().split('T')[0];
        
        console.log(`Processing specific date schedule ${i}:`, {
          isFromDb: schedule.isFromDb,
          date: formattedDate,
          time: formSchedule.time,
          templateId
        });
        
        if (schedule.isFromDb) {
          const { data: updatedSchedule, error } = await supabase
            .from('scheduled_calls')
            .update({
              specific_date: formattedDate,
              time: formSchedule.time,
              template_id: templateId,
              goal_id: null
            })
            .eq('id', schedule.id)
            .eq('user_id', session.user.id)
            .select('id, specific_date, time, template_id')
            .single();
            
          if (error) {
            console.error(`Failed to update specific date schedule ${schedule.id}:`, error);
            continue;
          }
          
          console.log('Updated specific date schedule:', updatedSchedule);
          
          savedSpecificDateSchedules.push({ 
            id: updatedSchedule.id, 
            date: new Date(updatedSchedule.specific_date), 
            time: updatedSchedule.time, 
            templateId: updatedSchedule.template_id,
            isFromDb: true 
          });
        } else {
          const { data: newSchedule, error } = await supabase
            .from('scheduled_calls')
            .insert({
              specific_date: formattedDate,
              time: formSchedule.time,
              template_id: templateId,
              user_id: session.user.id,
              weekday: null,
              goal_id: null
            })
            .select('id, specific_date, time, template_id')
            .single();
            
          if (error) {
            console.error('Failed to insert new specific date schedule:', error, {
              specific_date: formattedDate,
              time: formSchedule.time,
              template_id: templateId,
              user_id: session.user.id
            });
            continue;
          }
          
          console.log('Inserted new specific date schedule:', newSchedule);
          
          savedSpecificDateSchedules.push({ 
            id: newSchedule.id, 
            date: new Date(newSchedule.specific_date), 
            time: newSchedule.time, 
            templateId: newSchedule.template_id,
            isFromDb: true 
          });
        }
      }
      
      setWeekdaySchedules(savedWeekdaySchedules);
      setSpecificDateSchedules(savedSpecificDateSchedules);
      setDeletedWeekdayScheduleIds([]);
      setDeletedSpecificDateScheduleIds([]);
      
      toast({
        title: "Schedules Saved",
        description: "Your coaching schedules have been saved successfully!",
      });
      
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your schedules. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (weekdaySchedules.length === 0) {
      addWeekdaySchedule();
    }
  }, [templates]);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {!hideObjectives && (
            <div>
              <FormLabel className="text-base">Your Coaching Objectives</FormLabel>
              <FormDescription className="mb-4">
                Define what you want to achieve with your coaching sessions. These objectives will guide your coach in providing relevant guidance.
              </FormDescription>
              
              <FormField
                control={form.control}
                name="objectives"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I want to improve my public speaking skills, develop better work-life balance, advance in my career..."
                        className="min-h-[120px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUserObjectives(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div>
            <FormLabel className="text-base">Weekly Schedule</FormLabel>
            <FormDescription className="mb-4">
              Select which days of the week you want to have coaching calls and assign templates to each session.
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
                          defaultValue={schedule.day || "monday"}
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
                            const updated = [...weekdaySchedules];
                            updated[index].time = value;
                            setWeekdaySchedules(updated);
                          }}
                          defaultValue={schedule.time || "09:00"}
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
                    name={`weekdaySchedules.${index}.templateId`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setWeekdayScheduleTemplate(index, value === "none" ? null : value);
                          }}
                          defaultValue={schedule.templateId || (templates.length > 0 ? templates[0].id : "none")}
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger className={templates.length === 0 ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.length === 0 ? (
                              <SelectItem disabled value="none">No templates available</SelectItem>
                            ) : (
                              templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                    name={`specificDateSchedules.${index}.templateId`}
                    render={({ field }) => (
                      <FormItem className="flex-1 min-w-[180px]">
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSpecificDateScheduleTemplate(index, value === "none" ? null : value);
                          }}
                          defaultValue={schedule.templateId || (templates.length > 0 ? templates[0].id : "none")}
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger className={templates.length === 0 ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.length === 0 ? (
                              <SelectItem disabled value="none">No templates available</SelectItem>
                            ) : (
                              templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
            <FormLabel className="text-base">Templates</FormLabel>
            <FormDescription>
              Choose from these predefined templates for your coaching sessions. Each template is designed for a specific purpose.
            </FormDescription>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{template.description}</p>
              </div>
            ))}
          </div>
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
