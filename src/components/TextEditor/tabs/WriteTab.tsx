
import React, { RefObject } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import WordCounter from '../WordCounter';
import { useIsMobile } from '@/hooks/use-mobile';

interface WriteTabProps {
  text: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCheckGrammar: () => void;
  isChecking: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
  isLoadingSuggestions?: boolean;
  wordCount: number; // Added word count prop
}

const WriteTab: React.FC<WriteTabProps> = ({ 
  text, 
  onTextChange, 
  onCheckGrammar, 
  isChecking, 
  textareaRef,
  isLoadingSuggestions = false,
  wordCount // Use the word count prop
}) => {
  const isMobile = useIsMobile();
  const WORD_LIMIT = 1000;

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
      <div className={`absolute bottom-4 flex justify-between ${isMobile ? 'w-full px-4' : 'w-full px-4'}`}>
        <WordCounter wordCount={wordCount} limit={WORD_LIMIT} />
        <Button 
          onClick={onCheckGrammar} 
          disabled={isChecking || !text.trim().length}
          className="shadow-sm"
          size={isMobile ? "sm" : "default"}
        >
          {isChecking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : "Check Grammar"}
        </Button>
      </div>
    </div>
  );
};

export default WriteTab;
