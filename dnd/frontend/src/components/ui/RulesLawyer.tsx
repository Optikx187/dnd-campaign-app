import { useState } from 'react';

export default function RulesLawyer() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('http://localhost:3000/api/rules/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error asking rules lawyer:', error);
      setAnswer('Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">D&D 5e Rules Lawyer</h1>
      <p className="text-gray-600 text-center mb-6">
        Ask any question about Dungeons & Dragons 5th Edition rules
      </p>

      <div className="mb-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about D&D 5e rules..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={askQuestion}
        disabled={isLoading || !question.trim()}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {isLoading ? 'Consulting the rules...' : 'Ask Rules Lawyer'}
      </button>

      {answer && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Answer:</h3>
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
