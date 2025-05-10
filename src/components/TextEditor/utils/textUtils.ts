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
  
  // Sort corrections by start index in ascending order
  const sortedCorrections = [...corrections].sort((a, b) => a.startIndex - b.startIndex);
  
  let result = '';
  let currentIndex = 0;
  
  // Apply each correction in order
  for (const correction of sortedCorrections) {
    if (correction.startIndex < currentIndex) {
      console.warn('Overlapping corrections detected, skipping:', correction);
      continue;
    }
    
    // Add text before the correction
    result += originalText.substring(currentIndex, correction.startIndex);
    
    // Add the suggested correction
    result += correction.suggestion;
    
    // Update currentIndex to after the correction
    currentIndex = correction.endIndex;
  }
  
  // Add any remaining text after the last correction
  if (currentIndex < originalText.length) {
    result += originalText.substring(currentIndex);
  }
  
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
