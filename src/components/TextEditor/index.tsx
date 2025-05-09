
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Correction, TextStats } from './utils/textUtils';
import { useTextEditor } from './hooks/useTextEditor';

// Import tabs
import WriteTab from './tabs/WriteTab';
import PreviewTab from './tabs/PreviewTab';
import CorrectTab from './tabs/CorrectTab';
import StatsDisplay from './StatsDisplay';
import SuggestionWords from './SuggestionWords';

interface TextEditorProps {
  setCorrections: React.Dispatch<React.SetStateAction<Correction[]>>;
  setActiveCorrection: React.Dispatch<React.SetStateAction<Correction | null>>;
  setTextStats: React.Dispatch<React.SetStateAction<TextStats>>;
}

const TextEditor: React.FC<TextEditorProps> = ({ 
  setCorrections, 
  setActiveCorrection, 
  setTextStats 
}) => {
  const {
    text,
    activeTab,
    setActiveTab,
    showCorrectTab,
    localCorrections,
    textareaRef,
    stats,
    isChecking,
    suggestions,
    isLoadingSuggestions,
    checkGrammar,
    handleTextChange,
    handleSuggestionSelect,
    insertCorrection,
    applyAllCorrections
  } = useTextEditor({
    setCorrections,
    setActiveCorrection,
    setTextStats
  });

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {showCorrectTab && <TabsTrigger value="correct">Correct</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="write">
          <WriteTab 
            text={text} 
            onTextChange={handleTextChange} 
            onCheckGrammar={checkGrammar}
            isChecking={isChecking}
            textareaRef={textareaRef}
            isLoadingSuggestions={isLoadingSuggestions}
            wordCount={stats.wordCount} // Pass the word count from stats
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <PreviewTab text={text} />
        </TabsContent>

        <TabsContent value="correct">
          <CorrectTab 
            corrections={localCorrections} 
            onInsertCorrection={insertCorrection}
            onApplyAllCorrections={applyAllCorrections}
          />
        </TabsContent>
      </Tabs>
      
      {/* Suggestion Words - Moved outside text editor and above stats */}
      <SuggestionWords 
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionSelect}
        isLoading={isLoadingSuggestions}
      />
      
      <div className="text-sm text-muted-foreground pb-4">
        {/* Text Statistics */}
        <StatsDisplay stats={stats} />
      </div>
    </div>
  );
};

export default TextEditor;
