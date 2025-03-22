
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, Target, Clock } from "lucide-react";

interface ProgressOverviewProps {
  completedCalls: number;
  totalCalls: number;
  milestonesAchieved: number;
  totalMilestones: number;
  objectivesProgress: number;
}

const ProgressOverview = ({
  completedCalls,
  totalCalls,
  milestonesAchieved,
  totalMilestones,
  objectivesProgress
}: ProgressOverviewProps) => {
  const callsPercentage = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Coaching Calls
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-4">
          <div className="text-2xl font-bold">{completedCalls} / {totalCalls}</div>
          <p className="text-xs text-muted-foreground">
            {callsPercentage}% complete
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-4">
          <div className="text-2xl font-bold">{milestonesAchieved}</div>
          <p className="text-xs text-muted-foreground">
            achieved so far
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            Small Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-4">
          <div className="text-2xl font-bold">{objectivesProgress}</div>
          <p className="text-xs text-muted-foreground">
            completed
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Consistency
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-4">
          <div className="text-2xl font-bold">
            {callsPercentage > 80 ? 'Excellent' : callsPercentage > 60 ? 'Good' : callsPercentage > 40 ? 'Average' : 'Needs Work'}
          </div>
          <p className="text-xs text-muted-foreground">
            based on attendance
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
