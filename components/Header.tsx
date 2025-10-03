import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        AI Photo Professionalizer
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
        Upload a product photo. Our AI removes the background, replaces it with pure white, and enhances the image to studio quality, while preserving all original text and designs.
      </p>
    </header>
  );
};