
import React from 'react';

interface SuggestionWordsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}

const SuggestionWords: React.FC<SuggestionWordsProps> = ({ 
  suggestions, 
  onSuggestionClick, 
  isLoading 
}) => {
  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Suggested Words</h3>
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-wrap gap-2">
          {isLoading && (
            <span className="px-3 py-1 text-sm font-medium bg-muted/50 rounded-full">
              Loading...
            </span>
          )}
          {!isLoading && suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm font-medium bg-white text-gray-700 border 
              border-gray-300 hover:bg-gray-100 rounded-full transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestionWords;
