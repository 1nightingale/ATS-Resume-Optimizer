
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { AnalysisResult, ATSProfile } from '../types';
import { ClipboardCheckIcon, SparklesIcon } from './icons/Icons';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface InsightsDisplayProps {
  result: AnalysisResult;
  profile: ATSProfile;
  jobTitle: string;
  onReset: () => void;
}

const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ result, profile, jobTitle, onReset }) => {
    const scoreColor = result.matchScore >= 75 ? 'text-green-400' : result.matchScore >= 50 ? 'text-yellow-400' : 'text-red-400';
    
    const chartSkillsData = profile.technicalSkills.slice(0, 10).reverse();
    const resumeKeywords = new Set(result.matchingKeywords.map(k => k.toLowerCase()));

    const KeywordTag: React.FC<{keyword: string, isMatch: boolean}> = ({ keyword, isMatch }) => (
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${isMatch ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {keyword}
        </span>
    );

    const chartData = {
        labels: chartSkillsData.map(d => d.name),
        datasets: [
          {
            label: 'Frequency',
            data: chartSkillsData.map(d => d.frequency),
            backgroundColor: chartSkillsData.map(entry => {
              const isMatch = resumeKeywords.has(entry.name.toLowerCase());
              return isMatch ? '#34d399' : '#4f46e5';
            }),
            barThickness: 20,
            borderRadius: 4,
          },
        ],
      };
      
      const chartOptions = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#1f2937', // bg-gray-800
            titleColor: '#ffffff',
            bodyColor: '#d1d5db',
            borderColor: '#374151', // border-gray-700
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context: any) {
                  return `Frequency: ${context.raw}`;
              }
            }
          },
        },
        scales: {
            x: {
                display: false,
                grid: {
                  display: false
                }
            },
            y: {
                ticks: {
                    color: '#d1d5db',
                    font: {
                      family: "'Inter', sans-serif",
                      size: 14,
                    }
                },
                grid: {
                  color: 'rgba(55, 65, 81, 0.3)'
                }
            }
        }
      };
    
    return (
        <div className="space-y-10">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-400">Your Resume Analysis for '{jobTitle}'</h2>
                <p className="text-gray-400 mt-2">Here's the breakdown of how your resume compares to the ideal profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Match Score */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center flex flex-col justify-center items-center">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">ATS Match Score</h3>
                     <div className="relative">
                        <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className="stroke-current text-gray-700" />
                            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="12" className={`stroke-current ${scoreColor}`}
                                strokeDasharray={2 * Math.PI * 54}
                                strokeDashoffset={(2 * Math.PI * 54) * (1 - result.matchScore / 100)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}/>
                        </svg>
                        <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${scoreColor}`}>
                           {result.matchScore}
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <SparklesIcon className="h-6 w-6 text-indigo-400"/>
                        <span>Actionable Recommendations</span>
                    </h3>
                    <div className="space-y-3 text-gray-300">
                        {result.recommendations.map((rec, index) => (
                           <p key={index} className="pl-3 border-l-2 border-indigo-500">{rec}</p> 
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Technical Skills Chart */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Top 10 Technical Skills in Demand</h3>
                <div className="relative h-[300px] w-full">
                  <Bar options={chartOptions} data={chartData} />
                </div>
                <div className="flex justify-center items-center gap-6 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#34d399]"></div><span>Skill Found in Resume</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#4f46e5]"></div><span>Skill Missing</span></div>
                </div>
            </div>


            {/* Keyword Analysis */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                 <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <ClipboardCheckIcon className="h-6 w-6 text-teal-400"/>
                    <span>Keyword Analysis</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-3">Matching Keywords ({result.matchingKeywords.length})</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.matchingKeywords.map(kw => <KeywordTag key={kw} keyword={kw} isMatch={true} />)}
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-red-400 mb-3">Missing Keywords ({result.missingKeywords.length})</h4>
                        <div className="flex flex-wrap gap-2">
                           {result.missingKeywords.map(kw => <KeywordTag key={kw} keyword={kw} isMatch={false} />)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="text-center pt-6">
                <button
                    onClick={onReset}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                >
                    Analyze Another Role
                </button>
            </div>
        </div>
    );
}

export default InsightsDisplay;