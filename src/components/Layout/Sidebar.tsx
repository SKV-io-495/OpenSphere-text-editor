'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  Map, 
  Files, 
  HelpCircle, 
  Search, 
  FileText, 
  FileInput, 
  Share, 
  Settings,
  MoreHorizontal,
  Github,
  Linkedin,
  FileUser
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, isCollapsed }) => {
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors relative group",
      active 
        ? "bg-purple-600 text-white" 
        : "text-gray-600 hover:bg-gray-100",
      isCollapsed && "justify-center px-2"
    )}
    title={isCollapsed ? label : undefined}
    >
      <Icon className="w-4 h-4 min-w-[16px]" />
      {!isCollapsed && <span>{label}</span>}
    </div>
  );
};

interface SidebarProps {
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, toggleSidebar }) => {
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      {/* Back Button / Top Section */}
      <div className="p-4 border-b border-gray-100 relative">
        <button 
          onClick={toggleSidebar}
          className={cn(
            "flex items-center text-gray-500 hover:text-gray-800 text-sm mb-6 transition-all", 
            isCollapsed ? "justify-center w-full" : ""
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 mr-1" />}
          {!isCollapsed && "Back"}
        </button>
        
        <div className={cn("mb-4 transition-opacity", isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
          <h2 className="font-semibold text-gray-900 whitespace-nowrap">Sumit Verma</h2>
          <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">Demo Account</p>
        </div>

         {/* Important Links Button */}
         <button 
           onClick={() => setIsLinksModalOpen(true)}
           className={cn(
             "flex items-center justify-center py-1.5 px-3 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors",
             isCollapsed ? "w-full px-0" : "w-full"
           )}
           title="Important Links"
         >
           <Files className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
           {!isCollapsed && "Important Links"}
         </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavItem icon={LayoutDashboard} label="Case Dashboard" isCollapsed={isCollapsed} />
        <NavItem icon={Map} label="Strategy" active isCollapsed={isCollapsed} />
        <NavItem icon={Files} label="Document Collection" isCollapsed={isCollapsed} />
        <NavItem icon={HelpCircle} label="Questionnaires" isCollapsed={isCollapsed} />
        <NavItem icon={Search} label="Indepth Evaluation" isCollapsed={isCollapsed} />
        <NavItem icon={Share} label="Exhibit Section" isCollapsed={isCollapsed} />
        <NavItem icon={FileText} label="Drafting" isCollapsed={isCollapsed} />
        <NavItem icon={FileInput} label="Forms Section" isCollapsed={isCollapsed} />
        <NavItem icon={Files} label="Final Assembly" isCollapsed={isCollapsed} />
        
        <div className="pt-4">
          <button className={cn("flex items-center text-gray-500 px-3 py-2 text-sm hover:text-gray-900 w-full", isCollapsed && "justify-center")}>
            <MoreHorizontal className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && "More"}
          </button>
        </div>
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t border-gray-100 relative">
        <div className={cn("flex items-center text-sm text-gray-600 mb-2", isCollapsed && "justify-center")}>
            <span className="w-2 h-2 rounded-full bg-green-500 min-w-[8px]"></span>
            {!isCollapsed && <span className="ml-2 whitespace-nowrap">Case Status</span>}
        </div>
        <div className={cn("flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer", isCollapsed && "justify-center")}>
            <Settings className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span>Settings</span>}
        </div>
      </div>

      {/* Important Links Modal */}
      <Modal
        isOpen={isLinksModalOpen}
        onClose={() => setIsLinksModalOpen(false)}
        title="Important Links"
      >
        <div className="grid grid-cols-1 gap-3">
          <a 
            href="https://github.com/SKV-io-495" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white group-hover:text-purple-600 transition-colors">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">GitHub</p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </a>

          <a 
            href="https://www.linkedin.com/in/sumitverma-495t0f/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white group-hover:text-blue-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">LinkedIn</p>
              <p className="text-xs text-gray-500">Connect with Sumit</p>
            </div>
          </a>

          <a 
            href="https://drive.google.com/file/d/1F9imRHEt65fA7CSpTw1pWmRvGBCu8cc1/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white group-hover:text-green-600 transition-colors">
              <FileUser className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Resume</p>
              <p className="text-xs text-gray-500">View CV</p>
            </div>
          </a>
        </div>
      </Modal>
    </aside>
  );
};
