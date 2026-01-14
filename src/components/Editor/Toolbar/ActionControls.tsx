import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionControlsProps {
  isGeneratingPDF: boolean;
  onDownload: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ isGeneratingPDF, onDownload }) => {
  return (
    <button
      onClick={onDownload}
      disabled={isGeneratingPDF}
      className={cn(
        "p-1.5 rounded transition-colors flex items-center gap-1",
        isGeneratingPDF ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"
      )}
      title="Download PDF"
    >
      {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
    </button>
  );
};
