import { useState, useCallback } from "react";
import { analyzeUploadedResumeApi } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import { Loader2, FileText, UploadCloud, Sparkles, Check, Lightbulb, Clipboard, ClipboardCheck, FileInput, FileCheck, FileSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { toast } from 'react-hot-toast';
import { useTypewriter } from 'react-simple-typewriter';

const AnalyzeResume = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFile = useCallback((file) => {
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file. Please use PDF, DOCX, or TXT");
      return;
    }
    
    setFileName(file.name);
    setSelectedFile(file);
    setAnalysisResult(null);
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
    if (!selectedFile) {
      toast.error("Please upload a resume to analyze.");
      return;
    }
    
    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await analyzeUploadedResumeApi(formData);
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

  const getFileIcon = () => {
    if (!fileName) return <FileInput size={48} />;
    if (fileName.endsWith('.pdf')) return <FileText size={48} />;
    if (fileName.endsWith('.docx')) return <FileCheck size={48} />;
    return <FileSearch size={48} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg mb-6 border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full text-white">
            <Sparkles size={24} />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          AI Resume Analyzer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get professional feedback on your resume in seconds
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Side */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2 }} 
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your Resume</h2>
            <div className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
              AI-Powered Analysis
            </div>
          </div>
          
          <div 
            className={`relative w-full h-80 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
          >
            {fileName ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4 mx-auto">
                  {getFileIcon()}
                </div>
                <p className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-xs">{fileName}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {selectedFile?.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileName("");
                  }}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <div className="text-center pointer-events-none p-6">
                <UploadCloud size={48} className={`mx-auto mb-4 transition-transform ${
                  isDragging ? 'scale-110' : ''
                } text-gray-400`} />
                <p className="text-gray-500 font-medium">Drag & Drop Your Resume</p>
                <p className="text-gray-400 text-sm mt-1">Supports PDF, DOCX, and TXT</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="flex-1">
              <label htmlFor="resume-upload" className="cursor-pointer flex items-center justify-center gap-2">
                <FileText className="w-4 h-4"/>
                {fileName ? 'Replace File' : 'Select File'}
              </label>
            </Button>
            <input 
              id="resume-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx,.txt" 
              onChange={handleFileChange} 
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !selectedFile}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4"/> 
                  Analyze
                </>
              )}
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                  <Lightbulb className="w-3 h-3" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For best results, upload a resume with clear sections for experience, education, and skills.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Output Side */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.4 }} 
          className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 min-h-[500px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
            {analysisResult && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyToClipboard}
                className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 gap-2"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4" />
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
                  className="h-full flex flex-col items-center justify-center text-center py-20 text-gray-500 dark:text-gray-400"
                >
                  <FileSearch size={48} className="mx-auto mb-4 text-indigo-300 dark:text-indigo-500"/>
                  <p className="font-medium">Your analysis will appear here</p>
                  <p className="text-sm mt-2">Upload and analyze your resume to get started</p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="h-full flex flex-col items-center justify-center text-center py-20 text-indigo-500"
                >
                  <div className="relative">
                    <Loader2 size={48} className="mx-auto animate-spin mb-4"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
                    </div>
                  </div>
                  <p className="font-medium">Analyzing your resume</p>
                  <p className="text-sm mt-2">This usually takes about 10-15 seconds</p>
                </motion.div>
              )}

              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="h-full overflow-y-auto"
                >
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {Object.entries(analysisResult).map(([title, content]) => (
                      <div key={title} className="mb-8 last:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                            {title.includes('Strengths') ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : title.includes('Improve') ? (
                              <Lightbulb className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {title}
                          </h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-11">
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
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button className="w-full gap-2">
                <Lightbulb className="w-4 h-4" />
                Get Personalized Improvement Plan
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
