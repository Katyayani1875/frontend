import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/Input";
import { motion } from "framer-motion";
import { Progress } from "../components/ui/progress";
import {
  UserCircle,
  BrainCircuit,
  Zap,
  CheckCircle,
  Edit,
  Camera,
} from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import mammoth from 'mammoth';

// Import ALL AI routes from api/aiApi.js
import {
  analyzeResume,
  recommendJobs,
} from "../api/aiApi";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function ProfilePage({ userType, isLoggedIn, userName }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInsights, setAiInsights] = useState({
    resumeScore: null,
    jobMatches: [],
  });
  const [avatarImage, setAvatarImage] = useState("https://i.pravatar.cc/150?img=5");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isRecommendingJobs, setIsRecommendingJobs] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    // Optionally re-validate token here if needed
  }, [authToken, isLoggedIn]);

  const processPdfFile = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(s => s.str).join(' ') + '\n';
      }
      return text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      alert("Failed to parse the PDF file.");
      return null;
    }
  }, []);

  const processDocxFile = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      alert("Failed to parse the DOCX file.");
      return null;
    }
  }, []);

  const processTextFile = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading text file:", error);
        alert("Failed to read the text file.");
        reject(null);
      };
      reader.readAsText(file);
    });
  }, []);

  const handleFileChange = useCallback(async (file) => {
    setResumeFile(file);
    setResumeText("");

    if (file) {
      let extractedText = null;
      if (file.type === 'application/pdf') {
        extractedText = await processPdfFile(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
        extractedText = await processDocxFile(file);
      } else if (file.type === 'text/plain') {
        extractedText = await processTextFile(file);
      } else {
        alert("Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.");
        setResumeFile(null);
        return;
      }

      if (extractedText) {
        setResumeText(extractedText);
      }
    }
  }, [processPdfFile, processDocxFile, processTextFile, setResumeFile, setResumeText]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleFileDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

const handleAnalyzeResume = async () => {
  if (!resumeText.trim() && !resumeFile) {
    return alert("Please paste your resume text or upload a file.");
  }
  setIsAnalyzingResume(true);
  try {
    const response = await analyzeResume({ text: resumeText }); // Changed 'resume' to 'text' to match backend
    setAiInsights((prev) => ({ ...prev, resumeScore: response.data.analysis })); // Access 'analysis'
  } catch (error) {
    console.error("Analyze Resume Error:", error);
    alert("Failed to analyze resume.");
  } finally {
    setIsAnalyzingResume(false);
  }
};
  const handleRecommendJobs = async () => {
    if (!skillsInput.trim()) return alert("Please enter your skills.");
    setIsRecommendingJobs(true);
    try {
      const response = await recommendJobs({ skills: skillsInput.split(",").map(s => s.trim()) });
      const recommendationsString = response?.data?.recommendations;

      if (typeof recommendationsString === 'string') {
        const recommendationsArray = recommendationsString.split('\n\n').filter(item => item.trim() !== '');
        setAiInsights((prev) => ({ ...prev, jobMatches: recommendationsArray }));
      } else if (Array.isArray(response?.data?.recommendations)) {
        setAiInsights((prev) => ({ ...prev, jobMatches: response.data.recommendations }));
      } else {
        console.warn("Received unexpected job recommendations format:", recommendationsString);
        setAiInsights((prev) => ({ ...prev, jobMatches: [] }));
        alert("Failed to process job recommendations.");
      }
    } catch (error) {
      console.error("Recommend Jobs Error:", error);
      alert("Failed to recommend jobs.");
    } finally {
      setIsRecommendingJobs(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        {userType === "candidate" ? "Candidate Profile" : "Employer Profile"}
      </h1>

      <div className="p-4 bg-blue-50 rounded-xl flex items-center justify-between shadow-inner">
        {isLoggedIn ? (
          <h2 className="text-lg text-gray-700 font-medium">
            Hi <span className="font-bold text-blue-600">{userName}</span>!
          </h2>
        ) : (
          <h2 className="text-lg text-gray-700 font-medium">Welcome!</h2>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl shadow-inner">
          <TabButton value="overview" label="Overview" icon={<UserCircle className="h-4 w-4 mr-1" />} activeTab={activeTab} />
          <TabButton value="ai" label="AI Insights" icon={<BrainCircuit className="h-4 w-4 mr-1" />} activeTab={activeTab} />
          <TabButton value="actions" label="Quick Actions" icon={<Zap className="h-4 w-4 mr-1" />} activeTab={activeTab} />
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4">
            <CandidateProfileHeader
              name={userName}
              title={userType === "candidate" ? "Frontend Developer" : "Employer Representative"}
              completion={0}
              avatarImage={avatarImage}
              handleAvatarChange={handleAvatarChange}
            />
            <EditableSectionCard title="Basic Information" fields={["Full Name", "Email", "Phone", "Location"]} />
            <EditableSectionCard title="Professional Summary" fields={["Short Bio"]} />
            <EditableSectionCard title="Work Experience" fields={["Company", "Job Title", "Duration"]} />
            <EditableSectionCard title="Skills" fields={["Technical Skills", "Soft Skills"]} />
            <EditableSectionCard title="Education" fields={["Degree", "University"]} />
            <EditableSectionCard title="Certifications & Projects" fields={["Certifications", "Projects"]} />
            <EditableSectionCard title="Preferences" fields={["Preferred Job Type", "Notice Period"]} />
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-700">AI Powered Insights</h3>

              <div className="mb-4">
                <label htmlFor="resumeText" className="block text-gray-700 text-sm font-bold mb-2">
                  Paste Your Resume:
                </label>
                <textarea
                  id="resumeText"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="5"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <p className="text-gray-500 text-xs mt-1">Or upload your resume:</p>
                <div
                  className="border-2 border-dashed rounded-md p-4 mt-2 cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={handleFileDrop}
                >
                  <label htmlFor="resumeFile" className="cursor-pointer">
                    <span className="text-blue-500">Drag and drop your files here</span> or <span className="underline">browse</span>
                    <input
                      type="file"
                      id="resumeFile"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <Button onClick={handleAnalyzeResume} className="mt-2" disabled={isAnalyzingResume}>
                  {isAnalyzingResume ? "Analyzing..." : "Analyze Resume"}
                </Button>
                {aiInsights.resumeScore && typeof aiInsights.resumeScore === 'object' && aiInsights.resumeScore !== null && (
                  <div className="mt-4 text-gray-700">
                    <strong className="block mb-2">Resume Analysis:</strong>
                    <ul className="list-disc list-inside">
                      {Object.entries(aiInsights.resumeScore).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiInsights.resumeScore && typeof aiInsights.resumeScore === 'string' && (
                  <div className="mt-4 text-gray-700">
                    <strong className="block mb-2">Resume Analysis:</strong>
                    <p>{aiInsights.resumeScore.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="skillsInput" className="block text-gray-700 text-sm font-bold mb-2">
                  Enter Your Skills (comma-separated):
                </label>
                <Input
                  type="text"
                  id="skillsInput"
                  placeholder="e.g., React, Node.js, Communication"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
                <Button onClick={handleRecommendJobs} variant="secondary" className="mt-2" disabled={isRecommendingJobs}>
                  {isRecommendingJobs ? "Recommending..." : "Recommend Jobs"}
                </Button>
                {aiInsights.jobMatches.length > 0 && (
                  <div className="mt-2 text-gray-700">
                    <p className="font-semibold">Job Recommendations:</p>
                    <ul className="list-disc list-inside">
                      {aiInsights.jobMatches.map((job, index) => (
                        <li key={index}>{job}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-700">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {userType === "candidate" ? (
                  <>
                    <Button variant="outline">Upload Resume</Button> {/* Consider triggering file input click */}
                    <Button variant="outline">View Applied Jobs</Button>
                    <Button variant="outline">Saved Jobs</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline">Post New Job</Button>
                    <Button variant="outline">View Applications</Button>
                    <Button variant="outline">Analytics Dashboard</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable components (CandidateProfileHeader, EditableSectionCard, TabButton) remain the same
function CandidateProfileHeader({ name, title, completion, avatarImage, handleAvatarChange }) {
  return (
    <Card className="shadow-md rounded-2xl p-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="relative group">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarImage} alt="Profile" />
          <AvatarFallback>{name ? name[0] : "U"}</AvatarFallback>
        </Avatar>
        <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer border group-hover:scale-110 transition-transform">
          <Camera className="h-4 w-4 text-gray-600" />
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800">Hi {name}!</h2>
        <p className="text-gray-600">{title}</p>
        <Progress value={completion} className="h-2 mt-2 rounded-full" />
        <p className="text-xs text-gray-500 mt-1">{completion}% Complete</p>
      </div>
      <Button variant="secondary">Complete Profile</Button>
    </Card>
  );
}

function EditableSectionCard({ title, fields }) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(Object.fromEntries(fields.map(f => [f, ""])));

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-md rounded-xl border hover:shadow-lg transition-shadow">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-700">{title}</h4>
          <Button size="icon" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
            <Edit className={`h-4 w-4 ${isEditing ? "text-blue-600" : "text-gray-500"}`} />
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
          {fields.map((field, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {isEditing ? (
                <Input
                  value={values[field]}
                  placeholder={field}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="h-7 text-sm"
                />
              ) : (
                <span className="hover:text-blue-600 transition">{values[field] || field}</span>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TabButton({ value, label, icon, activeTab }) {
  const isActive = activeTab === value;
  return (
    <TabsTrigger value={value} className="relative flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
      {icon} {label}
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 h-[3px] w-3/4 bg-blue-500 rounded-full"
        />
      )}
    </TabsTrigger>
  );
}
