import React from 'react';
import { type Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlignmentControlsProps {
  editor: Editor;
}

export const AlignmentControls: React.FC<AlignmentControlsProps> = ({ editor }) => {
  return (
    <div className="flex gap-0.5">
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive({ textAlign: 'left' }) ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
          <AlignLeft className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive({ textAlign: 'center' }) ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
          <AlignCenter className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive({ textAlign: 'right' }) ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
          <AlignRight className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive({ textAlign: 'justify' }) ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
          <AlignJustify className="w-4 h-4" />
      </button>
    </div>
  );
};
