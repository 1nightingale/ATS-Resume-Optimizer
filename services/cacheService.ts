import { ATSProfile, CachedAnalysis } from '../types';

const CACHE_KEY = 'atsOptimizerCache';

const normalizeTitle = (title: string): string => {
    return title.trim().toLowerCase();
};

export const getAnalysisFromCache = (jobTitle: string): CachedAnalysis | null => {
    try {
        const cacheString = localStorage.getItem(CACHE_KEY);
        if (!cacheString) return null;

        const cache = JSON.parse(cacheString);
        return cache[normalizeTitle(jobTitle)] || null;
    } catch (error) {
        console.error("Failed to read from cache", error);
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
};

export const saveAnalysisToCache = (jobTitle: string, profile: ATSProfile): void => {
    try {
        const cacheString = localStorage.getItem(CACHE_KEY);
        const cache = cacheString ? JSON.parse(cacheString) : {};
        
        const newEntry: CachedAnalysis = {
            jobTitle: jobTitle.trim(),
            profile,
            analyzedAt: new Date().toISOString(),
        };

        cache[normalizeTitle(jobTitle)] = newEntry;

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error("Failed to save to cache", error);
    }
};

export const getAllCachedAnalyses = (): CachedAnalysis[] => {
    try {
        const cacheString = localStorage.getItem(CACHE_KEY);
        if (!cacheString) return [];

        const cache = JSON.parse(cacheString);
        return Object.values(cache);
    } catch (error) {
        console.error("Failed to read all from cache", error);
        localStorage.removeItem(CACHE_KEY);
        return [];
    }
};
