import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Wand2, Download, AlertCircle } from 'lucide-react';
import { editImage } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
          setResultImage(null);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please upload a valid image file.');
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setResultImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = async () => {
    if (!selectedImage || !editPrompt) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await editImage(selectedImage, editPrompt);
      setResultImage(result);
    } catch (err) {
      setError('Failed to edit image. The prompt might be too complex or violates safety policies.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full bg-[#0f1115] text-gray-100 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8 animate-pop-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Edit Images
          </h2>
          <p className="text-gray-400">Upload an image and tell Glucasia how to modify it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="bg-[#1e1f24] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col h-full hover:border-gray-700 transition-colors duration-300">
             <h3 className="text-lg font-semibold mb-4 text-gray-200">Original</h3>
             
             {!selectedImage ? (
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="flex-1 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:bg-[#2b2d31]/50 min-h-[300px] hover:scale-[1.02] active:scale-[0.98]"
               >
                 <Upload size={40} className="text-gray-500 mb-4 animate-bounce" />
                 <p className="text-gray-300 font-medium">Click to upload image</p>
                 <p className="text-xs text-gray-500 mt-2">PNG, JPG supported</p>
               </div>
             ) : (
               <div className="relative rounded-xl overflow-hidden bg-black flex-1 flex items-center justify-center min-h-[300px] group animate-fade-in">
                 <img src={selectedImage} alt="Original" className="max-h-[400px] w-full object-contain" />
                 <button 
                   onClick={handleRemoveImage}
                   className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500 transition-all hover:scale-110"
                 >
                   <X size={16} />
                 </button>
               </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

             <div className="mt-6 space-y-3">
               <label className="text-sm font-medium text-gray-300">What changes to apply?</label>
               <textarea 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Example: Add a pair of sunglasses, change background to mountains..."
                  className="w-full h-24 bg-[#2b2d31] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-shadow focus:shadow-lg focus:shadow-purple-900/20"
               />
               <button
                  onClick={handleEdit}
                  disabled={!selectedImage || !editPrompt || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
               >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                  Edit Image
               </button>
             </div>
          </div>

          {/* Right Column: Output */}
          <div className="bg-[#1e1f24] p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col h-full hover:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Result</h3>
            
            <div className="flex-1 bg-[#2b2d31]/30 rounded-xl flex items-center justify-center min-h-[300px] border border-gray-800 relative overflow-hidden transition-all">
               {isProcessing ? (
                 <div className="flex flex-col items-center gap-3 animate-pulse">
                   <Loader2 size={40} className="animate-spin text-purple-500" />
                   <p className="text-sm text-gray-400">Processing image...</p>
                 </div>
               ) : resultImage ? (
                  <div className="relative w-full h-full flex items-center justify-center group animate-slide-up-fade">
                    <img src={resultImage} alt="Edited" className="max-h-[500px] w-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={resultImage} 
                        download={`glucasia-edit-${Date.now()}.png`}
                        className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all hover:scale-110"
                      >
                        <Download size={24} />
                      </a>
                    </div>
                  </div>
               ) : error ? (
                 <div className="flex flex-col items-center gap-2 text-red-400 p-4 text-center animate-shake">
                    <AlertCircle size={32} />
                    <p>{error}</p>
                 </div>
               ) : (
                 <p className="text-gray-500 text-sm">Result will appear here</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;