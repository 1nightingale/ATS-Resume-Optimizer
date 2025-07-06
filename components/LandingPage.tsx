import React from 'react';
import { RocketLaunchIcon, BriefcaseIcon, DocumentArrowUpIcon, SparklesIcon } from './icons/Icons';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const features = [
    {
      icon: <BriefcaseIcon className="h-8 w-8 text-indigo-400" />,
      title: 'Reverse-Engineer Profiles',
      description: 'We analyze dozens of job listings for your target role to build a data-driven profile of the ideal candidate.',
    },
    {
      icon: <DocumentArrowUpIcon className="h-8 w-8 text-teal-400" />,
      title: 'Analyze Your Resume',
      description: 'Upload or paste your resume to get an instant match score and see how it compares to the ideal profile.',
    },
    {
      icon: <SparklesIcon className="h-8 w-8 text-indigo-400" />,
      title: 'Get Actionable Insights',
      description: 'Receive personalized, AI-generated recommendations to make your resume stand out and beat the bots.',
    },
  ];

  return (
    <div className="flex flex-col items-center text-center animate-fade-in-up">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-400 to-teal-300 mb-4">
        Beat the Bots. Land the Interview.
      </h2>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
        Our AI-powered optimizer analyzes job descriptions to reveal what Applicant Tracking Systems (ATS) want, then shows you exactly how to tailor your resume for success.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-800/60 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center">
            <div className="flex-shrink-0 bg-gray-900 p-3 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="bg-teal-600 text-white font-bold rounded-lg px-8 py-4 flex items-center justify-center gap-3 text-xl transition-all duration-300 ease-in-out hover:bg-teal-500 transform hover:scale-105"
      >
        <span>Start Optimizing</span>
        <RocketLaunchIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default LandingPage;
