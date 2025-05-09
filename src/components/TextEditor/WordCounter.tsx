
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TextStats } from './utils/textUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface WordCounterProps {
  wordCount: number;
  limit: number;
}

const WordCounter: React.FC<WordCounterProps> = ({ wordCount, limit }) => {
  const isMobile = useIsMobile();
  const percentage = Math.min((wordCount / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage > 100;
  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${isOverLimit ? 'text-destructive' : isNearLimit ? 'text-amber-500' : 'text-muted-foreground'}`}>
          {wordCount}/{limit}
        </span>
        <span className="text-xs text-muted-foreground">words</span>
      </div>
      <Progress 
        value={percentage} 
        className={`h-1 ${isMobile ? 'w-16' : 'w-24'} ${
          isOverLimit ? 'bg-destructive/20' : isNearLimit ? 'bg-amber-100' : ''
        }`}
      />
    </div>
  );
};

export default WordCounter;
