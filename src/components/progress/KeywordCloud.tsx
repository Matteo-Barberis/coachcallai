
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Keyword {
  text: string;
  value: number;
}

interface KeywordCloudProps {
  title: string;
  description: string;
  keywords: Keyword[];
}

const KeywordCloud = ({ title, description, keywords }: KeywordCloudProps) => {
  // Sort keywords by value in descending order
  const sortedKeywords = [...keywords].sort((a, b) => b.value - a.value);
  
  // Get the maximum value for scaling
  const maxValue = sortedKeywords[0]?.value || 1;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          {sortedKeywords.map((keyword, index) => {
            // Calculate font size based on the keyword value relative to the max value
            const fontSize = 0.8 + (keyword.value / maxValue) * 1.2;
            // Calculate opacity based on the keyword value relative to the max value
            const opacity = 0.6 + (keyword.value / maxValue) * 0.4;
            
            return (
              <span 
                key={index}
                className="px-2 py-1 rounded-full bg-primary/10 text-primary"
                style={{ 
                  fontSize: `${fontSize}rem`,
                  opacity: opacity,
                  fontWeight: keyword.value > maxValue * 0.7 ? 'bold' : 'normal'
                }}
              >
                {keyword.text}
              </span>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordCloud;
