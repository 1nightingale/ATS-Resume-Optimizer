import React, { useState, useRef } from 'react';
import { DocumentArrowUpIcon, UploadIcon, ArrowRightIcon } from './icons/Icons';
import { extractTextFromPdf } from '../services/pdfService';


interface ResumeUploadProps {
  onSubmit: (resumeText: string) => void;
  jobTitle: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onSubmit, jobTitle }) => {
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim()) {
      onSubmit(resumeText.trim());
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);
    try {
      const text = await extractTextFromPdf(file);
      setResumeText(text);
    } catch (error) {
      console.error("Failed to parse PDF", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during PDF parsing.";
      setParseError(message);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-teal-300 mb-2">Step 2: Provide Your Resume</h2>
      <p className="text-gray-400 mb-6 text-center max-w-2xl">
        We've built the ideal profile for a <span className="font-bold text-white">{jobTitle}</span>. Now, upload or paste your resume to see how you stack up.
      </p>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
       <button
        onClick={handleUploadClick}
        disabled={isParsing}
        className="mb-4 bg-indigo-600 text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105"
      >
        <DocumentArrowUpIcon className="h-5 w-5" />
        <span>{isParsing ? 'Parsing PDF...' : 'Upload Resume (PDF)'}</span>
      </button>

      {parseError && <p className="text-red-400 text-center mb-4">{parseError}</p>}
      
      <p className="text-gray-400 mb-4 text-center text-sm">{ isParsing ? ' ' : 'or paste your resume text below'}</p>


      <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col items-center gap-4">
        <div className="w-full relative">
          <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none text-gray-400">
            <UploadIcon className="h-5 w-5" />
            <span className="font-medium">Paste or upload resume text here...</span>
          </div>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder=""
            className="w-full bg-gray-900/50 border-2 border-dashed border-gray-600 text-gray-300 rounded-lg p-4 pt-12 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-solid transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!resumeText.trim() || isParsing}
          className="bg-teal-600 text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 transform hover:scale-105"
        >
          <span>Get Insights</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ResumeUpload;