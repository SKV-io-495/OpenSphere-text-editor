'use client';

import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  MessageSquare, 
  Edit3, 
  Zap, 
  Settings,
  Clock, 
  Download, 
  Printer 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 ml-[250px]">
      {/* Left Title */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">Strategy</h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        
         {/* Timer Section */}
        <div className="hidden md:flex items-center gap-2 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">01:23:45</span>
          <span className="text-xs text-purple-600 font-bold ml-1 cursor-pointer">RESUME</span>
          <span className="mx-1">/</span>
          <span className="text-xs text-red-500 font-bold cursor-pointer">STOP</span>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* Export / Print Actions */}
        <div className="relative">
           <button 
             onClick={() => setIsExportOpen(!isExportOpen)}
             className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
           >
             <Download className="w-4 h-4" />
             Export
           </button>
           
           {/* Click-toggled Dropdown */}
           {isExportOpen && (
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 p-1 z-50">
               <button 
                 onClick={() => {
                   window.print();
                   setIsExportOpen(false);
                 }}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-sm flex items-center gap-2"
               >
                 <Printer className="w-4 h-4" />
                 Print / Save as PDF
               </button>
               <button 
                 onClick={() => {
                   window.print();
                   setIsExportOpen(false);
                 }}
                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-sm flex items-center gap-2"
               >
                 <Download className="w-4 h-4" />
                 Download PDF
               </button>
             </div>
           )}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-2 hover:bg-gray-100 rounded-full hover:text-purple-600">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hover:text-purple-600">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hover:text-purple-600">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hover:text-purple-600">
             <Edit3 className="w-5 h-5" />
          </button>
           <button className="p-2 hover:bg-gray-100 rounded-full hover:text-purple-600">
             <Zap className="w-5 h-5" />
          </button>
        </div>

        {/* Settings and Avatar */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold border border-purple-200">
          JD
        </div>
      </div>
    </header>
  );
};
