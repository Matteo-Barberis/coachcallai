
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Keyword {
  text: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

interface KeywordCloudProps {
  title: string;
  description: string;
  keywords: Keyword[];
}

const KeywordCloud = ({ title, description, keywords }: KeywordCloudProps) => {
  const [sortBy, setSortBy] = useState<'value' | 'alphabetical'>('value');
  
  // Sort keywords based on the selected sorting option
  const sortedKeywords = [...keywords].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }
    return b.value - a.value;
  });
  
  // Get the maximum value for scaling
  const maxValue = Math.max(...keywords.map(k => k.value));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant={sortBy === 'value' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSortBy('value')}
              className="h-7 text-xs"
            >
              By Frequency
            </Button>
            <Button 
              variant={sortBy === 'alphabetical' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSortBy('alphabetical')}
              className="h-7 text-xs"
            >
              A-Z
            </Button>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          <TooltipProvider>
            {sortedKeywords.map((keyword, index) => {
              // Calculate font size based on the keyword value relative to the max value
              const fontSize = 0.8 + (keyword.value / maxValue) * 1.2;
              // Calculate opacity based on the keyword value relative to the max value
              const opacity = 0.6 + (keyword.value / maxValue) * 0.4;
              
              // Determine color based on trend
              let bgColor = 'bg-primary/10';
              let textColor = 'text-primary';
              
              if (keyword.trend === 'up') {
                bgColor = 'bg-green-100';
                textColor = 'text-green-700';
              } else if (keyword.trend === 'down') {
                bgColor = 'bg-orange-100';
                textColor = 'text-orange-700';
              }
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <span 
                      className={`px-2 py-1 rounded-full ${bgColor} ${textColor} transition-all duration-300 hover:scale-110 cursor-pointer`}
                      style={{ 
                        fontSize: `${fontSize}rem`,
                        opacity: opacity,
                        fontWeight: keyword.value > maxValue * 0.7 ? 'bold' : 'normal'
                      }}
                    >
                      {keyword.text}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mentioned {keyword.value} times</p>
                    {keyword.trend && (
                      <p className="text-xs mt-1">
                        {keyword.trend === 'up' ? '↑ Increasing' : 
                         keyword.trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordCloud;
