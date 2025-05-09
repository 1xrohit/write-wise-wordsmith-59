
import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sendMessage, createGrammarCheckPrompt } from '@/services/grammarAPI';
import { calculateTextStats, TextStats, Correction, generateCorrectedText } from './utils/textUtils';
import { useSuggestions } from '@/hooks/useSuggestions';

// Import tabs
import WriteTab from './tabs/WriteTab';
import PreviewTab from './tabs/PreviewTab';
import SuggestionsTab from './tabs/SuggestionsTab';
import CorrectTab from './tabs/CorrectTab';
import StatsDisplay from './components/StatsDisplay';

interface TextEditorProps {
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
  setTextStats: React.Dispatch<React.SetStateAction<TextStats>>;
}

const TextEditor: React.FC<TextEditorProps> = ({ setCorrections, setActiveCorrection, setTextStats }) => {
  const [text, setText] = useState<string>("Welcome to WriteWise! Try typing a sentence with some common errors, like 'their are alot of mistakes that effect my writing.' Our grammar checker will help identify and explain issues.");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [corrections, setLocalCorrections] = useState<Correction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("write");
  const [showCorrectTab, setShowCorrectTab] = useState<boolean>(false);
  const [correctedText, setCorrectedText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [stats, setStats] = useState<TextStats>({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    readabilityScore: 0
  });
  
  // Use the suggestions hook
  const { suggestions, isLoading: isLoadingSuggestions, handleSuggestionClick } = useSuggestions(text);

  useEffect(() => {
    // Auto-resize the textarea when text changes
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Calculate text stats whenever text changes
    const newStats = calculateTextStats(text);
    setStats(newStats);
    setTextStats(newStats);
  }, [text, setTextStats]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const newText = handleSuggestionClick(suggestion, text);
    setText(newText);
    
    // Focus back on the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const insertCorrection = (correction: Correction) => {
    // Get the current text
    const currentText = text;
    
    // Extract the parts before and after the correction
    const beforeCorrection = currentText.substring(0, correction.startIndex);
    const afterCorrection = currentText.substring(correction.endIndex);
    
    // Combine with the suggestion to create the corrected text
    const newText = beforeCorrection + correction.suggestion + afterCorrection;
    
    // Update the text state
    setText(newText);
    
    // Switch to write tab to show the correction
    setActiveTab("write");
    
    toast({
      title: "Correction applied",
      description: "The suggested correction has been inserted into your text.",
    });
  };

  const applyAllCorrections = () => {
    setText(correctedText);
    setActiveTab("write");
    toast({
      title: "All corrections applied",
      description: "All suggested corrections have been inserted into your text.",
    });
  };

  const checkGrammar = async () => {
    setIsChecking(true);
    
    try {
      // Prepare the prompt for grammar checking
      const prompt = createGrammarCheckPrompt(text);
      
      const response = await sendMessage(prompt);
      const data = await response.json();
      
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        // Try to extract JSON from the response
        try {
          // Look for JSON object in the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsedData = JSON.parse(jsonStr);
            
            if (parsedData.corrections && Array.isArray(parsedData.corrections)) {
              const newCorrections = parsedData.corrections;
              setLocalCorrections(newCorrections);
              setCorrections(newCorrections);
              
              // Generate corrected text with all corrections applied
              const fullyCorrected = generateCorrectedText(text, newCorrections);
              setCorrectedText(fullyCorrected);
              
              // Show the correct tab
              setShowCorrectTab(true);
              
              // Auto switch to the suggestions tab
              setActiveTab("suggestions");
              
              toast({
                title: "Text analyzed",
                description: `Found ${newCorrections.length} potential improvements`,
              });
            } else {
              throw new Error('No corrections array in response');
            }
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (jsonError) {
          console.error('Failed to parse corrections:', jsonError);
          toast({
            title: "Analysis error",
            description: "Unable to process grammar suggestions",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      toast({
        title: "Service error",
        description: error instanceof Error ? error.message : "Failed to check grammar",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          {showCorrectTab && <TabsTrigger value="correct">Correct</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="write">
          <WriteTab 
            text={text} 
            onTextChange={handleTextChange} 
            onCheckGrammar={checkGrammar}
            isChecking={isChecking}
            textareaRef={textareaRef}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionSelect}
            isLoadingSuggestions={isLoadingSuggestions}
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <PreviewTab text={text} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsTab corrections={corrections} />
        </TabsContent>

        <TabsContent value="correct">
          <CorrectTab 
            corrections={corrections} 
            onInsertCorrection={insertCorrection}
            onApplyAllCorrections={applyAllCorrections}
          />
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground pb-4">
        {/* Text Statistics */}
        <StatsDisplay stats={stats} />
      </div>
    </div>
  );
};

export default TextEditor;
