// Copyright (c) 2025 Tim Nightingale
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { useState, useCallback } from 'react';
import { AppStep, ATSProfile, AnalysisResult, CachedAnalysis } from './types';
import { generateProfileFromWeb, compareResumeToProfile } from './services/geminiService';
import { getAnalysisFromCache, saveAnalysisToCache, getAllCachedAnalyses } from './services/cacheService';
import LandingPage from './components/LandingPage';
import JobTitleInput from './components/JobTitleInput';
import LoadingState from './components/LoadingState';
import ResumeUpload from './components/ResumeUpload';
import InsightsDisplay from './components/InsightsDisplay';
import CachedAnalysisPrompt from './components/CachedAnalysisPrompt';
import { SparklesIcon, BriefcaseIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [atsProfile, setAtsProfile] = useState<ATSProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cachedAnalysis, setCachedAnalysis] = useState<CachedAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previousSearches, setPreviousSearches] = useState<CachedAnalysis[]>([]);

  const handleError = (message: string) => {
    setError(message);
    setStep(AppStep.ERROR);
  };

  const runAnalysisProcess = useCallback(async (title: string) => {
    try {
      setJobTitle(title);
      setError(null);

      setStep(AppStep.ANALYZING);
      setLoadingMessage('Analyzing live job postings from the web...');
      setProgress(10);

      const profile = await generateProfileFromWeb(title);

      setProgress(90);
      setAtsProfile(profile);
      saveAnalysisToCache(title, profile);

      setProgress(100);

      setTimeout(() => setStep(AppStep.AWAITING_RESUME), 1000);
    } catch (err) {
      console.error(err);
      handleError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    }
  }, []);

  const handleJobTitleSubmit = useCallback((title: string) => {
    setJobTitle(title);
    setError(null);
    const cached = getAnalysisFromCache(title);
    if (cached) {
      setCachedAnalysis(cached);
      setStep(AppStep.AWAITING_CACHE_CHOICE);
    } else {
      runAnalysisProcess(title);
    }
  }, [runAnalysisProcess]);

  const handleUseCachedProfile = useCallback(() => {
    if (cachedAnalysis) {
      setAtsProfile(cachedAnalysis.profile);
      setStep(AppStep.AWAITING_RESUME);
    } else {
      handleError("Could not load cached profile. Please start over.");
    }
  }, [cachedAnalysis]);

  const handleRescan = useCallback(() => {
    runAnalysisProcess(jobTitle);
  }, [jobTitle, runAnalysisProcess]);

  const handleResumeSubmit = useCallback(async (resumeText: string) => {
    if (!atsProfile) {
      handleError('ATS Profile is not available. Please start over.');
      return;
    }
    try {
      setError(null);
      setStep(AppStep.GENERATING_INSIGHTS);
      setLoadingMessage('Analyzing your resume...');
      setProgress(0);

      const result = await compareResumeToProfile(resumeText, atsProfile);
      setProgress(50);
      setLoadingMessage('Generating personalized insights...');

      setTimeout(() => {
        setAnalysisResult(result);
        setProgress(100);
        setTimeout(() => setStep(AppStep.SHOWING_INSIGHTS), 1000);
      }, 1500);

    } catch (err) {
      console.error(err);
      handleError(err instanceof Error ? err.message : 'An unknown error occurred while analyzing your resume.');
    }
  }, [atsProfile]);

  const handleStart = useCallback(() => {
    const searches = getAllCachedAnalyses();
    searches.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
    setPreviousSearches(searches);
    setStep(AppStep.INITIAL);
  }, []);

  const handleReset = () => {
    setStep(AppStep.LANDING);
    setJobTitle('');
    setLoadingMessage('');
    setProgress(0);
    setAtsProfile(null);
    setAnalysisResult(null);
    setCachedAnalysis(null);
    setError(null);
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.LANDING:
        return <LandingPage onStart={handleStart} />;
      case AppStep.INITIAL:
        return <JobTitleInput onSubmit={handleJobTitleSubmit} previousSearches={previousSearches} />;
      case AppStep.AWAITING_CACHE_CHOICE:
        return cachedAnalysis ? (
          <CachedAnalysisPrompt
            jobTitle={jobTitle}
            cachedDate={cachedAnalysis.analyzedAt}
            onUseCache={handleUseCachedProfile}
            onRescan={handleRescan}
          />
        ) : null;
      case AppStep.ANALYZING:
      case AppStep.GENERATING_INSIGHTS:
        return <LoadingState message={loadingMessage} progress={progress} />;
      case AppStep.AWAITING_RESUME:
        return <ResumeUpload onSubmit={handleResumeSubmit} jobTitle={jobTitle} />;
      case AppStep.SHOWING_INSIGHTS:
        return analysisResult && atsProfile ? <InsightsDisplay result={analysisResult} profile={atsProfile} onReset={handleReset} jobTitle={jobTitle} /> : <div />;
      case AppStep.ERROR:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <BriefcaseIcon className="h-10 w-10 text-indigo-400" />
            <SparklesIcon className="h-12 w-12 text-teal-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-400 to-indigo-400">
            ATS Resume Optimizer
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Reverse-engineer the ideal candidate profile and get actionable insights to beat the bots.
          </p>
        </header>
        <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini API. Designed for educational and demonstration purposes.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
