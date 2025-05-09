
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TextEditor from '@/components/TextEditor';

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
  const [textStats, setTextStats] = useState({
    wordCount: 0,
    charCount: 0,
    sentenceCount: 0,
    readabilityScore: 0,
  });

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <TextEditor 
          setCorrections={setCorrections} 
          setActiveCorrection={setActiveCorrection}
          setTextStats={setTextStats}
        />
      </div>
    </Layout>
  );
};

export default Index;
