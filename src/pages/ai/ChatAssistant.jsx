import { useState } from 'react';
import { chatAssistant } from "../../api/aiApi";

const ChatAssistant = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChat = async () => {
    if (!question.trim()) {
      setError('Please enter your question.');
      return;
    }
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await chatAssistant(question);
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.message || 'Error getting response');
      console.error('Chat Assistant Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-purple-50 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-7xl min-h-screen">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          JobHunt Chat Assistant
        </h2>
        <div className="mb-4">
          <label htmlFor="question" className="sr-only">
            Ask a question about the job portal...
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
            placeholder="Ask a question about the job portal..."
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleChat}
            disabled={loading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}

        {response && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
              Assistant Response:
            </h3>
            <pre className="bg-gray-100 rounded-md p-4 text-sm text-gray-800 whitespace-pre-wrap break-words">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAssistant;
