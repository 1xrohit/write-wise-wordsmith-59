
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  explanation: string;
  startIndex: number;
  endIndex: number;
}

interface SuggestionsSidebarProps {
  corrections: Correction[];
  activeCorrection: Correction | null;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
}

const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({ 
  corrections, 
  activeCorrection, 
  setActiveCorrection 
}) => {
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-grammar text-white';
      case 'spelling': return 'bg-spelling text-white';
      case 'punctuation': return 'bg-punctuation text-white';
      case 'style': return 'bg-style text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggestions</h2>
        <Badge variant="outline">{corrections.length}</Badge>
      </div>
      
      {corrections.length === 0 ? (
        <div className="flex flex-col h-full items-center justify-center text-center p-4 border rounded-md border-dashed">
          <p className="text-muted-foreground mb-2">No suggestions yet</p>
          <p className="text-sm text-muted-foreground">Check your text to get grammar and style suggestions</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-auto flex-1">
          {corrections.map((correction, index) => (
            <Card 
              key={index} 
              className={`transition-all cursor-pointer ${activeCorrection === correction ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveCorrection(correction)}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-center">
                  <Badge className={getTypeBadgeColor(correction.type)} variant="secondary">
                    {correction.type.charAt(0).toUpperCase() + correction.type.slice(1)}
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
                  <div className="line-through text-muted-foreground text-sm">{correction.original}</div>
                  <div className="font-medium text-sm">{correction.suggestion}</div>
                </div>
                
                <CardDescription className="mt-2 text-sm">
                  {correction.explanation}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsSidebar;
