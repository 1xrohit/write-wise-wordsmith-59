
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
}

const WriteTab: React.FC<WriteTabProps> = ({ 
  text, 
  onTextChange, 
  onCheckGrammar, 
  isChecking, 
  textareaRef 
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
    </div>
  );
};

export default WriteTab;
