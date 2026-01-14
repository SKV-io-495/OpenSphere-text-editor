import React from 'react';
import { type Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Palette, 
  Highlighter, 
  Link as LinkIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormatControlsProps {
  editor: Editor;
  openLinkModal: () => void;
}

export const FormatControls: React.FC<FormatControlsProps> = ({ editor, openLinkModal }) => {
  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('bold') ? "bg-purple-100 text-purple-700" : "text-gray-600")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('italic') ? "bg-purple-100 text-purple-700" : "text-gray-600")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('underline') ? "bg-purple-100 text-purple-700" : "text-gray-600")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      {/* Color Picker */}
      <label className="p-1.5 rounded hover:bg-gray-100 cursor-pointer flex items-center justify-center text-gray-600" title="Text Color">
        <Palette className="w-4 h-4" />
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="absolute opacity-0 w-0 h-0"
        />
      </label>

       {/* Highlight (Toggle Yellow) */}
       <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()}
        className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('highlight') ? "bg-yellow-100 text-orange-600" : "text-gray-600")}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </button>

      {/* Link (Opens Modal) */}
      <button
        onClick={openLinkModal}
        className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('link') ? "bg-purple-100 text-purple-700" : "text-gray-600")}
        title="Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </>
  );
};
