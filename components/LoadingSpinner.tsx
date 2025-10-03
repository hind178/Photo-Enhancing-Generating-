import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = "Processing...", 
    subMessage = "Please wait a moment." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-300">{message}</p>
      <p className="text-gray-400">{subMessage}</p>
    </div>
  );
};