import React from 'react';
import { MessageSquare, Image, Edit, Plus, Trash2, X, History, Settings } from 'lucide-react';
import { AppMode, ChatSession } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  setMode,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  isOpen,
  toggleSidebar
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-[#17191f] text-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-gray-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 shadow-2xl md:shadow-none
      `}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent select-none cursor-default">
            Glucasia
          </h1>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className="w-full flex items-center gap-2 bg-[#2b2d31] hover:bg-[#35373c] text-sm text-gray-200 py-3 px-4 rounded-full transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-blue-500/10 hover-scale active-scale group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Mode Navigation */}
        <div className="px-4 py-2 space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-2">Modes</div>
          <button
            onClick={() => { setMode(AppMode.CHAT); if(window.innerWidth < 768) toggleSidebar(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 hover-scale active-scale ${currentMode === AppMode.CHAT ? 'bg-[#2b3544] text-blue-300 shadow-sm' : 'hover:bg-[#2b2d31] text-gray-300'}`}
          >
            <MessageSquare size={18} />
            Chat
          </button>
          <button
            onClick={() => { setMode(AppMode.IMAGE_GEN); if(window.innerWidth < 768) toggleSidebar(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 hover-scale active-scale ${currentMode === AppMode.IMAGE_GEN ? 'bg-[#2b3544] text-blue-300 shadow-sm' : 'hover:bg-[#2b2d31] text-gray-300'}`}
          >
            <Image size={18} />
            Generate Images
          </button>
          <button
            onClick={() => { setMode(AppMode.IMAGE_EDIT); if(window.innerWidth < 768) toggleSidebar(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 hover-scale active-scale ${currentMode === AppMode.IMAGE_EDIT ? 'bg-[#2b3544] text-blue-300 shadow-sm' : 'hover:bg-[#2b2d31] text-gray-300'}`}
          >
            <Edit size={18} />
            Edit Images
          </button>
        </div>

        {/* Recent History */}
        <div className="flex-1 overflow-y-auto mt-4 px-2 custom-scrollbar">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Recent</div>
          {sessions.length === 0 ? (
             <div className="px-4 text-sm text-gray-600 italic animate-fade-in">No recent history</div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                onClick={() => {
                   onSelectSession(session.id);
                   setMode(AppMode.CHAT);
                   if(window.innerWidth < 768) toggleSidebar();
                }}
                className={`group flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer text-sm transition-all duration-200 mb-1 hover:translate-x-1 ${currentSessionId === session.id && currentMode === AppMode.CHAT ? 'bg-[#2b2d31] text-white' : 'hover:bg-[#2b2d31] text-gray-400'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <History size={16} className="flex-shrink-0" />
                  <span className="truncate max-w-[140px]">{session.title}</span>
                </div>
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1 hover:scale-110"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* System Settings & Footer */}
        <div className="p-4 border-t border-gray-800 space-y-3">
           <button 
             onClick={() => { onOpenSettings(); if(window.innerWidth < 768) toggleSidebar(); }}
             className="w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-[#2b2d31] text-gray-300 transition-all hover-scale active-scale"
           >
             <Settings size={18} />
             System Instructions
           </button>
           <div className="text-xs text-gray-600 text-center pt-2 select-none">
             Credits to <span className="text-gray-500 font-medium">Glucasia & 206</span>
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;