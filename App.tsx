import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageComparator } from './components/ImageComparator';
import { LoadingSpinner } from './components/LoadingSpinner';
import { professionalizeProductImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { AppState } from './types';
import type { OriginalImage } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setAppState(AppState.ERROR);
      return;
    }
    setError(null);
    setAppState(AppState.PROCESSING);
    try {
      const dataUrl = await fileToBase64(file);
      setOriginalImage({ dataUrl, file });
      setEnhancedImage(null);
      setAppState(AppState.PREVIEW);
    } catch (err) {
      setError('Failed to load image. Please try again.');
      setAppState(AppState.ERROR);
      console.error(err);
    }
  }, []);

  const handleProfessionalize = useCallback(async () => {
    if (!originalImage) return;

    setError(null);
    setAppState(AppState.PROCESSING);
    try {
      const { enhancedImageUrl, textResponse } = await professionalizeProductImage(
        originalImage.file
      );
      if (enhancedImageUrl) {
        setEnhancedImage(enhancedImageUrl);
        setAppState(AppState.RESULT);
      } else {
        throw new Error(textResponse || 'AI model did not return an image.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during enhancement.';
      setError(`Processing Failed: ${errorMessage}`);
      setAppState(AppState.ERROR);
      console.error(err);
    }
  }, [originalImage]);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.PROCESSING:
        return <LoadingSpinner message="Professionalizing your image..." subMessage="The AI is removing the background and enhancing quality. Please wait." />;
      case AppState.PREVIEW:
      case AppState.RESULT:
      case AppState.ERROR:
        if (originalImage) {
          return (
            <ImageComparator
              original={originalImage.dataUrl}
              enhanced={enhancedImage}
              onProfessionalize={handleProfessionalize}
              onReset={handleReset}
              isProcessing={appState === AppState.PROCESSING}
            />
          );
        }
        // Fallback to uploader if something goes wrong
        return <ImageUploader onFileSelect={handleFileSelect} />;
      case AppState.IDLE:
      default:
        return <ImageUploader onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8">
          {renderContent()}
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded-lg text-center">
              <p className="font-semibold">An Error Occurred</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;