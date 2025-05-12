
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Correction, getTypeBadgeColor } from '../utils/textUtils';

interface SuggestionsTabProps {
  corrections: Correction[];
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ corrections }) => {
  if (corrections.length === 0) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-center p-4 border rounded-md border-dashed">
        <p className="text-muted-foreground mb-2">No suggestions yet</p>
        <p className="text-sm text-muted-foreground">Check your text to get grammar and style suggestions</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 min-h-[300px]">
      {corrections.map((correction, index) => (
        <Card key={index} className="transition-all">
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between items-center">
              <Badge className={getTypeBadgeColor(correction.type || 'grammar')}>
                {(correction.type || 'grammar').charAt(0).toUpperCase() + (correction.type || 'grammar').slice(1)}
              </Badge>
              
              <div className="flex space-x-1">
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Accept</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-3">
            <div>
              <div className="line-through text-muted-foreground text-sm">{correction.error}</div>
              <div className="font-medium text-sm">{correction.suggestion}</div>
            </div>
            
            <CardDescription className="mt-2 text-sm">
              {correction.reason}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuggestionsTab;
