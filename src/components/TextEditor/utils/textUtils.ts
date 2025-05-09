
export interface TextStats {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  readabilityScore: number;
}

export const calculateTextStats = (text: string): TextStats => {
  // Basic text stats calculation
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).length - 1 || 0;
  // Simple readability score (0-100) based on sentence and word length
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
  
  return {
    wordCount,
    charCount,
    sentenceCount,
    readabilityScore: Math.round(readabilityScore),
  };
};

export const getReadabilityLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 50) return 'Moderate';
  return 'Needs Improvement';
};

export interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  explanation: string;
  startIndex: number;
  endIndex: number;
}

export const generateCorrectedText = (originalText: string, corrections: Correction[]): string => {
  if (corrections.length === 0) return originalText;
  
  // Instead of modifying the original text piece by piece, let's create
  // a new text with proper spacing from scratch using character positions
  
  // Sort corrections by start index (ascending order)
  const sortedCorrections = [...corrections].sort((a, b) => a.startIndex - b.startIndex);
  
  let result = '';
  let lastIndex = 0;
  
  for (const correction of sortedCorrections) {
    // Add text between last correction and this one
    result += originalText.substring(lastIndex, correction.startIndex);
    
    // Add the correction with space consideration
    const needsSpaceBefore = 
      result.length > 0 && 
      !result.endsWith(' ') && 
      !correction.suggestion.startsWith(' ');
      
    if (needsSpaceBefore) {
      result += ' ';
    }
    
    // Add the suggestion
    result += correction.suggestion;
    
    // Check if we need to add space after
    const textAfter = originalText.substring(correction.endIndex);
    const needsSpaceAfter = 
      textAfter.length > 0 && 
      !textAfter.startsWith(' ') && 
      !correction.suggestion.endsWith(' ');
      
    if (needsSpaceAfter) {
      result += ' ';
    }
    
    // Update last index to continue from the end of this correction
    lastIndex = correction.endIndex;
  }
  
  // Add any remaining text after the last correction
  if (lastIndex < originalText.length) {
    result += originalText.substring(lastIndex);
  }
  
  // Clean up any multiple spaces
  result = result.replace(/\s{2,}/g, ' ');
  
  return result;
};

export const getTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'grammar': return 'bg-blue-500 text-white';
    case 'spelling': return 'bg-green-500 text-white';
    case 'punctuation': return 'bg-yellow-500 text-white';
    case 'style': return 'bg-purple-500 text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};
