
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TextStats, getReadabilityLabel } from '../utils/textUtils';

interface StatsDisplayProps {
  stats: TextStats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="border-t pt-4">
      <h2 className="text-base font-semibold mb-4">Text Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium">Words</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2">
            <p className="text-xl font-bold">{stats.wordCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-medium">Characters</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2">
            <p className="text-xl font-bold">{stats.charCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-4">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-medium">Readability</CardTitle>
        </CardHeader>
        <CardContent className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">{getReadabilityLabel(stats.readabilityScore)}</span>
            <span className="text-sm font-semibold">{stats.readabilityScore}/100</span>
          </div>
          <Progress className="h-2" value={stats.readabilityScore} />
        </CardContent>
      </Card>
      
      <div className="text-xs text-muted-foreground">
        <p>Based on {stats.sentenceCount} sentences</p>
        <p className="mt-1">Average words per sentence: {stats.wordCount > 0 && stats.sentenceCount > 0 ? 
          (stats.wordCount / stats.sentenceCount).toFixed(1) : 0}</p>
      </div>
    </div>
  );
};

export default StatsDisplay;
