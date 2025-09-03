
// Copyright (c) 2025 Tim Nightingale
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState } from 'react';
import { SearchIcon, ArrowRightIcon } from './icons/Icons';
import { CachedAnalysis } from '../types';

interface JobTitleInputProps {
  onSubmit: (jobTitle: string) => void;
  previousSearches: CachedAnalysis[];
}

const JobTitleInput: React.FC<JobTitleInputProps> = ({ onSubmit, previousSearches }) => {
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobTitle.trim()) {
      onSubmit(jobTitle.trim());
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <h2 className="text-2xl font-bold text-teal-300 mb-2">Step 1: Define Your Target</h2>
      <p className="text-gray-400 mb-6 text-center">Enter the job title you're aiming for. We'll analyze the market for you.</p>
      <form onSubmit={handleSubmit} className="w-full max-w-lg flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Senior Product Manager"
            className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!jobTitle.trim()}
          className="bg-teal-600 text-white font-bold rounded-lg px-5 py-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 transform hover:scale-105"
        >
          <span>Analyze</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>

      {previousSearches.length > 0 && (
        <div className="w-full max-w-lg mt-10">
          <h3 className="text-lg font-semibold text-gray-400 mb-4 text-center">Or select a recent analysis:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {previousSearches.slice(0, 5).map((search) => (
              <button
                key={search.jobTitle}
                onClick={() => onSubmit(search.jobTitle)}
                className="bg-gray-700/60 backdrop-blur-sm border border-gray-600 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200"
              >
                {search.jobTitle}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTitleInput;