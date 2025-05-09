
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sendMessage, createGrammarCheckPrompt } from '@/services/grammarAPI';
import { TextStats, Correction, generateCorrectedText } from '../utils/textUtils';

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

  const checkGrammar = async () => {
    setIsChecking(true);
    
    try {
      // Prepare the prompt for grammar checking
      const prompt = createGrammarCheckPrompt(text);
      
      const response = await sendMessage(prompt);
      const data = await response.json();
      
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        // Try to extract JSON from the response
        try {
          // Look for JSON object in the response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsedData = JSON.parse(jsonStr);
            
            if (parsedData.corrections && Array.isArray(parsedData.corrections)) {
              const newCorrections = parsedData.corrections;
              setLocalCorrections(newCorrections);
              setCorrections(newCorrections);
              
              // Generate corrected text with all corrections applied
              const fullyCorrected = generateCorrectedText(text, newCorrections);
              setCorrectedText(fullyCorrected);
              
              // Show the correct tab
              setShowCorrectTab(true);
              
              // Auto switch to the suggestions tab
              setActiveTab("suggestions");
              
              toast({
                title: "Text analyzed",
                description: `Found ${newCorrections.length} potential improvements`,
              });
            } else {
              throw new Error('No corrections array in response');
            }
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (jsonError) {
          console.error('Failed to parse corrections:', jsonError);
          toast({
            title: "Analysis error",
            description: "Unable to process grammar suggestions",
            variant: "destructive"
          });
        }
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
