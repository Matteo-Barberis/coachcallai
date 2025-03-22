
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrendChartProps {
  title: string;
  description: string;
  data: Array<{
    date: string;
    value: number;
  }>;
  dataKey?: string;
  color?: string;
}

const TrendChart = ({ 
  title, 
  description, 
  data, 
  dataKey = "value", 
  color = "hsl(var(--primary))" 
}: TrendChartProps) => {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: color,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ChartContainer 
            config={chartConfig}
          >
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ strokeOpacity: 0.2 }}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={{ strokeOpacity: 0.2 }}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent
                        className="bg-background border-border"
                        payload={payload}
                      />
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fill={color} 
                fillOpacity={0.2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
