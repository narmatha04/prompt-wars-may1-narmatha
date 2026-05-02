import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const MAX_QUERY_LENGTH = 300;
const RATE_LIMIT_MS = 5000; // minimum ms between requests

/** Strip characters that could break out of the prompt template */
const sanitizeInput = (input) =>
  input
    .slice(0, MAX_QUERY_LENGTH)
    .replace(/[`\\]/g, '')        // remove backticks and backslashes
    .replace(/\$\{[^}]*\}/g, '')  // remove template-literal injections
    .trim();

export default function AIAssistant({ tasks }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rate-limit: track timestamp of last successful request
  const lastRequestRef = useRef(0);
  // AbortController ref so in-flight requests can be cancelled on unmount
  const abortRef = useRef(null);

  const handleAskOracle = useCallback(async (e) => {
    e.preventDefault();
    const safeQuery = sanitizeInput(query);
    if (!safeQuery) return;

    const now = Date.now();
    if (now - lastRequestRef.current < RATE_LIMIT_MS) {
      setError(`Please wait a moment before asking again.`);
      return;
    }

    // Cancel any previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError('');
    setResponse('');

    try {
      if (!genAI) throw new Error('API Key is missing. The Oracle cannot awaken.');

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are the "Valhalla Oracle", an AI Task Assistant for a team coordination platform.
        Your tone should be slightly mystical but highly professional and concise.
        Respond in plain text only — no markdown, no code blocks.

        Here is the user's current task list:
        ${JSON.stringify(tasks, null, 2)}

        The user asks: "${safeQuery}"

        Answer based strictly on the task list. Highlight blockers and top priorities.
        Keep your answer under 150 words.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      lastRequestRef.current = Date.now();
      setResponse(text);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError('The Oracle is currently blinded by the fog. (API Error)');
      }
    } finally {
      setLoading(false);
      setQuery('');
    }
  }, [query, tasks]);

  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value.slice(0, MAX_QUERY_LENGTH));
  }, []);

  const charsLeft = MAX_QUERY_LENGTH - query.length;

  return (
    <div className="flex flex-col gap-4">
      {/* aria-live so screen readers announce the AI response automatically */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label="Oracle response"
        className="flex-1 bg-white/50 dark:bg-valhalla-slate/50 rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto border border-valhalla-ink/10 dark:border-white/10"
      >
        {response ? (
          <p className="text-sm text-valhalla-ink dark:text-gray-200 leading-relaxed whitespace-pre-wrap animate-fade-in">
            {response}
          </p>
        ) : error ? (
          <p role="alert" className="text-sm text-red-500 animate-fade-in">
            {error}
          </p>
        ) : (
          <p className="text-sm text-valhalla-ink/50 dark:text-gray-500 italic h-full flex items-center justify-center">
            Ask the Oracle about your active quests, blockers, or priorities...
          </p>
        )}

        {loading && (
          <div
            role="status"
            aria-label="Consulting the Oracle"
            className="flex items-center gap-2 mt-4 text-valhalla-gold dark:text-valhalla-neon font-bold text-sm animate-pulse"
          >
            <span aria-hidden="true" className="text-xl">✨</span>
            <span>Consulting the runes...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleAskOracle} aria-label="Ask the Oracle" className="flex flex-col gap-2">
        <div className="flex gap-2">
          <label htmlFor="oracle-query" className="sr-only">
            Ask the Oracle a question about your tasks
          </label>
          <input
            id="oracle-query"
            type="text"
            placeholder="e.g., What should I focus on today? Are there any blockers?"
            value={query}
            onChange={handleQueryChange}
            disabled={loading || !API_KEY}
            maxLength={MAX_QUERY_LENGTH}
            aria-describedby="oracle-char-count"
            className="flex-1 bg-white/80 dark:bg-valhalla-void border border-valhalla-ink/20 dark:border-white/20 text-valhalla-ink dark:text-white px-4 py-3 rounded-xl outline-none focus:border-valhalla-gold dark:focus:border-valhalla-neon transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !query.trim() || !API_KEY}
            aria-label="Submit question to Oracle"
            className="bg-gradient-to-r from-valhalla-gold to-amber-700 dark:from-valhalla-neon dark:to-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            Ask
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span id="oracle-char-count" aria-live="polite" className="text-xs text-valhalla-ink/40 dark:text-gray-500">
            {charsLeft} characters remaining
          </span>
          {!API_KEY && (
            <p role="alert" className="text-xs text-red-500">
              API Key missing. The Oracle is asleep.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

AIAssistant.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      confidence: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    })
  ),
};

AIAssistant.defaultProps = {
  tasks: [],
};
