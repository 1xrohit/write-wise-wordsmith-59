
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
        
        // Try to extract JSON from the response
        try {
          // Look for JSON object in the response - more robust pattern
          let jsonStr = content;
          
          // Remove any markdown code blocks if present
          if (content.includes('```json')) {
            jsonStr = content.replace(/```json|```/g, '').trim();
          }
          
          // If there are multiple JSON objects, find the one with corrections
          let parsedData;
          try {
            parsedData = JSON.parse(jsonStr);
          } catch (e) {
            // If direct parsing fails, try to extract using regex
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
              parsedData = JSON.parse(jsonStr);
            } else {
              throw new Error('Could not extract valid JSON from response');
            }
          }
          
          console.log('Parsed data:', parsedData);
          
          if (parsedData?.corrections && Array.isArray(parsedData.corrections)) {
            const newCorrections = parsedData.corrections;
            console.log('Extracted corrections:', newCorrections);
            
            setLocalCorrections(newCorrections);
            setCorrections(newCorrections);
            
            // Generate corrected text with all corrections applied
            const fullyCorrected = generateCorrectedText(text, newCorrections);
            console.log('Generated corrected text:', fullyCorrected);
            
            setCorrectedText(fullyCorrected);
            
            // Show the correct tab
            setShowCorrectTab(true);
            
            // Navigate directly to the correct tab
            setActiveTab("correct");
            
            toast({
              title: "Text analyzed",
              description: `Found ${newCorrections.length} potential improvements`,
            });
          } else {
            console.error('No corrections array in response', parsedData);
            throw new Error('No corrections array in response');
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
