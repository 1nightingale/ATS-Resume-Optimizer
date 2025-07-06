# ATS Resume Optimizer

This is an AI-powered web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). It uses Google Search to analyze live, real-time job postings for a specific role and builds an ideal candidate profile. It then provides actionable feedback on how to improve your resume to match.

## ✨ Features

*   **Live Job Market Analysis**: Uses Google Search to analyze current job postings for your target role, building a data-driven profile of the ideal candidate based on real-world data.
*   **Instant Resume Analysis**: Upload or paste your resume to get an immediate ATS match score against the ideal profile.
*   **Keyword Comparison**: See which required skills and keywords you have, and more importantly, which ones you're missing.
*   **AI-Powered Recommendations**: Receive personalized, actionable tips on how to incorporate missing keywords and better align your resume with what employers are looking for *right now*.
*   **Local Caching**: Previous analyses are saved in your browser's local storage for quick access, so you don't have to re-run the same analysis.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **Charting**: Chart.js
*   **AI**: Google Gemini API with Google Search grounding

## 🚀 How to Run with Your Own API Key

This project is designed to be run in a development environment that supports environment variables (like a local development server or a cloud-based IDE).

To use your own Google Gemini API key, follow these steps:

1.  **Get a Gemini API Key**: If you don't have one, you can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

2.  **Set the Environment Variable**: You must create an environment variable named `API_KEY`. The application is hard-coded to read the key from `process.env.API_KEY`.

    For example, if you are using a terminal, you might run:
    ```bash
    export API_KEY="YOUR_API_KEY_HERE"
    ```
    Or, if your development environment uses a `.env` file, you would create a file named `.env` in the root of the project and add the following line:
    ```
    API_KEY="YOUR_API_KEY_HERE"
    ```
    **Note**: The method for setting environment variables can vary depending on your specific development setup. Please consult the documentation for your tool of choice.

3.  **Run the Application**: Once the `API_KEY` is set, you can start the development server. The application will automatically use your key to communicate with the Gemini API.

## ⚠️ Disclaimer

This is a demonstration application built for educational purposes. Always use your best judgment when tailoring your resume. AI-generated insights are a powerful tool, but they are not a substitute for professional career advice.