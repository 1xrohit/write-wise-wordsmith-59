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
  
  // Sort corrections by start index in descending order
  // This way we can apply corrections from end to start to avoid index shifting
  const sortedCorrections = [...corrections].sort((a, b) => b.startIndex - a.startIndex);
  
  let result = originalText;
  
  for (const correction of sortedCorrections) {
    const before = result.substring(0, correction.startIndex);
    const after = result.substring(correction.endIndex);
    
    // Get the spaces before and after the correction
    const spacesBefore = before.match(/\s*$/)[0];
    const spacesAfter = after.match(/^\s*/)[0];
    
    // Apply the correction while preserving spacing
    result = before.slice(0, -spacesBefore.length) + 
             (spacesBefore.length > 0 ? ' ' : '') +
             correction.suggestion.trim() +
             (spacesAfter.length > 0 ? ' ' : '') +
             after.slice(spacesAfter.length);
  }
  
  // Clean up any double spaces that might have been created
  return result.replace(/\s+/g, ' ').trim();
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