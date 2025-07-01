import { useState, useRef, useEffect } from 'react';
import { chatAssistant } from "../../api/aiApi";
import { FiSend, FiUser, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md py-4 px-6 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <RiRobot2Line className="mr-2" />
            JobHunt AI Assistant
          </h1>
          <div className="text-sm text-white/80">Powered by GPT-4</div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto rounded-t-xl bg-white/5 backdrop-blur-md p-4 border border-white/10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-white/70">
                <FiMessageSquare className="text-4xl mb-4" />
                <h3 className="text-xl font-medium mb-2">JobHunt AI Assistant</h3>
                <p className="max-w-md">
                  Ask me anything about job opportunities, resume tips, interview preparation, 
                  or career advice. I'm here to help!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3xl rounded-lg px-4 py-3 ${message.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : message.isError 
                          ? 'bg-red-500/20 text-red-200 rounded-bl-none' 
                          : 'bg-white/10 text-white rounded-bl-none'}`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'user' ? (
                          <FiUser className="mr-2" />
                        ) : (
                          <RiRobot2Line className="mr-2" />
                        )}
                        <span className="font-medium">
                          {message.sender === 'user' ? 'You' : 'JobHunt AI'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">{message.text}</div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white rounded-lg rounded-bl-none px-4 py-3 max-w-xs">
                      <div className="flex items-center">
                        <RiRobot2Line className="mr-2" />
                        <span className="font-medium">JobHunt AI</span>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-b-xl px-4 py-3 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="Ask about jobs, resumes, interviews..."
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 text-white/60 text-center py-3 text-xs">
        JobHunt AI Assistant may produce inaccurate information. Always verify important details.
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
