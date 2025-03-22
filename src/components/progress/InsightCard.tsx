
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, ArrowUpRight } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  insights: string[];
  type?: 'insight' | 'achievement';
}

const InsightCard = ({ title, description, insights, type = 'insight' }: InsightCardProps) => {
  const isAchievement = type === 'achievement';
  
  return (
    <Card className={isAchievement ? "border-primary/20" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {isAchievement ? (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="group flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
              <div className={`mt-0.5 mr-2 h-2 w-2 rounded-full ${isAchievement ? 'bg-primary animate-pulse' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <span className="text-sm">{insight}</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
