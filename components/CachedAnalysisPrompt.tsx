import React from 'react';
import { ArchiveBoxIcon, ArrowPathIcon } from './icons/Icons';

interface CachedAnalysisPromptProps {
  jobTitle: string;
  cachedDate: string;
  onUseCache: () => void;
  onRescan: () => void;
}

const CachedAnalysisPrompt: React.FC<CachedAnalysisPromptProps> = ({ jobTitle, cachedDate, onUseCache, onRescan }) => {
  const formattedDate = new Date(cachedDate).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col items-center text-center py-8">
      <ArchiveBoxIcon className="h-12 w-12 text-teal-400 mb-4" />
      <h2 className="text-2xl font-bold text-teal-300 mb-2">Cached Profile Found!</h2>
      <p className="text-gray-400 mb-6 max-w-lg">
        We found a profile for <span className="font-bold text-white">{jobTitle}</span> that you generated on <span className="font-bold text-white">{formattedDate}</span>.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onUseCache}
          className="w-full sm:w-auto bg-teal-600 text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-teal-500 transform hover:scale-105"
        >
          Use Cached Profile
        </button>
        <button
          onClick={onRescan}
          className="w-full sm:w-auto bg-gray-600 text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-gray-500"
        >
          <ArrowPathIcon className="h-5 w-5" />
          Re-scan for New Profile
        </button>
      </div>
    </div>
  );
};

export default CachedAnalysisPrompt;
