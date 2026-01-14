'use client';

import React, { useState } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Check,
  Download,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { SaveStatus } from '@/hooks/useDocumentSave';

interface ToolbarProps {
  editor: Editor | null;
  status?: SaveStatus;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, status = 'saved' }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!editor) {
    return null;
  }

  const handleDownloadPDF = async () => {
    if (!editor || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      // Get HTML content from the editor
      const html = editor.getHTML();

      // Call the PDF generation API
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const fonts = [
    { name: 'Serif (Times)', value: '"Times New Roman", Times, serif' },
    { name: 'Sans (Inter)', value: 'Inter, sans-serif' },
  ];

  return (
    <div className="sticky top-16 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
      {/* Font Family Selector */}
      <div className="relative inline-block text-left mr-2">
        <select
          className="block w-40 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md border"
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || '"Times New Roman", Times, serif'}
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* Formatting Tools */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive('bold') ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive('italic') ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive('underline') ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive({ textAlign: 'left' }) ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive({ textAlign: 'center' }) ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive({ textAlign: 'right' }) ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      
       <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive({ textAlign: 'justify' }) ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive('bulletList') ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "p-1.5 rounded hover:bg-gray-100 transition-colors",
          editor.isActive('orderedList') ? "bg-purple-100 text-purple-700" : "text-gray-600"
        )}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-2" />

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className={cn(
          "p-1.5 rounded transition-colors flex items-center gap-1",
          isGeneratingPDF 
            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
            : "hover:bg-gray-100 text-gray-600"
        )}
        title="Download PDF"
      >
        {isGeneratingPDF ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Generating...</span>
          </>
        ) : (
          <Download className="w-4 h-4" />
        )}
      </button>
      
      <div className="ml-auto flex items-center text-xs text-gray-400 gap-2">
         <div className="flex items-center gap-1 min-w-[60px] justify-end">
             {status === 'saving' ? (
                <span className="text-gray-400">Saving...</span>
             ) : (
               <>
                 <Check className="w-3 h-3 text-green-500" />
                 <span className="text-green-600">Saved</span>
               </>
             )}
         </div>
      </div>
    </div>
  );
};
