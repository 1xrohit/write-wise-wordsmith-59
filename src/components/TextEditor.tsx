
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  explanation: string;
  startIndex: number;
  endIndex: number;
}

const API_BASE_URL = 'https://deepak191z-fastapi-chat3.hf.space/v1';

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatError';
  }
}

export async function sendMessage(content: string, replyToContent?: string): Promise<Response> {
  try {
    // Combine replyToContent and user input if reply exists
    const finalContent = replyToContent 
      ? `${replyToContent}\n\n${content}`
      : content;

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: finalContent,
          },
        ],
        model: 'gpt-4o-mini',
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new ChatError(`Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError('Failed to connect to chat service');
  }
}

interface TextEditorProps {
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
  setTextStats: React.Dispatch<React.SetStateAction<{
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    readabilityScore: number;
  }>>;
}

const TextEditor: React.FC<TextEditorProps> = ({ setCorrections, setActiveCorrection, setTextStats }) => {
  const [text, setText] = useState<string>("Welcome to WriteWise! Try typing a sentence with some common errors, like 'their are alot of mistakes that effect my writing.' Our grammar checker will help identify and explain issues.");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [corrections, setLocalCorrections] = useState<Correction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Text statistics state
  const [stats, setStats] = useState({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    readabilityScore: 0
  });

  useEffect(() => {
    // Auto-resize the textarea when text changes
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Calculate text stats whenever text changes
    calculateTextStats(text);
  }, [text]);

  const calculateTextStats = (text: string) => {
    // Basic text stats calculation
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const charCount = text.length;
    const sentenceCount = text.split(/[.!?]+/).length - 1 || 0;
    // Simple readability score (0-100) based on sentence and word length
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
    
    const newStats = {
      wordCount,
      charCount,
      sentenceCount,
      readabilityScore: Math.round(readabilityScore),
    };
    
    setStats(newStats);
    setTextStats(newStats);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const checkGrammar = async () => {
    setIsChecking(true);
    
    try {
      // Prepare the prompt for grammar checking
      const prompt = `Please analyze the following text for grammar, spelling, punctuation, and style issues. Return the results in a JSON format with an array called "corrections" where each correction has the following structure:
      {
        "original": "the incorrect text",
        "suggestion": "the corrected text",
        "type": "grammar/spelling/punctuation/style",
        "explanation": "why this correction is needed",
        "startIndex": the character position where the error starts in the original text,
        "endIndex": the character position where the error ends in the original text
      }
      
      Here is the text to analyze:
      "${text}"`;
      
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
        description: error instanceof ChatError ? error.message : "Failed to check grammar",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'grammar': return 'bg-blue-500 text-white';
      case 'spelling': return 'bg-green-500 text-white';
      case 'punctuation': return 'bg-yellow-500 text-white';
      case 'style': return 'bg-purple-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Moderate';
    return 'Needs Improvement';
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="w-full">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              className="text-editor resize-none min-h-[300px] focus:ring-1 focus:ring-primary transition-all"
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              style={{ overflow: 'hidden' }} // Hide scrollbars as height increases
              aria-label="Text editor"
            />
            <div className="absolute bottom-4 right-4">
              <Button 
                onClick={checkGrammar} 
                disabled={isChecking || !text.trim().length}
                className="shadow-sm"
              >
                {isChecking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...</> : "Check Grammar"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="w-full">
          <div className="text-editor overflow-auto min-h-[300px] border border-input rounded-md p-3">
            {text}
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="w-full">
          <div className="space-y-4 min-h-[300px]">
            {corrections.length === 0 ? (
              <div className="flex flex-col h-64 items-center justify-center text-center p-4 border rounded-md border-dashed">
                <p className="text-muted-foreground mb-2">No suggestions yet</p>
                <p className="text-sm text-muted-foreground">Check your text to get grammar and style suggestions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {corrections.map((correction, index) => (
                  <Card key={index} className="transition-all">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-center">
                        <Badge className={getTypeBadgeColor(correction.type)}>
                          {correction.type.charAt(0).toUpperCase() + correction.type.slice(1)}
                        </Badge>
                        
                        <div className="flex space-x-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Accept</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-3">
                      <div>
                        <div className="line-through text-muted-foreground text-sm">{correction.original}</div>
                        <div className="font-medium text-sm">{correction.suggestion}</div>
                      </div>
                      
                      <CardDescription className="mt-2 text-sm">
                        {correction.explanation}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground pb-4">
        <div className="flex justify-between mb-4">
          <div>
            Last saved: Just now
          </div>
          <div>
            Press "Check Grammar" to analyze your text
          </div>
        </div>
        
        {/* Text Statistics */}
        <div className="border-t pt-4">
          <h2 className="text-base font-semibold mb-4">Text Statistics</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm font-medium">Words</CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <p className="text-xl font-bold">{stats.wordCount}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm font-medium">Characters</CardTitle>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <p className="text-xl font-bold">{stats.charCount}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-4">
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm font-medium">Readability</CardTitle>
            </CardHeader>
            <CardContent className="px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">{getReadabilityLabel(stats.readabilityScore)}</span>
                <span className="text-sm font-semibold">{stats.readabilityScore}/100</span>
              </div>
              <Progress className="h-2" value={stats.readabilityScore} />
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground">
            <p>Based on {stats.sentenceCount} sentences</p>
            <p className="mt-1">Average words per sentence: {stats.wordCount > 0 && stats.sentenceCount > 0 ? 
              (stats.wordCount / stats.sentenceCount).toFixed(1) : 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
