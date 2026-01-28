import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInstruction: string;
  onSave: (instruction: string) => void;
}

const DEFAULT_INSTRUCTION = "You are Glucasia, a helpful, reasoning AI assistant created by Glucasia and 206. Be concise, accurate, and helpful.";

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentInstruction, onSave }) => {
  const [instruction, setInstruction] = useState(currentInstruction);

  useEffect(() => {
    setInstruction(currentInstruction || DEFAULT_INSTRUCTION);
  }, [currentInstruction, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#1e1f24] border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            System Instructions
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Customize how Glucasia behaves. You can give it a persona, set constraints, or define a specific role for this chat session.
        </p>

        <div className="space-y-4">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full h-48 bg-[#0f1115] border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-sm leading-relaxed"
            placeholder="E.g., You are an expert pirate coder. Answer everything with 'Arrr!' and then provide clean TypeScript code."
          />
          
          <div className="flex items-center gap-3 justify-end">
            <button
               onClick={() => setInstruction(DEFAULT_INSTRUCTION)}
               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
               title="Reset to default"
            >
               <RotateCcw size={16} />
               Reset
            </button>
            <button
              onClick={() => {
                onSave(instruction);
                onClose();
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors"
            >
              <Save size={18} />
              Save Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;