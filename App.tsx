import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import { SparklesIcon, ErrorIcon, ImageIcon, DownloadIcon } from './components/Icons';

const App: React.FC = () => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await generateImageFromPrompt(prompt);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleDownloadClick = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    // Create a filename from the prompt
    const fileName = prompt.trim().toLowerCase().slice(0, 30).replace(/\s+/g, '_') || 'generated_image';
    link.download = `${fileName}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, prompt]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-900 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <main className="w-full max-w-3xl flex flex-col items-center gap-8">
        <header className="text-center w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 tracking-tight">
            Gemini Image Generator
          </h1>
          <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Create stunning visuals with a simple text description. Powered by Imagen 4.
          </p>
        </header>

        <div className="w-full p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/20">
          <div className="flex flex-col gap-6">
            <div className="aspect-video w-full rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center bg-slate-900/50 overflow-hidden relative">
              {isLoading ? (
                <div className="text-center text-slate-400 animate-pulse">
                  <SparklesIcon className="w-16 h-16 mx-auto animate-spin [animation-duration:3s]" />
                  <p className="mt-2 font-semibold">Generating your image...</p>
                  <p className="text-sm text-slate-500">This may take a moment.</p>
                </div>
              ) : generatedImage ? (
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-slate-500 p-4">
                  <ImageIcon className="w-16 h-16 mx-auto" />
                  <p className="mt-2">Your generated image will appear here</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <label htmlFor="prompt-input" className="text-xl font-semibold text-slate-300">
                Enter Your Prompt
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A realistic futuristic tech environment with glowing blue, violet, and silver..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="mt-6">
            {error && (
              <div className="mb-4 flex items-center gap-3 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                <ErrorIcon className="w-6 h-6 flex-shrink-0"/>
                <p>{error}</p>
              </div>
            )}
            <button
              onClick={handleGenerateClick}
              disabled={!prompt.trim() || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out hover:from-cyan-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              <SparklesIcon className="w-6 h-6"/>
              Generate Image
            </button>
            {generatedImage && !isLoading && (
              <button
                onClick={handleDownloadClick}
                className="w-full mt-4 flex items-center justify-center gap-3 bg-slate-600 text-white font-bold py-3 px-6 rounded-lg text-md transition-all duration-300 ease-in-out hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <DownloadIcon className="w-6 h-6" />
                Download Image
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;