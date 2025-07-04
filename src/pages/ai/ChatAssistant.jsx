import { useState, useRef, useEffect } from 'react';
import { chatAssistant } from "../../api/aiApi";
import { FiSend, FiUser } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import { BsStars, BsLightningChargeFill } from 'react-icons/bs';
import { TbBrandOpenai } from 'react-icons/tb';

const ChatAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAssistant(input);
      const botMessage = { text: res.data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        text: err.response?.data?.message || 'Sorry, I encountered an error. Please try again.', 
        sender: 'bot',
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Premium Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <RiRobot2Line className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">JobHunt AI Assistant</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full">
                    <TbBrandOpenai className="inline mr-1" />
                    GPT-4 Turbo
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Real-time career guidance</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <BsStars className="text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Premium AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="mb-6 p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400">
                  <RiRobot2Line className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">JobHunt AI Assistant</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                  I can help with job searches, resume optimization, interview prep, and career advice. 
                  How can I assist you today?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                  {[
                    "Find software engineer jobs",
                    "Improve my resume for tech roles",
                    "Common interview questions for marketing",
                    "Career change advice"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="text-sm text-left p-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3xl rounded-2xl px-5 py-4 ${message.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : message.isError 
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-bl-none'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'}`}
                    >
                      <div className="flex items-center mb-2">
                        {message.sender === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center mr-3">
                            <FiUser className="text-white" />
                          </div>
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            message.isError 
                              ? 'bg-red-200 dark:bg-red-800 text-red-600 dark:text-red-300'
                              : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            <RiRobot2Line />
                          </div>
                        )}
                        <span className="font-medium">
                          {message.sender === 'user' ? 'You' : 'JobHunt AI'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap ml-11">{message.text}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none px-5 py-4 max-w-md shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                          <RiRobot2Line />
                        </div>
                        <span className="font-medium">JobHunt AI</span>
                      </div>
                      <div className="flex space-x-2 pt-1 ml-11">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Premium Input Area */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="relative">
              <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-gray-800 text-xs text-indigo-600 dark:text-indigo-400 font-medium rounded-full">
                Ask JobHunt AI
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-5 py-4 pr-14 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 shadow-sm"
                placeholder="Ask about jobs, resumes, interviews..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  loading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : input.trim() 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <IoSend className="text-lg" />
                )}
              </button>
            </div>
            <div className="mt-2 flex justify-between items-center px-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length > 0 ? `${input.length}/500` : 'Shift+Enter for new line'}
              </span>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <BsLightningChargeFill className="mr-1 text-yellow-500" />
                Powered by GPT-4 Turbo
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700/50 py-3 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            JobHunt AI may produce inaccurate information. Always verify important details.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">v2.4.1</span>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full">
              System Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatAssistant;
// import { useState } from 'react';
// import { chatAssistant } from "../../api/aiApi";

// const ChatAssistant = () => {
//   const [question, setQuestion] = useState('');
//   const [response, setResponse] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChat = async () => {
//     if (!question.trim()) {
//       setError('Please enter your question.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setResponse('');
//     try {
//       const res = await chatAssistant(question);
//       setResponse(res.data.response);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error getting response');
//       console.error('Chat Assistant Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center bg-gradient-to-br from-purple-50 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-7xl min-h-screen">
//         <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
//           JobHunt Chat Assistant
//         </h2>
//         <div className="mb-4">
//           <label htmlFor="question" className="sr-only">
//             Ask a question about the job portal...
//           </label>
//           <input
//             type="text"
//             id="question"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
//             placeholder="Ask a question about the job portal..."
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             onClick={handleChat}
//             disabled={loading}
//             className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//               loading ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? 'Asking...' : 'Ask'}
//           </button>
//         </div>

//         {error && (
//           <div className="mt-4 text-red-500">{error}</div>
//         )}

//         {response && (
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <h3 className="text-lg font-semibold text-indigo-700 mb-2">
//               Assistant Response:
//             </h3>
//             <pre className="bg-gray-100 rounded-md p-4 text-sm text-gray-800 whitespace-pre-wrap break-words">
//               {response}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatAssistant;
