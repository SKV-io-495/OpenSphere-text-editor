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


export const TiptapEditor = () => {
  // Save logic removed as per requirements

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
      <p><strong>Start writing here ...</strong></p>
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
    // Interaction handlers can go here if needed in future
    onUpdate: ({ editor }) => {
       // Auto-save feature removed
    }
  });

  return (
    <div className="flex flex-col w-full items-center bg-[#F3F4F6] pb-10 min-h-screen">
      <Toolbar editor={editor} />

      {/* Editor Container - The "Paper" is now the editor itself, but we wrap it to center it and handle print */}
      <div className="mt-8">
         <EditorContent editor={editor} />
      </div>
    </div>
  );
};
