import React from 'react';
import { Sparkles, X, Wand2, MessageSquare, Zap } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#17191f] border border-blue-500/30 w-full max-w-2xl rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-b border-gray-800">
          <div className="absolute top-4 right-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
               <Sparkles className="text-white w-6 h-6" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white">Welcome to Glucasia</h2>
               <p className="text-blue-200 text-sm">Advanced AI with a touch of magic</p>
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MessageSquare className="text-blue-400" size={18} />
                <span>Reasoning Chat</span>
              </div>
              <p className="text-sm text-gray-400">
                Powered by advanced models that can browse the web and reason through complex problems.
              </p>
            </div>
            
             <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Wand2 className="text-purple-400" size={18} />
                <span>Creative Studio</span>
              </div>
              <p className="text-sm text-gray-400">
                Generate stunning images or edit existing photos using natural language prompts.
              </p>
            </div>
          </div>

          {/* Magic Manual */}
          <div className="bg-[#0f1115] rounded-xl p-5 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" size={18} />
              Magic Prompt Manual
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Type these exact keywords in the chat to trigger special effects:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <code className="bg-[#1e1f24] text-center py-2 rounded-lg text-blue-300 font-mono text-sm border border-blue-900/50 hover:border-blue-500 transition-colors">
                shake
              </code>
              <code className="bg-[#1e1f24] text-center py-2 rounded-lg text-pink-300 font-mono text-sm border border-pink-900/50 hover:border-pink-500 transition-colors">
                party
              </code>
               <code className="bg-[#1e1f24] text-center py-2 rounded-lg text-green-300 font-mono text-sm border border-green-900/50 hover:border-green-500 transition-colors">
                glitch
              </code>
               <code className="bg-[#1e1f24] text-center py-2 rounded-lg text-yellow-300 font-mono text-sm border border-yellow-900/50 hover:border-yellow-500 transition-colors">
                spin
              </code>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;