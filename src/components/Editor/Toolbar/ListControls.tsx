import React from 'react';
import { type Editor } from '@tiptap/react';
import { List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListControlsProps {
  editor: Editor;
}

export const ListControls: React.FC<ListControlsProps> = ({ editor }) => {
  return (
    <>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('bulletList') ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
        <List className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('orderedList') ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
        <ListOrdered className="w-4 h-4" />
      </button>
    </>
  );
};
