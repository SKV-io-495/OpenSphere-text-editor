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
  Loader2,
  Type,
  Link as LinkIcon,
  Palette,
  Highlighter,
  Table as TableIcon,
  Plus,
  Trash,
  Columns,
  Rows,
  FileType
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SaveStatus } from '@/hooks/useDocumentSave';
import { Modal } from '@/components/ui/Modal';

interface ToolbarProps {
  editor: Editor | null;
  status?: SaveStatus;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, status = 'saved' }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  /* --- MODAL STATES --- */
  const [activeModal, setActiveModal] = useState<'link' | null>(null);
  
  // Link State
  const [linkUrl, setLinkUrl] = useState('');

  const handleDownloadPDF = async () => {
    if (!editor || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const html = editor.getHTML();
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

      const blob = await response.blob();
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

  if (!editor) {
    return null;
  }

  // Handlers to open modals
  const openLinkModal = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setActiveModal('link');
  };

  // Handlers to submit modals
  const submitLink = () => {
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // If selection is empty, insert the URL as text with the link
      if (editor.state.selection.empty) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
      } else {
        // Otherwise apply link to selected text
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
    }
    setActiveModal(null);
  };

  const fontSizes = [10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72];

  const fonts = [
    { name: 'Serif (Times)', value: '"Times New Roman", Times, serif' },
    { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
    { name: 'Comic Sans', value: '"Comic Sans MS", "Comic Sans", cursive' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { name: 'Lucida', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Bookman Old', value: '"Bookman Old Style", serif' },
    { name: 'Garamond', value: 'Garamond, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
  ];

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shadow-sm">
      
      {/* ... (Existing Font/Format Buttons) ... */}
      
      {/* --- FONT FAMILY --- */}
      <div className="relative inline-block text-left">
        <select
          className="block w-32 pl-2 pr-8 py-1.5 text-xs text-gray-700 border-gray-300 focus:outline-none focus:border-purple-500 rounded-md border"
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontFamily || '"Times New Roman", Times, serif'}
          title="Font Family"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* --- FONT SIZE --- */}
      <div className="relative inline-block text-left">
        <select
          className="block w-16 pl-2 pr-6 py-1.5 text-xs text-gray-700 border-gray-300 focus:outline-none focus:border-purple-500 rounded-md border"
          onChange={(e) => editor.chain().focus().setFontSize(`${e.target.value}px`).run()}
          value={parseInt(editor.getAttributes('textStyle').fontSize) || 16}
          title="Font Size"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="h-6 w-px bg-gray-300 mx-1" />

       {/* --- FORMATTING --- */}
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

      <div className="h-6 w-px bg-gray-300 mx-1" />

       {/* --- ALIGNMENT --- */}
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

      <div className="h-6 w-px bg-gray-300 mx-1" />

      {/* --- LISTS --- */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('bulletList') ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
        <List className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('orderedList') ? "bg-purple-100 text-purple-700" : "text-gray-600")}>
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1" />

      {/* --- TABLES --- */}
      <button
        onClick={addTable}
        className={cn("p-1.5 rounded hover:bg-gray-100 text-gray-600")}
        title="Insert Table"
      >
        <TableIcon className="w-4 h-4" />
      </button>

      {editor.isActive('table') && (
        <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded border ml-1 animate-in fade-in slide-in-from-left-2">
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Add Column">
                <Columns className="w-3 h-3" />
            </button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Add Row">
                <Rows className="w-3 h-3" />
            </button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 hover:bg-red-100 text-red-500 rounded" title="Delete Table">
                <Trash className="w-3 h-3" />
            </button>
        </div>
      )}

      <div className="h-6 w-px bg-gray-300 mx-1" />

      <div className="flex-1" />

      {/* --- ACTIONS --- */}
      <button
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className={cn(
          "p-1.5 rounded transition-colors flex items-center gap-1",
          isGeneratingPDF ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"
        )}
        title="Download PDF"
      >
        {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </button>
      
      <div className="flex items-center text-xs text-gray-400 gap-2 ml-2">
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

      {/* --- MODALS --- */}
      
      {/* Link Modal */}
      <Modal
        isOpen={activeModal === 'link'}
        onClose={() => setActiveModal(null)}
        title="Insert Link"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={submitLink} className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">Save</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
