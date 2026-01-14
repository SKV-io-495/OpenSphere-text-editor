import React from 'react';
import { type Editor } from '@tiptap/react';
import { Table as TableIcon, Columns, Rows, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableControlsProps {
  editor: Editor;
}

export const TableControls: React.FC<TableControlsProps> = ({ editor }) => {
  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <>
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
    </>
  );
};
