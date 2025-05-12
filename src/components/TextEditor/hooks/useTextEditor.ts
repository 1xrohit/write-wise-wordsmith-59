
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { TextStats, Correction, calculateTextStats } from '../utils/textUtils';
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
    setActiveTab
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

  // Function to insert a single correction
  const insertCorrection = (correction: Correction) => {
    try {
      console.log('Applying single correction:', correction);
      
      // For a single correction, we manually make the change
      // since we don't have position information in the new format
      if (!correction.error || !correction.suggestion) {
        toast({
          title: "Invalid correction",
          description: "The correction does not contain valid data.",
          variant: "destructive"
        });
        return;
      }
      
      // Simple replacement of the error with the suggestion
      const newText = text.replace(correction.error, correction.suggestion);
      
      // If the text didn't change, show an error
      if (newText === text) {
        toast({
          title: "Cannot apply correction",
          description: "Could not find the text to correct in the current document.",
          variant: "destructive"
        });
        return;
      }
      
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

  // Function to apply all corrections at once
  const applyAllCorrections = () => {
    try {
      console.log('Applying all corrections');
      
      if (!correctedText) {
        toast({
          title: "No corrected text",
          description: "There is no corrected text to apply.",
          variant: "destructive"
        });
        return;
      }
      
      // Set the fully corrected text from the API response
      setText(correctedText);
      
      // Clear the corrections since they've been applied
      setLocalCorrections([]);
      setCorrections([]);
      
      // Switch to write tab to show the corrections
      setActiveTab("write");
      
      toast({
        title: "All corrections applied",
        description: "All corrections have been applied to your text.",
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
