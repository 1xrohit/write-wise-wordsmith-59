
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

  // Use the grammar check hook
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
