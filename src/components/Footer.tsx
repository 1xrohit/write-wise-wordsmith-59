
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t px-6 py-4 text-sm text-muted-foreground mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} WriteWise. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
