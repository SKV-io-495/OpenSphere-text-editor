'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Toolbar } from './Toolbar';

import { PaginationExtension } from './extensions/PaginationExtension';
// import { PageBreak } from './extensions/PageBreak'; // Removed old node approach

import { useDocumentSave } from '@/hooks/useDocumentSave';

export const TiptapEditor = () => {
  const { status, saveDocument } = useDocumentSave();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      PaginationExtension, // New Decoration Plugin
      // PageBreak, // Removed
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: `
      <h2>O-1A Visa Case Strategy</h2>
      <p><strong>Beneficiary:</strong> Mr. Atal Agarwal</p>
      <p><strong>Visa Classification:</strong> O-1A (Individuals with Extraordinary Ability in Sciences, Education, Business, or Athletics)</p>
      <p><strong>Date:</strong> January 9, 2026</p>
      <p><strong>Case Overview</strong></p>
      <p>This case involves securing O-1A classification for Mr. Atal Agarwal based on extraordinary ability in [specify field]. The primary goal is to demonstrate sustained national or international acclaim.</p>
      <p>The primary goal is to demonstrate sustained national or international acclaim and recognition for achievements in the field through comprehensive documentation.</p>
      <p><strong>Primary Objective:</strong> [Establish specific employment purpose and duration in the U.S.]</p>
      <p><strong>Target Filing Date:</strong> [Add target date]</p>
      <p><strong>Anticipated Start Date:</strong> [Add intended start date of U.S. employment]</p>
      <p><strong>Eligibility Strategy</strong></p>
      <p>To qualify for O-1A classification, we must establish at least 3 of the 8 regulatory criteria.</p>
      <p>We will construct a narrative that ties these criteria to his specific contributions.</p>
      <p><strong>Evidence Collection Plan:</strong> We need to gather letters from experts.</p>
      <p>... (More content to fill page) ...</p>
    `,
    editorProps: {
      attributes: {
        // VISUAL STYLING (Screen)
        // - w-[8.5in]: Matches US Letter width
        // - min-h-[11in]: Matches US Letter height
        // - padding: 1in (96px)
        // - shadow-xl: Creates the "Paper" elevation effect
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none bg-white min-h-[1056px] shadow-xl mb-8 flex flex-col !max-w-none',
        style: 'width: 8.5in; padding: 96px; font-family: "Times New Roman", Times, serif;',
      },
    },
    onUpdate: ({ editor }) => {
       // Auto-pagination is handled by the plugin now.

       // Save Logic
       if (timeoutRef.current) clearTimeout(timeoutRef.current);
       timeoutRef.current = setTimeout(() => {
         saveDocument(editor.getJSON());
       }, 1500);
    }
  });

  return (
    <div className="flex flex-col w-full items-center bg-[#F3F4F6] pb-10">
      <Toolbar editor={editor} status={status} />

      {/* Editor Container - The "Paper" is now the editor itself, but we wrap it to center it */}
      <div
        className="mt-8 shadow-xl print:shadow-none print:m-0 print:w-full"
        // style={{ width: '816px' }} // Width is handled by editor attributes now
      >
         <EditorContent editor={editor} />
      </div>
    </div>
  );
};
