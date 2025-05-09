
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Correction, TextStats } from './utils/textUtils';
import { useTextEditor } from './hooks/useTextEditor';

// Import tabs
import WriteTab from './tabs/WriteTab';
import PreviewTab from './tabs/PreviewTab';
import SuggestionsTab from './tabs/SuggestionsTab';
import CorrectTab from './tabs/CorrectTab';
import StatsDisplay from './components/StatsDisplay';

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
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          {showCorrectTab && <TabsTrigger value="correct">Correct</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="write">
          <WriteTab 
            text={text} 
            onTextChange={handleTextChange} 
            onCheckGrammar={checkGrammar}
            isChecking={isChecking}
            textareaRef={textareaRef}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionSelect}
            isLoadingSuggestions={isLoadingSuggestions}
          />
        </TabsContent>
        
        <TabsContent value="preview">
          <PreviewTab text={text} />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <SuggestionsTab corrections={localCorrections} />
        </TabsContent>

        <TabsContent value="correct">
          <CorrectTab 
            corrections={localCorrections} 
            onInsertCorrection={insertCorrection}
            onApplyAllCorrections={applyAllCorrections}
          />
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-muted-foreground pb-4">
        {/* Text Statistics */}
        <StatsDisplay stats={stats} />
      </div>
    </div>
  );
};

export default TextEditor;
