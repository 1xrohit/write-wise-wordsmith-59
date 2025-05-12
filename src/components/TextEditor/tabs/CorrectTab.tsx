
import React from 'react';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Correction, getTypeBadgeColor } from '../utils/textUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CorrectTabProps {
  corrections: Correction[];
  onInsertCorrection: (correction: Correction) => void;
  onApplyAllCorrections: () => void;
}

const CorrectTab: React.FC<CorrectTabProps> = ({ 
  corrections, 
  onInsertCorrection, 
  onApplyAllCorrections 
}) => {
  const isMobile = useIsMobile();
  
  if (corrections.length === 0) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-center p-4 border rounded-md border-dashed">
        <p className="text-muted-foreground mb-2">No corrections available</p>
        <p className="text-sm text-muted-foreground">Check your text to generate corrections</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 min-h-[300px]">
      {/* Apply All Corrections button at the top right */}
      <div className="mb-4 flex justify-end">
        <Button 
          onClick={onApplyAllCorrections}
          className="w-auto"
        >
          Apply All Corrections
        </Button>
      </div>
      
      {corrections.map((correction, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between items-center">
              <Badge className={getTypeBadgeColor(correction.type || 'grammar')}>
                {(correction.type || 'Grammar').charAt(0).toUpperCase() + (correction.type || 'grammar').slice(1)}
              </Badge>
              
              {/* Insert button on the right side */}
              <Button 
                onClick={() => onInsertCorrection(correction)} 
                variant="outline" 
                size="sm"
                className="whitespace-nowrap"
              >
                <span>Insert to Write</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-3">
            <div className="flex-1">
              <div className="line-through text-muted-foreground text-sm">{correction.error}</div>
              <div className="font-medium text-sm">{correction.suggestion}</div>
              <CardDescription className="mt-2 text-xs sm:text-sm">
                {correction.reason}
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CorrectTab;
