
// Copyright (c) 2025 Tim Nightingale
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react';

interface LoadingStateProps {
  message: string;
  progress: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message, progress }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="text-teal-400"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {Math.round(progress)}%
        </span>
      </div>
      <p className="text-lg font-medium text-gray-300 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingState;
