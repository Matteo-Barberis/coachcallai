
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle2 } from "lucide-react";

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
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Lightbulb className="h-5 w-5 text-primary" />
        )}
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <div className={`mt-0.5 mr-2 h-2 w-2 rounded-full ${isAchievement ? 'bg-primary animate-pulse' : 'bg-primary'}`} />
              <span className="text-sm">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
