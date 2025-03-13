
import React from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';

export type GoalItem = {
  id: string;
  description: string;
};

interface ScheduleGoalsProps {
  scheduleType: 'weekday' | 'specific';
  scheduleIndex: number;
  customGoalsEnabled: boolean;
  onToggleCustomGoals: () => void;
  defaultGoals: GoalItem[];
  customGoals: GoalItem[];
  onAddCustomGoal: () => void;
  onRemoveCustomGoal: (index: number) => void;
  onUpdateCustomGoal: (index: number, value: string) => void;
}

const ScheduleGoals: React.FC<ScheduleGoalsProps> = ({
  scheduleType,
  scheduleIndex,
  customGoalsEnabled,
  onToggleCustomGoals,
  defaultGoals,
  customGoals,
  onAddCustomGoal,
  onRemoveCustomGoal,
  onUpdateCustomGoal,
}) => {
  const form = useFormContext();
  const fieldName = `${scheduleType}Schedules.${scheduleIndex}.goals`;
  
  return (
    <div className="mt-2 border-t border-gray-100 pt-2">
      <div className="flex items-center gap-2 mb-2">
        <Checkbox 
          id={`use-custom-goals-${scheduleType}-${scheduleIndex}`}
          checked={customGoalsEnabled}
          onCheckedChange={onToggleCustomGoals}
        />
        <label 
          htmlFor={`use-custom-goals-${scheduleType}-${scheduleIndex}`}
          className="text-sm font-medium cursor-pointer"
        >
          Use custom goals for this session
        </label>
      </div>
      
      {!customGoalsEnabled && (
        <div className="pl-6 text-sm text-gray-500">
          {defaultGoals.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {defaultGoals.map((goal, idx) => (
                <li key={goal.id}>{goal.description}</li>
              ))}
            </ul>
          ) : (
            <p>No default goals defined. Add some in the default goals section.</p>
          )}
        </div>
      )}
      
      {customGoalsEnabled && (
        <div className="pl-6 space-y-3">
          {customGoals.map((goal, idx) => (
            <div key={goal.id} className="flex items-start gap-2">
              <Textarea
                value={goal.description}
                onChange={(e) => onUpdateCustomGoal(idx, e.target.value)}
                placeholder="Describe your goal..."
                className="resize-none flex-1 min-h-[60px]"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveCustomGoal(idx)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddCustomGoal}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add goal
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduleGoals;
