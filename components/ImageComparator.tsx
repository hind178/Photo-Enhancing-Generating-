import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  original: string;
  enhanced: string | null;
  onProfessionalize: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

interface ImageCardProps {
    title: string;
    imageUrl: string | null;
    children?: React.ReactNode;
}

const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, children }) => (
  <div className="w-full md:w-1/2 p-2">
    <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      <h3 className="text-center font-bold text-lg py-3 bg-gray-900/70">{title}</h3>
      <div className={`p-4 flex-grow flex items-center justify-center min-h-[300px]`}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {children}
          </div>
        )}
      </div>
    </div>
  </div>
);


export const ImageComparator: React.FC<ImageComparatorProps> = ({ 
  original, 
  enhanced, 
  onProfessionalize, 
  onReset, 
  isProcessing 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(92);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDownload = useCallback(() => {
    if (!enhanced) return;

    setShowSettings(false);
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(image, 0, 0);
      const mimeType = `image/${format}`;
      const qualityArg = format === 'jpeg' ? quality / 100 : undefined;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `professional-photo.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, mimeType, qualityArg);
    };
    image.src = enhanced;
  }, [enhanced, format, quality]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row -m-2">
        <ImageCard title="Before" imageUrl={original} />
        <ImageCard 
          title="After" 
          imageUrl={enhanced}
        >
           <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="mt-2">Your professional image will appear here.</p>
          </div>
        </ImageCard>
      </div>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
        {!enhanced && (
          <button
            onClick={onProfessionalize}
            disabled={isProcessing}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center"
          >
            {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                '✨ Professionalize'
              )}
          </button>
        )}
        
        {enhanced && (
          <>
           <div className="relative" ref={settingsRef}>
            <div className="flex items-stretch shadow-lg rounded-lg">
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-l-lg text-white font-bold text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              >
                Download
              </button>
              <button
                onClick={() => setShowSettings(prev => !prev)}
                aria-label="Download settings"
                className="px-3 bg-teal-600 hover:bg-teal-700 rounded-r-lg text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            {showSettings && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-700/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl p-4 z-10 animate-fade-in-up">
                 <div className="space-y-3">
                    <h4 className="text-sm font-bold text-center text-gray-200 border-b border-gray-600 pb-2">Download Options</h4>
                    <div className="flex items-center justify-between">
                        <label htmlFor="format" className="font-semibold text-gray-300 text-sm">Format</label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
                            className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                        </select>
                    </div>

                    {format === 'jpeg' && (
                        <div className="space-y-2 pt-2 border-t border-gray-600">
                            <div className="flex justify-between items-center">
                                <label htmlFor="quality" className="font-semibold text-gray-300 text-sm">Quality</label>
                                <span className="text-sm text-gray-400 font-mono bg-gray-800 px-2 py-0.5 rounded">{quality}</span>
                            </div>
                            <input
                                type="range"
                                id="quality"
                                min="1"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    )}
                </div>
              </div>
            )}
           </div>
          </>
        )}

        <button
          onClick={onReset}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

// Add some simple animations for the popover
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.2s ease-out forwards;
  }
`;
document.head.append(style);