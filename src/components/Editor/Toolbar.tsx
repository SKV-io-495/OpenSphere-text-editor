'use client';

import React, { useState } from 'react';
import { type Editor } from '@tiptap/react';
import { Modal } from '@/components/ui/Modal';
import { FontControls } from './Toolbar/FontControls';
import { FormatControls } from './Toolbar/FormatControls';
import { AlignmentControls } from './Toolbar/AlignmentControls';
import { ListControls } from './Toolbar/ListControls';
import { TableControls } from './Toolbar/TableControls';
import { ActionControls } from './Toolbar/ActionControls';

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // Force re-render on editor state changes
  const [, forceUpdate] = useState({});

  React.useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      forceUpdate({});
    };

    // Listen to all relevant events that should trigger UI updates
    editor.on('transaction', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('update', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
      editor.off('update', handleUpdate);
    };
  }, [editor]);
  
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

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap shadow-sm">
        
        {/* Font Controls: Family & Size */}
        <FontControls editor={editor} />
        
        <div className="h-6 w-px bg-gray-300 mx-1" />

        {/* Formatting: Bold, Italic, Color, Link... */}
        <FormatControls editor={editor} openLinkModal={openLinkModal} />

        <div className="h-6 w-px bg-gray-300 mx-1" />

        {/* Alignment: Left, Center, Right, Justify */}
        <AlignmentControls editor={editor} />

        <div className="h-6 w-px bg-gray-300 mx-1" />

        {/* Lists: Bullet, Ordered */}
        <ListControls editor={editor} />

        <div className="h-6 w-px bg-gray-300 mx-1" />

        {/* Tables: Insert, Add Col/Row, Delete */}
        <TableControls editor={editor} />

        <div className="h-6 w-px bg-gray-300 mx-1" />

        <div className="flex-1" />

        {/* Actions: Download PDF */}
        <ActionControls isGeneratingPDF={isGeneratingPDF} onDownload={handleDownloadPDF} />
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
