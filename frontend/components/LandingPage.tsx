
import React, { useState } from 'react';
import ResumeUpload from './ResumeUpload';

const LandingPage = () => {
	const [showResumeUpload, setShowResumeUpload] = useState(false);
	if (showResumeUpload) {
		return <ResumeUpload />;
	}
	return (
		<main style={{ minHeight: '100vh', background: '#181c23', color: '#fff', padding: '2rem' }}>
			<h1 style={{ textAlign: 'center', fontSize: '2.5rem', margin: '2rem 0', color: '#5eead4' }}>
				ATS Resume Optimizer
			</h1>
			<p style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 2rem', color: '#b3b3b3' }}>
				Reverse-engineer the ideal candidate profile and get actionable insights to beat the bots.
			</p>
			<section style={{ background: '#232837', borderRadius: 16, padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
				<h2 style={{ color: '#5eead4', textAlign: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
					Beat the Bots. <span style={{ color: '#38bdf8' }}>Land the Interview.</span>
				</h2>
				<p style={{ textAlign: 'center', color: '#b3b3b3', marginBottom: '2rem' }}>
					Our AI-powered optimizer analyzes job descriptions to reveal what Applicant Tracking Systems (ATS) want, then shows you exactly how to tailor your resume for success.
				</p>
				<div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
					<div style={{ background: '#181c23', borderRadius: 12, padding: 24, width: 200, textAlign: 'center' }}>
						<div style={{ fontSize: 32, marginBottom: 8 }}>🧑‍💼</div>
						<strong>Reverse-Engineer Profiles</strong>
						<p style={{ color: '#b3b3b3', fontSize: 14 }}>
							We analyze dozens of job listings for your target role to build a data-driven profile of the ideal candidate.
						</p>
					</div>
					<div style={{ background: '#181c23', borderRadius: 12, padding: 24, width: 200, textAlign: 'center' }}>
						<div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
						<strong>Analyze Your Resume</strong>
						<p style={{ color: '#b3b3b3', fontSize: 14 }}>
							Upload or paste your resume to get an instant match score and see how it compares to the ideal profile.
						</p>
					</div>
					<div style={{ background: '#181c23', borderRadius: 12, padding: 24, width: 200, textAlign: 'center' }}>
						<div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
						<strong>Get Actionable Insights</strong>
						<p style={{ color: '#b3b3b3', fontSize: 14 }}>
							Receive personalized, AI-generated recommendations to make your resume stand out and beat the bots.
						</p>
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<button
						style={{ background: '#14b8a6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 2rem', fontSize: 18, cursor: 'pointer' }}
						onClick={() => setShowResumeUpload(true)}
					>
						Start Optimizing &nbsp; <span style={{ fontSize: 20 }}>➔</span>
					</button>
				</div>
			</section>
			<footer style={{ textAlign: 'center', color: '#b3b3b3', marginTop: 32, fontSize: 13 }}>
				Powered by Gemini API. Designed for educational and demonstration purposes.
			</footer>
		</main>
	);
};

export default LandingPage;