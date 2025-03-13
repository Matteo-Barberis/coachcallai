
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

// Interface for the component props
interface TimeSlotPickerProps {
  selectedDate?: Date;
  selectedSlot: string | null;
  onSelectTimeSlot: (slot: string) => void;
}

// Generate time slots from 9 AM to 5 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    slots.push(`${hour}:00 ${ampm}`);
    if (i < 17) {
      slots.push(`${hour}:30 ${ampm}`);
    }
  }
  return slots;
};

// Randomly make some slots unavailable for demonstration
const getAvailableSlots = (date?: Date) => {
  if (!date) return [];
  
  const allSlots = generateTimeSlots();
  
  // Use the date to seed a pseudo-random selection
  // This ensures the same date always has the same available slots
  const dateString = format(date, 'yyyyMMdd');
  const seed = parseInt(dateString, 10);
  
  return allSlots.filter((_, index) => {
    // Use a simple hash function based on the index and seed
    const isAvailable = (seed + index) % 3 !== 0;
    return isAvailable;
  });
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  selectedDate, 
  selectedSlot,
  onSelectTimeSlot 
}) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    setAvailableSlots(getAvailableSlots(selectedDate));
    // Reset selected slot when date changes
    if (selectedSlot) {
      onSelectTimeSlot("");
    }
  }, [selectedDate]);

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-gray-500">Please select a date first</p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-gray-500">No available time slots for the selected date</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 h-[300px] overflow-y-auto p-1">
      {availableSlots.map((slot) => (
        <Button
          key={slot}
          variant={selectedSlot === slot ? "default" : "outline"}
          className="justify-center"
          onClick={() => onSelectTimeSlot(slot)}
        >
          {slot}
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
