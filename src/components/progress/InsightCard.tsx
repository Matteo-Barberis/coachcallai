
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, ArrowUpRight, Star, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title: string;
  description: string;
  insights: Array<{
    text: string;
    category?: 'breakthrough' | 'achievement' | 'insight';
    date?: string;
  }>;
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
            <li key={index} className={cn(
              "group flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors",
              insight.category === 'breakthrough' && "border-l-2 border-purple-500 pl-3"
            )}>
              <div className={cn(
                `mt-0.5 mr-2 h-2 w-2 rounded-full`,
                isAchievement ? 'bg-primary' : 'bg-blue-500',
                insight.category === 'breakthrough' && 'bg-purple-500 h-3 w-3 animate-pulse'
              )} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{insight.text}</span>
                  {insight.category === 'breakthrough' && (
                    <Badge className="bg-purple-500 text-white text-xs">Breakthrough</Badge>
                  )}
                  {insight.date && (
                    <span className="text-xs text-muted-foreground">{insight.date}</span>
                  )}
                </div>
              </div>
              {insight.category === 'breakthrough' ? (
                <Sparkles className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
