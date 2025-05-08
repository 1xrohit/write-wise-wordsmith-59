
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  explanation: string;
  startIndex: number;
  endIndex: number;
}

interface TextEditorProps {
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
  setTextStats: React.Dispatch<React.SetStateAction<{
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    readabilityScore: number;
  }>>;
}

const MOCK_CORRECTIONS: Correction[] = [
  {
    original: "their",
    suggestion: "there",
    type: "grammar",
    explanation: "Use 'there' to refer to a place or location, 'their' is a possessive pronoun.",
    startIndex: 20,
    endIndex: 25,
  },
  {
    original: "alot",
    suggestion: "a lot",
    type: "spelling",
    explanation: "'alot' is not a word. Use 'a lot' (two separate words) to indicate a large quantity.",
    startIndex: 60,
    endIndex: 64,
  },
  {
    original: "effect",
    suggestion: "affect",
    type: "style",
    explanation: "In this context, 'affect' (verb) means to influence something, while 'effect' is typically a noun.",
    startIndex: 90,
    endIndex: 96,
  },
];

const TextEditor: React.FC<TextEditorProps> = ({ setCorrections, setActiveCorrection, setTextStats }) => {
  const [text, setText] = useState<string>("Welcome to WriteWise! Try typing a sentence with some common errors, like 'their are alot of mistakes that effect my writing.' Our grammar checker will help identify and explain issues.");
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    // Basic text stats calculation
    const wordCount = e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0;
    const charCount = e.target.value.length;
    const sentenceCount = e.target.value.split(/[.!?]+/).length - 1 || 0;
    // Simple readability score (0-100) based on sentence and word length
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
    
    setTextStats({
      wordCount,
      charCount,
      sentenceCount,
      readabilityScore: Math.round(readabilityScore),
    });
  };

  const checkGrammar = () => {
    // Simulate API call to OpenGPT
    setIsChecking(true);
    setTimeout(() => {
      setCorrections(MOCK_CORRECTIONS);
      setIsChecking(false);
      toast({
        title: "Text analyzed",
        description: `Found ${MOCK_CORRECTIONS.length} potential improvements`,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="w-full">
          <div className="relative">
            <textarea
              className="text-editor resize-none focus:ring-1 focus:ring-primary transition-all"
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              rows={15}
              aria-label="Text editor"
            />
            <div className="absolute bottom-4 right-4">
              <Button 
                onClick={checkGrammar} 
                disabled={isChecking || !text.trim().length}
                className="shadow-sm"
              >
                {isChecking ? "Checking..." : "Check Grammar"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="w-full">
          <div className="text-editor overflow-auto">
            {text}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground flex justify-between">
        <div>
          Last saved: Just now
        </div>
        <div>
          Press "Check Grammar" to analyze your text
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
