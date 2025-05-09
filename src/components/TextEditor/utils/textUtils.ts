
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
  // Start with the original text
  let result = originalText;
  
  // Sort corrections from end to beginning to avoid index shifting
  const sortedCorrections = [...corrections].sort((a, b) => b.startIndex - a.startIndex);
  
  // Apply each correction
  sortedCorrections.forEach(correction => {
    // Get text before correction
    const beforeCorrection = result.substring(0, correction.startIndex);
    // Get text after correction
    const afterCorrection = result.substring(correction.endIndex);
    
    // Replace with the suggested correction without adding extra spaces
    result = beforeCorrection + correction.suggestion + afterCorrection;
  });
  
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
