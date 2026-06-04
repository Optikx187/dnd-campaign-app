import { useState } from 'react';
import { apiPost } from '../../lib/api';

export default function RulesLawyer() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');

    try {
      const data = await apiPost<{ answer: string }>('/api/rules/ask', { question });
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking rules lawyer:', error);
      setAnswer('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/30">
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">📜</span>
        <h1 className="text-3xl font-bold text-white">D&D 5e Rules Lawyer</h1>
        <p className="text-gray-400 text-center mt-2">
          Ask any question about Dungeons & Dragons 5th Edition rules
        </p>
      </div>

      <div className="mb-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about D&D 5e rules..."
          className="w-full p-4 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={askQuestion}
        disabled={isLoading || !question.trim()}
        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed mb-6 transition-all shadow-lg shadow-purple-500/50 font-medium"
      >
        {isLoading ? '📚 Consulting ancient tomes...' : '📜 Ask Rules Lawyer'}
      </button>

      {answer && (
        <div className="bg-slate-700/50 p-4 rounded-lg border border-purple-500/30">
          <h3 className="font-semibold mb-2 text-white">Answer:</h3>
          <p className="whitespace-pre-wrap text-gray-200">{answer}</p>
        </div>
      )}
    </div>
  );
}
