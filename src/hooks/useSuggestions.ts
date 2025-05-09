
import { useState, useEffect } from 'react';

export function useSuggestions(text: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!text.trim()) {
        setSuggestions([]);
        return;
      }
      
      // Get the last word the user is typing
      const words = text.split(/\s+/);
      const lastWord = words[words.length - 1].trim();
      
      // Only fetch suggestions if the last word has at least 2 characters
      if (lastWord.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${lastWord}`);
        const data = await response.json();
        const suggestionWords = data
          .map((item: { word: string }) => item.word)
          .slice(0, 5); // Limit to 5 suggestions
        setSuggestions(suggestionWords);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the API calls to prevent too many requests
    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [text]);

  const handleSuggestionClick = (suggestion: string, currentText: string) => {
    // Replace the last word with the suggestion
    const words = currentText.split(/\s+/);
    words[words.length - 1] = suggestion;
    const newText = words.join(' ');
    
    return newText;
  };

  return {
    suggestions,
    isLoading,
    handleSuggestionClick,
  };
}
