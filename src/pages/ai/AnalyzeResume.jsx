import { useState, useCallback, useEffect } from "react";
import { analyzeResume } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import mammoth from "mammoth";
import { Loader2, FileText, UploadCloud, Sparkles, Check, Lightbulb, TrendingUp, X, Clipboard, ClipboardCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';
import { useTypewriter } from 'react-simple-typewriter';

const AnalyzeResume = () => {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);

  const [typedText] = useTypewriter({
    words: analysisResult ? [Object.values(analysisResult)[0]] : [''],
    typeSpeed: 10,
    delaySpeed: 1000,
    deleteSpeed: 0
  });

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setResumeText(''); // Clear previous text
    setAnalysisResult(null);

    try {
      let text = '';
      if (file.type.startsWith("text/")) {
        text = await file.text();
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToText({ arrayBuffer });
        text = result.value;
      } else {
        toast.error("Unsupported file. Please use .txt or .docx");
        setFileName("");
        return;
      }
      setResumeText(text);
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Failed to read file.");
      setFileName("");
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error("Please provide a resume to analyze.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const response = await analyzeResume({ text: resumeText });
      const parsed = parseAnalysis(response.data.analysis);
      setAnalysisResult(parsed);
      toast.success("Resume analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      toast.error(err.response?.data?.message || "Error analyzing resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnalysis = (raw) => {
    const sections = {};
    const sectionRegex = /\*\*(.+?):\*\*/g;
    const asteriskRegex = /\*/g; 
    let match;
    let lastIndex = 0;

    while ((match = sectionRegex.exec(raw)) !== null) {
      const title = match[1].trim();
      const startIndex = match.index + match[0].length;
      const endIndex = raw.indexOf("**", startIndex);
      let content = (
        endIndex === -1
          ? raw.substring(startIndex)
          : raw.substring(startIndex, endIndex)
      ).trim();
      content = content.replace(asteriskRegex, "");
      sections[title] = content;
      lastIndex = sectionRegex.lastIndex;
    }

    if (lastIndex < raw.length) {
      let remainingText = raw.substring(lastIndex).trim();
      remainingText = remainingText.replace(asteriskRegex, "");
      if (remainingText) {
        sections["Overall Feedback"] = remainingText;
      }
    }

    return sections;
  };

  const copyToClipboard = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(Object.values(analysisResult)[0]);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full text-white">
            <Sparkles size={24} />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          AI Resume Analyzer
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          Get instant feedback on your resume. Optimize it for ATS and land your dream job.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }} 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Resume</h2>
          
          <div 
            className={`relative w-full rounded-xl border-2 border-dashed transition-all ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume here..."
              rows={15}
              className="w-full p-4 rounded-xl bg-transparent border-none resize-none placeholder:text-slate-400 text-slate-700 dark:text-slate-300 focus:ring-0 focus:outline-none"
            />
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity pointer-events-none ${
              resumeText || fileName ? 'opacity-0' : 'opacity-100'
            }`}>
              <UploadCloud size={48} className={`mb-4 transition-transform ${
                isDragging ? 'scale-110' : ''
              } text-slate-400`} />
              <p className="text-slate-500 font-medium">Drag & Drop Your Resume File</p>
              <p className="text-slate-400 text-sm">(.txt or .docx)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="flex-1">
              <label htmlFor="resume-upload" className="cursor-pointer flex items-center justify-center gap-2">
                <FileText className="w-4 h-4"/>
                {fileName ? (
                  <span className="truncate max-w-[160px]">{fileName}</span>
                ) : (
                  'Upload File'
                )}
              </label>
            </Button>
            <input 
              id="resume-upload" 
              type="file" 
              className="hidden" 
              accept=".txt,.docx" 
              onChange={handleFileChange} 
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !resumeText.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2"/> 
                  Analyze
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Output Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 min-h-[500px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analysis & Feedback</h2>
            {analysisResult && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyToClipboard}
                className="text-slate-500 hover:text-indigo-600"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex-grow">
            <AnimatePresence>
              {!analysisResult && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500"
                >
                  <Sparkles size={48} className="mx-auto mb-4 text-indigo-300"/>
                  <p className="font-medium">Your insights will appear here</p>
                  <p className="text-sm mt-2">Upload or paste your resume to get started</p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="h-full flex flex-col items-center justify-center text-center py-20 text-indigo-500"
                >
                  <Loader2 size={48} className="mx-auto animate-spin mb-4"/>
                  <p className="font-medium">Our AI is analyzing your resume...</p>
                  <p className="text-sm mt-2">This may take a few moments</p>
                </motion.div>
              )}

              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="h-full overflow-y-auto"
                >
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {Object.entries(analysisResult).map(([title, content]) => (
                      <div key={title} className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                          {title}
                        </h3>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {title === Object.keys(analysisResult)[0] ? typedText : content}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {analysisResult && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" className="w-full">
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Personalized Improvement Tips
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyzeResume;
// import { useState, useCallback } from "react";
// import { analyzeResume } from "../../api/aiApi";
// import { useAuth } from "../../context/AuthContext";
// import mammoth from "mammoth";
// import { Loader2 } from "lucide-react";

// const AnalyzeResume = () => {
//   const { user } = useAuth();
//   const [resumeText, setResumeText] = useState("");
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleDrop = useCallback(async (event) => {
//     event.preventDefault();
//     setIsDragging(false);

//     if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
//       const file = event.dataTransfer.files[0];
//       if (file.type.startsWith("text/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => setResumeText(e.target.result);
//         reader.readAsText(file);
//       } else if (
//         file.type ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         const reader = new FileReader();
//         reader.onload = async (e) => {
//           try {
//             const arrayBuffer = e.target.result;
//             const result = await mammoth.convertToText({ arrayBuffer });
//             setResumeText(result.value);
//           } catch (error) {
//             setErrorMessage("Error reading .docx file.");
//             console.error("Error reading .docx:", error);
//           }
//         };
//         reader.readAsArrayBuffer(file);
//       } else {
//         setErrorMessage(
//           "Only text-based (.txt) and .docx files are supported."
//         );
//       }
//     }
//   }, []);

//   const handleDragOver = useCallback((event) => {
//     event.preventDefault();
//     setIsDragging(true);
//   }, []);

//   const handleDragLeave = useCallback(() => setIsDragging(false), []);

//   const handleAnalyze = async () => {
//     if (!resumeText.trim()) {
//       setErrorMessage("Please paste your resume or drop a file.");
//       return;
//     }
//     setIsLoading(true);
//     setErrorMessage("");
//     setAnalysisResult(null);
//     try {
//       const response = await analyzeResume({ text: resumeText });
//       const parsedAnalysis = parseAnalysis(response.data.analysis);
//       setAnalysisResult(parsedAnalysis);
//     } catch (err) {
//       console.error("Error during analysis:", err);
//       setErrorMessage(err.response?.data?.message || "Error analyzing resume");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const parseAnalysis = (rawAnalysis) => {
//     const sections = {};
//     const sectionRegex = /\*\*(.+?):\*\*/g;
//     const asteriskRegex = /\*/g; 
//     let match;
//     let lastIndex = 0;

//     while ((match = sectionRegex.exec(rawAnalysis)) !== null) {
//       const title = match[1].trim();
//       const startIndex = match.index + match[0].length;
//       const endIndex = rawAnalysis.indexOf("**", startIndex);
//       let content = (
//         endIndex === -1
//           ? rawAnalysis.substring(startIndex)
//           : rawAnalysis.substring(startIndex, endIndex)
//       ).trim();
//       content = content.replace(asteriskRegex, ""); // Remove asterisks from content
//       sections[title] = content;
//       lastIndex = sectionRegex.lastIndex;
//     }

//     if (lastIndex < rawAnalysis.length) {
//       let remainingText = rawAnalysis.substring(lastIndex).trim();
//       remainingText = remainingText.replace(asteriskRegex, ""); // Remove asterisks from remaining text
//       if (remainingText) {
//         sections["Overall Feedback"] = remainingText;
//       }
//     }

//     return sections;
//   };

//   return (
//     <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-purple-50 to-indigo-200 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center w-full max-w-7xl ">
//         <h2 className="text-3xl font-bold text-indigo-700 mb-4">
//           Welcome, {user?.name || "Guest"}!
//         </h2>
//         <p className="text-gray-700 mb-6">
//           Paste your resume below, or drag and drop a text file to get insights.
//         </p>

//         <div
//           className={`relative w-full rounded-md border-2 ${
//             isDragging
//               ? "border-purple-500 bg-gray-100 bg-opacity-50 border-indigo-300"
//               : "border-gray-300 bg-gray-100"
//           } mb-6`}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           onDragLeave={handleDragLeave}
//         >
//           <textarea
//             value={resumeText}
//             onChange={(e) => setResumeText(e.target.value)}
//             placeholder="Paste your resume here or drag a .txt file"
//             rows={10}
//             className="w-full px-4 py-3 rounded-md bg-transparent border-none resize-y placeholder-gray-500 text-gray-800 focus:ring-0 focus:outline-none"
//           />
//           {isDragging && (
//             <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-indigo-500 text-lg font-semibold bg-indigo-100 bg-opacity-75 rounded-md">
//               Drop file here
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleAnalyze}
//           disabled={isLoading}
//           className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="animate-spin" size={20} />
//               Analyzing...
//             </>
//           ) : (
//             "Analyze Resume"
//           )}
//         </button>

//         {errorMessage && (
//           <div className="mt-4 text-red-500">{errorMessage}</div>
//         )}

//         {analysisResult && (
//           <div className="bg-gray-100 p-6 rounded-xl shadow-md mt-8 text-left border border-gray-300">
//             <h3 className="text-xl font-semibold text-indigo-700 mb-4">
//               ATS Analysis Result
//             </h3>
//             {Object.entries(analysisResult).map(([title, content]) => (
//               <div key={title} className="mb-5">
//                 <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-2">
//                   {title}
//                 </h4>
//                 <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                   {content.trim()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AnalyzeResume;
