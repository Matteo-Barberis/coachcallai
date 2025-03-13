
import React, { useState } from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock } from "lucide-react";
import TimeSlotPicker from "@/components/TimeSlotPicker";

const ScheduleCall = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select both a date and time for your call",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Call scheduled!",
        description: `Your call is scheduled for ${format(date, "PPP")} at ${timeSlot}`,
      });
      setIsSubmitting(false);
      setDate(undefined);
      setTimeSlot(null);
      setNotes("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose a date for your coaching call
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3 pointer-events-auto border rounded-md" 
              disabled={(date) => {
                // Disable dates in the past and weekends (Saturday and Sunday)
                const day = date.getDay();
                return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                      day === 0 || 
                      day === 6;
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Select Time
            </CardTitle>
            <CardDescription>
              Choose an available time slot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSlotPicker 
              selectedDate={date} 
              selectedSlot={timeSlot}
              onSelectTimeSlot={setTimeSlot}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Share any topics or questions you'd like to discuss during the call
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="I'd like to discuss..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={!date || !timeSlot || isSubmitting}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Call"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ScheduleCall;
