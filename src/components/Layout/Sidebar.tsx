import React from 'react';
import { 
  ChevronLeft, 
  LayoutDashboard, 
  Map, 
  Files, 
  HelpCircle, 
  Search, 
  FileText, 
  FileInput, 
  Share, 
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active }) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
      active 
        ? "bg-purple-600 text-white" 
        : "text-gray-600 hover:bg-gray-100"
    )}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-40">
      {/* Back Button / Top Section */}
      <div className="p-4 border-b border-gray-100">
        <button className="flex items-center text-gray-500 hover:text-gray-800 text-sm mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">Atal Agarwal</h2>
          <p className="text-xs text-gray-500">O-1A Visa</p>
          <p className="text-xs text-gray-400 mt-1">Case Lead: Demo Account</p>
        </div>

         <button className="flex items-center justify-center w-full py-1.5 px-3 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50">
           <Files className="w-4 h-4 mr-2" />
           Document Collection
         </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavItem icon={LayoutDashboard} label="Case Dashboard" />
        <NavItem icon={Map} label="Strategy" active />
        <NavItem icon={Files} label="Document Collection" />
        <NavItem icon={HelpCircle} label="Questionnaires" />
        <NavItem icon={Search} label="Indepth Evaluation" />
        <NavItem icon={Share} label="Exhibit Section" />
        <NavItem icon={FileText} label="Drafting" />
        <NavItem icon={FileInput} label="Forms Section" />
        <NavItem icon={Files} label="Final Assembly" />
        
        <div className="pt-4">
          <button className="flex items-center text-gray-500 px-3 py-2 text-sm hover:text-gray-900 w-full">
            <MoreHorizontal className="w-4 h-4 mr-2" />
            More
          </button>
        </div>
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Case Status
        </div>
        <div className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
        </div>
      </div>
    </aside>
  );
};
