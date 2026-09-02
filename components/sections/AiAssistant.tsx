'use client';

import { useState } from 'react';
import { askAI } from '@/lib/api';

export default function AiAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const data = await askAI(question);
      setAnswer(data.answer);
    } catch (err) {
      setError('Could not connect to the AI assistant. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto my-8">
      <h3 className="text-2xl font-bold text-orange-600 mb-2">
        🍕 Ask our AI Assistant 
      </h3>

      <p className="text-gray-500 text-sm mb-4">
        Ask about our menu, specials, or ingredients!
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Do you have vegan options?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {answer && (
        <div className="mt-4 p-4 bg-gray-50 border-l-4 border-orange-500 rounded-r-lg">
          <p className="text-gray-700 font-medium">
            🤖 {answer}
          </p>
        </div>
      )}
    </div>
  );
}