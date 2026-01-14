'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Toolbar } from './Toolbar';

import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TablePlus as Table, TableRowPlus as TableRow, TableHeaderPlus as TableHeader, TableCellPlus as TableCell } from 'tiptap-table-plus';
import { FontSize } from './extensions/FontSizeExtension';
import { PaginationPlus, PAGE_SIZES  } from 'tiptap-pagination-plus';


import { useDocumentSave } from '@/hooks/useDocumentSave';

export const TiptapEditor = () => {
  const { status, saveDocument } = useDocumentSave();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const extensions = React.useMemo(() => [
    StarterKit.configure({
       link: {
         openOnClick: false,
         autolink: true,
       },
       // Enable other extensions included in StarterKit
    }),
    TextStyle,
    FontFamily,
    // Formatting
    Color,
    Highlight.configure({ multicolor: true }),
    // Link and Underline removed (handled by StarterKit)
    FontSize,
    // Tables
    Table.configure({
      resizable: true,
      allowTableNodeSelection: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    // Pagination
    PaginationPlus.configure({
      pageHeight: 1060,
      pageWidth: 818,
      pageGap: 20,
      pageBreakBackground: '#F3F4F6',
      marginTop: 30,
      marginBottom: 50,
      marginLeft: 70,
      marginRight: 70,
      pageFooterHeight: 40, // Increased for interactive footer
      pageHeaderHeight: 40, // Added for interactive header
      enableHeader: true,
      enableFooter: true,
    } as any),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ], []);
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
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
        // Enforcing width to match PaginationPlus config exactly
        // Removed 'flex flex-col' to allow ProseMirror standard layout
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'width: 818px; min-height: 1060px;', 
      },
    },
    onUpdate: ({ editor }) => {
       // Save Logic
       if (timeoutRef.current) clearTimeout(timeoutRef.current);
       timeoutRef.current = setTimeout(() => {
         saveDocument(editor.getJSON());
       }, 1500);
    }
  });

  return (
    <div className="flex flex-col w-full items-center bg-[#F3F4F6] pb-10 min-h-screen">
      <Toolbar editor={editor} status={status} />

      {/* Editor Container - The "Paper" is now the editor itself, but we wrap it to center it and handle print */}
      <div className="mt-8">
         <EditorContent editor={editor} />
      </div>
    </div>
  );
};
