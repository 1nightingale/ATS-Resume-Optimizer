
import React, { useState } from 'react';
import { getApiUrl } from '../utils/apiConfig';

const ResumeUpload = () => {
	const [resume, setResume] = useState('');
	const [jobTitle, setJobTitle] = useState('');
	const [result, setResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const response = await fetch(`${getApiUrl()}/analyze`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ resume, jobTitle })
			});
			if (!response.ok) throw new Error('Failed to analyze resume');
			const data = await response.json();
			setResult(data);
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ color: '#fff', padding: 40, maxWidth: 600, margin: '0 auto' }}>
			<h2>Analyze Your Resume</h2>
			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
				<label>
					Job Title:
					<input
						type="text"
						value={jobTitle}
						onChange={e => setJobTitle(e.target.value)}
						required
						style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', marginTop: 4 }}
					/>
				</label>
				<label>
					Paste Resume Text:
					<textarea
						value={resume}
						onChange={e => setResume(e.target.value)}
						required
						rows={10}
						style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #333', marginTop: 4 }}
					/>
				</label>
				<button
					type="submit"
					style={{ background: '#14b8a6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.75rem 2rem', fontSize: 18, cursor: 'pointer' }}
					disabled={loading}
				>
					{loading ? 'Analyzing...' : 'Analyze Resume'}
				</button>
			</form>
			{error && <div style={{ color: '#f87171', marginTop: 16 }}>{error}</div>}
			{result && (
				<div style={{ background: '#232837', borderRadius: 12, padding: 24, marginTop: 24 }}>
					<h3>Analysis Result</h3>
					<pre style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default ResumeUpload;