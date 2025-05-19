import { useState, useCallback } from "react";
import { analyzeResume } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import mammoth from "mammoth";
import { Loader2 } from "lucide-react";

const AnalyzeResume = () => {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDrop = useCallback(async (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith("text/")) {
        const reader = new FileReader();
        reader.onload = (e) => setResumeText(e.target.result);
        reader.readAsText(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result;
            const result = await mammoth.convertToText({ arrayBuffer });
            setResumeText(result.value);
          } catch (error) {
            setErrorMessage("Error reading .docx file.");
            console.error("Error reading .docx:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMessage(
          "Only text-based (.txt) and .docx files are supported."
        );
      }
    }
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMessage("Please paste your resume or drop a file.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setAnalysisResult(null);
    try {
      const response = await analyzeResume({ text: resumeText });
      const parsedAnalysis = parseAnalysis(response.data.analysis);
      setAnalysisResult(parsedAnalysis);
    } catch (err) {
      console.error("Error during analysis:", err);
      setErrorMessage(err.response?.data?.message || "Error analyzing resume");
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnalysis = (rawAnalysis) => {
    const sections = {};
    const sectionRegex = /\*\*(.+?):\*\*/g;
    const asteriskRegex = /\*/g; 
    let match;
    let lastIndex = 0;

    while ((match = sectionRegex.exec(rawAnalysis)) !== null) {
      const title = match[1].trim();
      const startIndex = match.index + match[0].length;
      const endIndex = rawAnalysis.indexOf("**", startIndex);
      let content = (
        endIndex === -1
          ? rawAnalysis.substring(startIndex)
          : rawAnalysis.substring(startIndex, endIndex)
      ).trim();
      content = content.replace(asteriskRegex, ""); // Remove asterisks from content
      sections[title] = content;
      lastIndex = sectionRegex.lastIndex;
    }

    if (lastIndex < rawAnalysis.length) {
      let remainingText = rawAnalysis.substring(lastIndex).trim();
      remainingText = remainingText.replace(asteriskRegex, ""); // Remove asterisks from remaining text
      if (remainingText) {
        sections["Overall Feedback"] = remainingText;
      }
    }

    return sections;
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-purple-50 to-indigo-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center w-full max-w-7xl ">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">
          Welcome, {user?.name || "Guest"}!
        </h2>
        <p className="text-gray-700 mb-6">
          Paste your resume below, or drag and drop a text file to get insights.
        </p>

        <div
          className={`relative w-full rounded-md border-2 ${
            isDragging
              ? "border-purple-500 bg-gray-100 bg-opacity-50 border-indigo-300"
              : "border-gray-300 bg-gray-100"
          } mb-6`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here or drag a .txt file"
            rows={10}
            className="w-full px-4 py-3 rounded-md bg-transparent border-none resize-y placeholder-gray-500 text-gray-800 focus:ring-0 focus:outline-none"
          />
          {isDragging && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-indigo-500 text-lg font-semibold bg-indigo-100 bg-opacity-75 rounded-md">
              Drop file here
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-md transition-all duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>

        {errorMessage && (
          <div className="mt-4 text-red-500">{errorMessage}</div>
        )}

        {analysisResult && (
          <div className="bg-gray-100 p-6 rounded-xl shadow-md mt-8 text-left border border-gray-300">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">
              ATS Analysis Result
            </h3>
            {Object.entries(analysisResult).map(([title, content]) => (
              <div key={title} className="mb-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-2">
                  {title}
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content.trim()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeResume;
