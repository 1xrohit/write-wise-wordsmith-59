
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatsDashboardProps {
  stats: {
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    readabilityScore: number;
  };
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Moderate';
    return 'Needs Improvement';
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Text Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">Words</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <p className="text-2xl font-bold">{stats.wordCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium">Characters</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            <p className="text-2xl font-bold">{stats.charCount}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">Readability</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">{getReadabilityLabel(stats.readabilityScore)}</span>
            <span className="text-sm font-semibold">{stats.readabilityScore}/100</span>
          </div>
          <Progress className="h-2" value={stats.readabilityScore} />
        </CardContent>
      </Card>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>Based on {stats.sentenceCount} sentences</p>
        <p className="mt-1">Average words per sentence: {stats.wordCount > 0 && stats.sentenceCount > 0 ? 
          (stats.wordCount / stats.sentenceCount).toFixed(1) : 0}</p>
      </div>
    </div>
  );
};

export default StatsDashboard;
