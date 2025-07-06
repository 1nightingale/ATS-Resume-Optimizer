



import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ATSProfile, AnalysisResult } from '../types';

// Use a getter to lazily initialize the AI client.
// This prevents the app from crashing on startup if the API key isn't set.
let aiInstance: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
    if (!aiInstance) {
        // Safely check for the API key in a way that works in all environments.
        // This prevents a crash if `process` or `process.env` is not defined.
        const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

        if (!apiKey) {
            // This error will be caught by the calling function's try/catch block,
            // allowing the UI to display a meaningful error message instead of a blank screen.
            throw new Error("API key not found. Please ensure the API_KEY environment variable is correctly configured in your application's hosting environment.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};


const parseJsonFromResponse = <T,>(text: string): T => {
    let jsonStr = text.trim();

    // Regular expression to find a JSON object wrapped in markdown fences (e.g., ```json ... ```)
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

    if (fenceMatch && fenceMatch[1]) {
        jsonStr = fenceMatch[1].trim();
    } else {
        // If no markdown fence is found, find the first '{' or '[' and the corresponding last '}' or ']'.
        // This is a robust way to handle conversational text around a JSON object.
        const firstBracket = jsonStr.indexOf('{');
        const firstSquare = jsonStr.indexOf('[');
        
        if (firstBracket === -1 && firstSquare === -1) {
            console.error("No JSON object or array found in the AI response.", text);
            throw new Error("AI response did not contain a valid JSON object or array.");
        }
        
        const start = firstBracket === -1 ? firstSquare :
                      firstSquare === -1 ? firstBracket :
                      Math.min(firstBracket, firstSquare);
        
        const endChar = jsonStr[start] === '{' ? '}' : ']';
        const end = jsonStr.lastIndexOf(endChar);

        if (end === -1 || end < start) {
            console.error("Malformed JSON structure in AI response.", text);
            throw new Error("AI response contained an incomplete JSON object or array.");
        }

        jsonStr = jsonStr.substring(start, end + 1);
    }

    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        // Log the problematic string for debugging, then re-throw to be caught by retry logic.
        console.error("Failed to parse JSON response:", jsonStr);
        // The original error (e) will have more details about the parsing failure.
        throw e;
    }
};

async function callGenerativeAIWithRetries<T>(
    apiCall: () => Promise<GenerateContentResponse>,
    parser: (text: string) => T,
    maxRetries: number = 3
): Promise<T> {
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await apiCall();
            // The parser will throw an error if JSON is invalid, which is caught below.
            return parser(response.text);
        } catch (error) {
            lastError = error as Error;
            console.warn(`Attempt ${i + 1} of ${maxRetries} failed: ${lastError.message}`);
            if (i < maxRetries - 1) {
                // Wait before retrying with exponential backoff
                const delay = 1000 * (i + 1);
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.error("All retry attempts failed.");
    throw new Error(`The AI failed to provide a valid response after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

export const generateProfileFromWeb = async (jobTitle: string): Promise<ATSProfile> => {
    const prompt = `You are an expert recruitment analyst with access to Google Search.
    Your task is to analyze the current job market for the role of a '${jobTitle}'.
    1.  Perform a Google Search to find multiple real, recent, and diverse job descriptions for this role.
    2.  Based on your search results, synthesize the information to build an ideal candidate profile.
    3.  Identify:
        - The top 15 most frequently mentioned technical skills.
        - The top 10 most frequently mentioned soft skills.
        - The top 5 required qualifications (like degrees, certifications, or years of experience).
        - A list of 20-30 other important keywords (e.g., specific tools, methodologies, industry terms).

    Return the result as a single JSON object with keys: "technicalSkills", "softSkills", "qualifications", and "keywords".
    Each key should have an array of objects as its value. Each object in the array must have two properties: "name" (string) and "frequency" (number, representing a score of importance based on frequency and context in the job descriptions). Sort each list by frequency in descending order.

    CRITICAL: The entire response must be a single, valid JSON object and nothing else. Do not include any introductory or conversational text. Double-check for syntax errors like trailing commas or unquoted strings before responding.`;

    const apiCall = () => getAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.2,
        },
    });

    return callGenerativeAIWithRetries<ATSProfile>(apiCall, parseJsonFromResponse);
};


export const compareResumeToProfile = async (resumeText: string, profile: ATSProfile): Promise<AnalysisResult> => {
    const prompt = `You are an expert career coach specializing in resume optimization for ATS systems.
Here is the ideal candidate profile derived from multiple job descriptions:
${JSON.stringify(profile, null, 2)}

And here is the candidate's resume:
---
${resumeText}
---

Perform the following tasks:
1.  **Calculate a match score**: Based on how well the resume aligns with the ideal profile, provide a score from 0 to 100.
2.  **Identify keywords**: List which keywords and skills from the profile's 'technicalSkills' and 'keywords' lists are present in the resume.
3.  **Identify missing keywords**: List the most important keywords and skills from the profile that are MISSING from the resume.
4.  **Provide recommendations**: Give 3-5 concise, actionable bullet points on how to improve the resume to better match the profile. Focus on incorporating missing keywords naturally.

Return the result as a single JSON object with keys: "matchScore" (number), "matchingKeywords" (array of strings), "missingKeywords" (array of strings), and "recommendations" (an array of strings, where each string is a single recommendation).
CRITICAL: The response must be a single, valid JSON object. Do not include any extra text or formatting outside of the JSON structure.`;

    const apiCall = () => getAI().models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5
        },
    });
    
    return callGenerativeAIWithRetries<AnalysisResult>(apiCall, parseJsonFromResponse);
};