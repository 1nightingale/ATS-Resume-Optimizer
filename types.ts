export enum AppStep {
  LANDING = 'LANDING',
  INITIAL = 'INITIAL',
  AWAITING_CACHE_CHOICE = 'AWAITING_CACHE_CHOICE',
  ANALYZING = 'ANALYZING',
  AWAITING_RESUME = 'AWAITING_RESUME',
  GENERATING_INSIGHTS = 'GENERATING_INSIGHTS',
  SHOWING_INSIGHTS = 'SHOWING_INSIGHTS',
  ERROR = 'ERROR'
}

export interface Skill {
  name: string;
  frequency: number;
}

export interface ATSProfile {
  technicalSkills: Skill[];
  softSkills: Skill[];
  qualifications: Skill[];
  keywords: Skill[];
}

export interface AnalysisResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface CachedAnalysis {
  jobTitle: string; // The original, case-sensitive job title
  profile: ATSProfile;
  analyzedAt: string; // ISO date string
}