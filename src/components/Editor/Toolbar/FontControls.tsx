import React from 'react';
import { type Editor } from '@tiptap/react';

interface FontControlsProps {
  editor: Editor;
}

export const FontControls: React.FC<FontControlsProps> = ({ editor }) => {
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

  return (
    <>
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
          value={parseInt(editor.getAttributes('textStyle').fontSize) || 14}
          title="Font Size"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
