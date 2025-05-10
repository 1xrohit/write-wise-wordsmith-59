
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sendMessage, createGrammarCheckPrompt } from '@/services/grammarAPI';
import { Correction, generateCorrectedText } from '../utils/textUtils';

interface UseGrammarCheckProps {
  text: string;
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setLocalCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setCorrectedText: React.Dispatch<React.SetStateAction<string>>;
  setShowCorrectTab: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const useGrammarCheck = ({
  text,
  setCorrections,
  setLocalCorrections,
  setCorrectedText,
  setShowCorrectTab,
  setActiveTab,
}: UseGrammarCheckProps) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const extractJSON = (content: string): any => {
    // Try direct parsing first
    try {
      return JSON.parse(content);
    } catch (e) {
      console.log("Direct parsing failed, trying to extract JSON", e);
    }
    
    // If direct parsing fails, try to extract JSON from markdown
    try {
      // Remove markdown code blocks
      if (content.includes('```')) {
        const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          return JSON.parse(jsonMatch[1].trim());
        }
      }
      
      // Try to find JSON object pattern
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("JSON extraction failed", e);
      throw new Error('Could not extract valid JSON from response');
    }
    
    throw new Error('No JSON found in response');
  };

  const checkGrammar = async () => {
    setIsChecking(true);
    
    try {
      // Prepare the prompt for grammar checking
      const prompt = createGrammarCheckPrompt(text);
      
      const response = await sendMessage(prompt);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        console.log('API Content:', content);
        
        // Extract JSON from the response
        try {
          const parsedData = extractJSON(content);
          console.log('Parsed data:', parsedData);
          
          if (parsedData?.corrections && Array.isArray(parsedData.corrections)) {
            const newCorrections = parsedData.corrections;
            console.log('Extracted corrections:', newCorrections);
            
            // Validate correction data
            const validatedCorrections = newCorrections.filter(correction => {
              return (
                typeof correction.original === 'string' &&
                typeof correction.suggestion === 'string' &&
                typeof correction.startIndex === 'number' &&
                typeof correction.endIndex === 'number' &&
                correction.startIndex >= 0 &&
                correction.endIndex > correction.startIndex
              );
            });
            
            if (validatedCorrections.length === 0) {
              toast({
                title: "No issues found",
                description: "Your text looks good! No corrections needed.",
              });
              setIsChecking(false);
              return;
            }
            
            setLocalCorrections(validatedCorrections);
            setCorrections(validatedCorrections);
            
            // Generate corrected text with all corrections applied
            const fullyCorrected = generateCorrectedText(text, validatedCorrections);
            console.log('Generated corrected text:', fullyCorrected);
            
            setCorrectedText(fullyCorrected);
            
            // Show the correct tab
            setShowCorrectTab(true);
            
            // Navigate directly to the correct tab
            setActiveTab("correct");
            
            toast({
              title: "Text analyzed",
              description: `Found ${validatedCorrections.length} potential improvements`,
            });
          } else {
            console.error('No corrections array in response', parsedData);
            toast({
              title: "No issues found",
              description: "Your text looks good! No corrections needed.",
            });
          }
        } catch (jsonError) {
          console.error('Failed to parse corrections:', jsonError, content);
          toast({
            title: "Analysis error",
            description: "Unable to process grammar suggestions",
            variant: "destructive"
          });
        }
      } else {
        console.error('Invalid API response format', data);
        throw new Error('Invalid API response format');
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

  return {
    isChecking,
    checkGrammar
  };
};
