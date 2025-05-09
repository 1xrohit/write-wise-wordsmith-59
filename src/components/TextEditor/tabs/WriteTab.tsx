
import React, { RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface WriteTabProps {
  text: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCheckGrammar: () => void;
  isChecking: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoadingSuggestions?: boolean;
}

const WriteTab: React.FC<WriteTabProps> = ({ 
  text, 
  onTextChange, 
  onCheckGrammar, 
  isChecking, 
  textareaRef,
  suggestions,
  onSuggestionClick,
  isLoadingSuggestions = false
}) => {
  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        className="text-editor resize-none min-h-[300px] focus:ring-1 focus:ring-primary transition-all"
        value={text}
        onChange={onTextChange}
        placeholder="Type or paste your text here..."
        style={{ overflow: 'hidden' }} // Hide scrollbars as height increases
        aria-label="Text editor"
      />
      <div className="absolute bottom-4 right-4">
        <Button 
          onClick={onCheckGrammar} 
          disabled={isChecking || !text.trim().length}
          className="shadow-sm"
        >
          {isChecking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : "Check Grammar"}
        </Button>
      </div>
      
      {/* Auto-suggestion area */}
      {suggestions.length > 0 && (
        <div className="mt-3 overflow-x-auto absolute bottom-16 left-4">
          <div className="inline-flex bg-muted/50 p-1 shadow-sm rounded-full">
            {isLoadingSuggestions && <span className="px-4 py-1 text-sm font-medium">Loading...</span>}
            {!isLoadingSuggestions && suggestions.map((suggestion, index) => {
              const isFirst = index === 0;
              const isLast = index === suggestions.length - 1;
              return (
                <button
                  key={suggestion}
                  onClick={() => onSuggestionClick(suggestion)}
                  className={`px-4 py-1 text-sm font-medium transition-all duration-200 border
                    ${index === 1 ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                    ${isFirst ? 'rounded-l-full' : ''}
                    ${isLast ? 'rounded-r-full' : ''}
                    ${!isFirst && !isLast ? 'border-l-0' : ''}
                    focus:outline-none focus:ring-2 focus:ring-blue-300`}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteTab;
