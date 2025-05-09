
import React from 'react';

interface PreviewTabProps {
  text: string;
}

const PreviewTab: React.FC<PreviewTabProps> = ({ text }) => {
  return (
    <div className="text-editor overflow-auto min-h-[300px] border border-input rounded-md p-3">
      {text}
    </div>
  );
};

export default PreviewTab;
