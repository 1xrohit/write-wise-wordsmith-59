
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TextEditor from '@/components/TextEditor';
import SuggestionsSidebar from '@/components/SuggestionsSidebar';
import StatsDashboard from '@/components/StatsDashboard';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Correction {
  original: string;
  suggestion: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  explanation: string;
  startIndex: number;
  endIndex: number;
}

const Index = () => {
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [activeCorrection, setActiveCorrection] = useState<Correction | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [textStats, setTextStats] = useState({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    readabilityScore: 0,
  });

  return (
    <Layout>
      <div className="flex h-[calc(100vh-8.5rem)] relative">
        {/* Main Editor Area */}
        <div className="flex-1 p-6 overflow-auto">
          <TextEditor 
            setCorrections={setCorrections} 
            setActiveCorrection={setActiveCorrection}
            setTextStats={setTextStats}
          />
        </div>
        
        {/* Sidebar Toggle Button (Mobile/Tablet) */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-4 md:hidden z-20"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        
        {/* Right Sidebar */}
        <div className={`w-80 border-l bg-sidebar p-4 flex flex-col transition-all duration-300 overflow-hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative right-0 top-0 bottom-0 z-10`}>
          <div className="flex-1 mb-4 overflow-hidden">
            <SuggestionsSidebar 
              corrections={corrections}
              activeCorrection={activeCorrection}
              setActiveCorrection={setActiveCorrection}
            />
          </div>
          
          <div className="border-t pt-4">
            <StatsDashboard stats={textStats} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
