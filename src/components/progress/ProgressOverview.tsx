
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  const milestonesPercentage = totalMilestones > 0 ? Math.round((milestonesAchieved / totalMilestones) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Coaching Calls</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCalls} / {totalCalls}</div>
          <Progress value={callsPercentage} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {callsPercentage}% of scheduled calls completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Milestones Achieved</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{milestonesAchieved} / {totalMilestones}</div>
          <Progress value={milestonesPercentage} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {milestonesPercentage}% of milestones achieved
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Objectives Progress</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{objectivesProgress}%</div>
          <Progress value={objectivesProgress} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Overall progress towards your objectives
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Consistency Score</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {callsPercentage > 80 ? 'Excellent' : callsPercentage > 60 ? 'Good' : callsPercentage > 40 ? 'Average' : 'Needs Improvement'}
          </div>
          <Progress value={callsPercentage} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Based on your attendance and engagement
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressOverview;
