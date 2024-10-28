"use client"; // Add this line to mark the file as a client component

import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-screen from-indigo-600 to-purple-800">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 delay-150 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 delay-300 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <h1 className="mt-4 text-xl font-semibold">Empowering Excellence in Education</h1>
        <p className="mt-2 text-center">
          Please wait while we prepare personalized insights for you...
        </p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
