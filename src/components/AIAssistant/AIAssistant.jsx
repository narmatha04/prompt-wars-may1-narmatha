import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// In a real production app, this should be called from a secure backend to prevent exposing the API key.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function AIAssistant({ tasks = [] }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskOracle = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Create the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Construct a prompt that includes the user's tasks for context
      const prompt = `
        You are the "Valhalla Oracle", an AI Task Assistant for a team coordination platform.
        Your tone should be slightly mystical but highly professional and concise.
        
        Here is the user's current task list:
        ${JSON.stringify(tasks, null, 2)}
        
        The user asks: "${query}"
        
        Answer the user's question based strictly on their task list. Highlight blockers and priorities.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (err) {
      console.error(err);
      setError('The Oracle is currently blinded by the fog. (API Error)');
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 bg-white/50 dark:bg-valhalla-slate/50 rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto border border-valhalla-ink/10 dark:border-white/10">
        {response ? (
          <div className="text-sm text-valhalla-ink dark:text-gray-200 leading-relaxed whitespace-pre-wrap animate-fade-in">
            {response}
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 animate-fade-in">
            {error}
          </div>
        ) : (
          <div className="text-sm text-valhalla-ink/50 dark:text-gray-500 italic h-full flex items-center justify-center">
            Ask the Oracle about your active quests, blockers, or priorities...
          </div>
        )}
        
        {loading && (
          <div className="flex items-center gap-2 mt-4 text-valhalla-gold dark:text-valhalla-neon font-bold text-sm animate-pulse">
            <span className="text-xl">✨</span> Consulting the runes...
          </div>
        )}
      </div>

      <form onSubmit={handleAskOracle} className="flex gap-2">
        <input 
          type="text" 
          placeholder="e.g., What should I focus on today? Are there any blockers?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading || !API_KEY}
          className="flex-1 bg-white/80 dark:bg-valhalla-void border border-valhalla-ink/20 dark:border-white/20 text-valhalla-ink dark:text-white px-4 py-3 rounded-xl outline-none focus:border-valhalla-gold dark:focus:border-valhalla-neon transition-colors"
        />
        <button 
          type="submit" 
          disabled={loading || !query.trim() || !API_KEY}
          className="bg-gradient-to-r from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          Ask
        </button>
      </form>
      {!API_KEY && (
        <p className="text-xs text-red-500 mt-1">API Key missing. The Oracle is asleep.</p>
      )}
    </div>
  );
}
