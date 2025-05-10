
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { TextStats, Correction, calculateTextStats, generateCorrectedText } from '../utils/textUtils';
import { useSuggestions } from '@/hooks/useSuggestions';
import { useGrammarCheck } from './useGrammarCheck';

interface UseTextEditorProps {
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
  setTextStats: React.Dispatch<React.SetStateAction<TextStats>>;
}

export const useTextEditor = ({ 
  setCorrections,
  setActiveCorrection, 
  setTextStats 
}: UseTextEditorProps) => {
  const [text, setText] = useState<string>("Welcome to WriteWise! Try typing a sentence with some common errors, like 'their are alot of mistakes that effect my writing.' Our grammar checker will help identify and explain issues.");
  const [activeTab, setActiveTab] = useState<string>("write");
  const [showCorrectTab, setShowCorrectTab] = useState<boolean>(false);
  const [correctedText, setCorrectedText] = useState<string>("");
  const [localCorrections, setLocalCorrections] = useState<Correction[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [stats, setStats] = useState<TextStats>({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    readabilityScore: 0
  });

  // Use the suggestions hook
  const { suggestions, isLoading: isLoadingSuggestions, handleSuggestionClick } = useSuggestions(text);

  // Use the grammar check hook with modified behavior
  const { isChecking, checkGrammar } = useGrammarCheck({
    text,
    setCorrections,
    setLocalCorrections,
    setCorrectedText,
    setShowCorrectTab,
    setActiveTab: (tab) => {
      setActiveTab("correct");
    }
  });

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
    try {
      console.log('Applying single correction:', correction);
      
      // Use generateCorrectedText with just this one correction
      const newText = generateCorrectedText(text, [correction]);
      
      // Set the new text with corrected content
      setText(newText);
      
      // Switch to write tab to show the correction
      setActiveTab("write");
      
      toast({
        title: "Correction applied",
        description: "The suggested correction has been inserted into your text.",
      });
    } catch (error) {
      console.error('Error applying correction:', error);
      toast({
        title: "Error applying correction",
        description: "Failed to apply the correction. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyAllCorrections = () => {
    try {
      console.log('Applying all corrections:', localCorrections);
      
      if (localCorrections.length === 0) {
        toast({
          title: "No corrections to apply",
          description: "There are no corrections to apply to your text.",
        });
        return;
      }
      
      // Generate corrected text using our utility function
      const newText = generateCorrectedText(text, localCorrections);
      console.log('Original text:', text);
      console.log('New text after corrections:', newText);
      
      // Update the text state
      setText(newText);
      
      // Clear the corrections since they've been applied
      setLocalCorrections([]);
      setCorrections([]);
      
      // Switch to write tab
      setActiveTab("write");
      
      toast({
        title: "All corrections applied",
        description: "All suggested corrections have been inserted into your text.",
      });
    } catch (error) {
      console.error('Error applying all corrections:', error);
      toast({
        title: "Error applying corrections",
        description: "Failed to apply all corrections. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    text,
    setText,
    activeTab,
    setActiveTab,
    showCorrectTab,
    localCorrections,
    textareaRef,
    stats,
    isChecking,
    suggestions,
    isLoadingSuggestions,
    checkGrammar,
    handleTextChange,
    handleSuggestionSelect,
    insertCorrection,
    applyAllCorrections
  };
};
