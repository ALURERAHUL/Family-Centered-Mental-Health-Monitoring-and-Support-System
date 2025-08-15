'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AnalyzePhotoMoodOutput } from '@/ai/flows/analyze-photo-mood';

type PhotoAnalysisHistoryEntry = AnalyzePhotoMoodOutput & { image: string; memberId: string };

interface MoodHistoryChartProps {
  history: PhotoAnalysisHistoryEntry[];
}

export function MoodHistoryChart({ history }: MoodHistoryChartProps) {
  const moodCounts = history.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
  }));

  if (history.length === 0) {
    return (
        <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
            <p>No mood data to display for the selected member.</p>
        </div>
    )
  }

  return (
    <div className="h-[350px] w-full">
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Mood Count" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
