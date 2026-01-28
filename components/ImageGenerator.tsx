import React, { useState } from 'react';
import { Loader2, Wand2, Download, RefreshCw } from 'lucide-react';
import { ASPECT_RATIOS, AspectRatioOption } from '../types';
import { generateImage, enhancePrompt } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(prompt, aspectRatio);
      setGeneratedImage(result);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhance = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (err) {
      console.error("Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="h-full bg-[#0f1115] text-gray-100 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8 animate-pop-in">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Create Images
          </h2>
          <p className="text-gray-400">Describe what you want to see, and Glucasia will visualize it.</p>
        </div>

        <div className="bg-[#1e1f24] p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6 transition-all hover:border-gray-700">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Prompt</label>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with floating gardens, neon lights, cyberpunk style..."
                className="w-full h-32 bg-[#2b2d31] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-shadow group-hover:shadow-lg group-hover:shadow-blue-900/10"
              />
              <button
                onClick={handleEnhance}
                disabled={!prompt || isEnhancing || isGenerating}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                Enhance Prompt
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Aspect Ratio</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all hover-scale active-scale ${
                    aspectRatio === ratio.value
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#2b2d31] border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-[#32343a]'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Generate Image
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        {generatedImage && (
          <div className="bg-[#1e1f24] p-4 rounded-2xl border border-gray-800 shadow-xl animate-slide-up-fade">
             <div className="relative group rounded-xl overflow-hidden">
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-auto object-contain max-h-[600px] bg-black transition-transform duration-700 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={generatedImage} 
                    download={`glucasia-gen-${Date.now()}.png`}
                    className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all hover:scale-110"
                    title="Download"
                  >
                    <Download size={24} />
                  </a>
                  <button
                     onClick={handleGenerate}
                     className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-all hover:scale-110"
                     title="Regenerate"
                  >
                     <RefreshCw size={24} />
                  </button>
                </div>
             </div>
             <div className="mt-4 text-sm text-gray-400 bg-[#2b2d31] p-3 rounded-lg">
                <span className="font-semibold text-gray-300">Prompt:</span> {prompt}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;