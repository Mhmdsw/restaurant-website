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
    <div className="bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8">

        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-center">
          🍕 Ask our AI Assistant
        </h3>

        <p className="text-muted-foreground text-sm sm:text-base mb-6 text-center">
          Ask about our menu, specials, or ingredients!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Do you have vegan options?"
            className="flex-1 h-12 px-4 border border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="h-12 px-7 bg-primary text-primary-foreground font-medium rounded-xl shadow-sm hover:bg-primary/90 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {error && (
          <div className="mt-5 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
            ⚠️ {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 p-5 bg-muted/50 border border-border rounded-xl">
            <p className="text-foreground font-medium leading-relaxed">
              🤖 {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}