
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Settings, User, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b px-6 py-3 flex items-center justify-between bg-white">
      <div className="flex items-center">
        <FileText className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-xl font-semibold">WriteWise</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
