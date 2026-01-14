import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 ml-[250px]">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search case files..." 
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium text-sm">
            AA
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">Atal Agarwal</p>
            <p className="text-xs text-gray-500">Beneficiary</p>
          </div>
        </div>
      </div>
    </header>
  );
};
