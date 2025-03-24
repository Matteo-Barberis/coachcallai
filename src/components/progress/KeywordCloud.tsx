
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSessionContext } from '@/context/SessionContext';
import { FocusArea } from '@/types/supabase';

interface KeywordCloudProps {
  title: string;
  description: string;
  keywords?: FocusArea[];
  isLoading?: boolean;
}

const KeywordCloud = ({ title, description, keywords: propKeywords, isLoading: propIsLoading }: KeywordCloudProps) => {
  const [sortBy, setSortBy] = useState<'value' | 'alphabetical'>('value');
  const { session } = useSessionContext();

  // Fetch focus areas from user profile if keywords not provided
  const { data: focusAreas, isLoading: loadingFocusAreas } = useQuery({
    queryKey: ['focusAreas'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('focus_areas')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      // Ensure all focus areas have capitalized first letter
      const areas = (data?.focus_areas as FocusArea[] || []).map(area => ({
        ...area,
        text: area.text.charAt(0).toUpperCase() + area.text.slice(1)
      }));
      
      return areas;
    },
    enabled: !propKeywords && !!session?.user?.id,
  });
  
  const isLoading = propIsLoading || loadingFocusAreas;
  const keywords = propKeywords || focusAreas || [];
  
  // Sort keywords based on the selected sorting option
  const sortedKeywords = [...keywords].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }
    return b.value - a.value;
  });
  
  // Get the maximum value for scaling
  const maxValue = Math.max(...keywords.map(k => k.value), 1);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Loading focus areas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (keywords.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">No focus areas available yet. They will appear here as your coaching journey progresses.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
        <div className="flex flex-wrap gap-3 justify-start max-w-full min-h-[200px]">
          <TooltipProvider>
            {sortedKeywords.map((keyword, index) => {
              // Calculate font size based on the keyword value relative to the max value
              const fontSize = 0.75 + (keyword.value / maxValue) * 0.85;
              // Calculate opacity based on the keyword value relative to the max value
              const opacity = 0.75 + (keyword.value / maxValue) * 0.25;
              
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
              
              // Calculate width based on text length
              const minWidth = 60 + (keyword.text.length * 6);
              const height = 32 + (keyword.value / maxValue) * 16;
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <span 
                      className={`px-3 py-1 rounded-full ${bgColor} ${textColor} transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center justify-center`}
                      style={{ 
                        fontSize: `${fontSize}rem`,
                        opacity: opacity,
                        fontWeight: keyword.value > maxValue * 0.7 ? 'bold' : 'normal',
                        width: `${minWidth}px`,
                        height: `${height}px`,
                        minWidth: 'fit-content',
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
