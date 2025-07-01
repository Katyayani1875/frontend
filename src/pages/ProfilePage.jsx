import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BrainCircuit, Zap, CheckCircle, Edit, Camera, FileText, Share2, Plus, Briefcase, GraduationCap, Star, Lightbulb, Bookmark, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import mammoth from 'mammoth';
import { analyzeResume, recommendJobs } from "../api/aiApi";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const ProfileSectionCard = ({ title, icon, children, onEdit }) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <Button size="icon" variant="ghost" className="text-slate-500 hover:text-indigo-600" onClick={onEdit}>
          <Edit className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="text-slate-400 mt-0.5">{icon}</div>
    <div>
      <p className="font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-slate-700 dark:text-slate-200">{value || 'Not provided'}</p>
    </div>
  </div>
);

const TabButton = ({ value, label, icon, activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors rounded-lg ${
        isActive 
          ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-md' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'
      }`}
    >
      {icon}
      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default function ProfilePage({ userType, isLoggedIn, userName }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState({
    name: userName || "Alex Doe",
    title: userType === "candidate" ? "Senior Frontend Developer" : "Employer Representative",
    bio: "Creative Frontend Developer with 5+ years of experience in building beautiful and responsive web applications.",
    phone: "+1 123-456-7890",
    email: "alex.doe@example.com",
    location: "San Francisco, CA",
    experience: [],
    education: [],
    skills: [],
    avatar: "https://i.pravatar.cc/150?img=5",
    completeness: 65
  });

  const [aiInsights, setAiInsights] = useState({
    resumeScore: null,
    jobMatches: [],
  });
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
  }, [processPdfFile, processDocxFile, processTextFile]);

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
      const response = await analyzeResume({ text: resumeText });
      setAiInsights((prev) => ({ ...prev, resumeScore: response.data.analysis }));
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
      setProfileData(p => ({ ...p, avatar: URL.createObjectURL(file) }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          initial="hidden" animate="visible" variants={containerVariants}
        >
          {/* Left Sticky Sidebar */}
          <motion.div className="lg:col-span-4 lg:sticky lg:top-12" variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 text-center">
              <div className="relative w-32 h-32 mx-auto">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-700 shadow-lg">
                  <AvatarImage src={profileData.avatar} alt={profileData.name} />
                  <AvatarFallback>{profileData.name?.[0]}</AvatarFallback>
                </Avatar>
                <label htmlFor="avatarUpload" className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-2 cursor-pointer text-white hover:bg-indigo-700 transition-all transform hover:scale-110">
                  <Camera className="h-5 w-5" />
                  <input id="avatarUpload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{profileData.name}</h2>
              <p className="text-indigo-500 dark:text-indigo-400 font-medium">{profileData.title}</p>
              
              <div className="mt-6 text-left">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  <span>Profile Completeness</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-300">{profileData.completeness}%</span>
                </div>
                <Progress value={profileData.completeness} className="h-2" />
                <p className="text-xs text-slate-400 mt-1">Complete your profile to get better job matches.</p>
              </div>
              
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <FileText className="w-4 h-4 mr-2"/> Download Resume
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2"/> Share Profile
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
            <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2 flex items-center space-x-2 shadow-inner">
              <TabButton 
                value="overview" 
                label="Overview" 
                icon={<User size={16}/>} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <TabButton 
                value="ai" 
                label="AI Insights" 
                icon={<BrainCircuit size={16}/>} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <TabButton 
                value="actions" 
                label="Quick Actions" 
                icon={<Zap size={16}/>} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === 'overview' && (
                  <>
                    <ProfileSectionCard 
                      title="Professional Summary" 
                      icon={<User className="text-indigo-500"/>} 
                      onEdit={() => alert('Editing Summary!')}
                    >
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{profileData.bio}</p>
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Basic Information" 
                      icon={<User className="text-indigo-500"/>} 
                      onEdit={() => alert('Editing Basic Info!')}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow icon={<User size={16}/>} label="Full Name" value={profileData.name} />
                        <InfoRow icon={<Mail size={16}/>} label="Email" value={profileData.email} />
                        <InfoRow icon={<Phone size={16}/>} label="Phone" value={profileData.phone} />
                        <InfoRow icon={<MapPin size={16}/>} label="Location" value={profileData.location} />
                      </div>
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Work Experience" 
                      icon={<Briefcase className="text-indigo-500"/>} 
                      onEdit={() => alert('Editing Experience!')}
                    >
                      {profileData.experience.length > 0 ? (
                        profileData.experience.map((exp, index) => (
                          <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 last:border-0">
                            <h4 className="font-bold text-slate-800 dark:text-white">{exp.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300">{exp.company} • {exp.duration}</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{exp.description}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <p className="text-slate-500">No work experience added yet.</p>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2"/> Add Experience
                          </Button>
                        </>
                      )}
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Education" 
                      icon={<GraduationCap className="text-indigo-500"/>} 
                      onEdit={() => alert('Editing Education!')}
                    >
                      {profileData.education.length > 0 ? (
                        profileData.education.map((edu, index) => (
                          <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 last:border-0">
                            <h4 className="font-bold text-slate-800 dark:text-white">{edu.degree}</h4>
                            <p className="text-slate-600 dark:text-slate-300">{edu.university} • {edu.year}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <p className="text-slate-500">No education added yet.</p>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2"/> Add Education
                          </Button>
                        </>
                      )}
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Skills" 
                      icon={<Star className="text-indigo-500"/>} 
                      onEdit={() => alert('Editing Skills!')}
                    >
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Figma'].map(skill => (
                          <span key={skill} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </ProfileSectionCard>
                  </>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Analyze Your Resume</h3>
                      
                      <div className="mb-4">
                        <label htmlFor="resumeText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Paste Your Resume:
                        </label>
                        <textarea
                          id="resumeText"
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                          rows={5}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Or upload your resume:</p>
                        <div
                          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 mt-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleFileDrop}
                        >
                          <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center justify-center">
                            <FileText className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              <span className="text-indigo-600 dark:text-indigo-400">Drag and drop your file here</span> or <span className="underline">browse</span>
                            </span>
                            <input
                              type="file"
                              id="resumeFile"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleAnalyzeResume} 
                        className="w-full" 
                        disabled={isAnalyzingResume}
                      >
                        {isAnalyzingResume ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </span>
                        ) : (
                          "Analyze Resume"
                        )}
                      </Button>
                      
                      {aiInsights.resumeScore && (
                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                          <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Resume Analysis Results</h4>
                          {typeof aiInsights.resumeScore === 'object' ? (
                            <ul className="space-y-3">
                              {Object.entries(aiInsights.resumeScore).map(([key, value]) => (
                                <li key={key}>
                                  <p className="font-medium text-slate-700 dark:text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                                  <p className="text-slate-600 dark:text-slate-400">
                                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                              {aiInsights.resumeScore}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">AI Job Recommendations</h3>
                      
                      <div className="mb-4">
                        <label htmlFor="skillsInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Enter Your Skills (comma-separated):
                        </label>
                        <Input
                          type="text"
                          id="skillsInput"
                          placeholder="e.g., React, Node.js, Communication"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleRecommendJobs} 
                        variant="secondary" 
                        className="w-full" 
                        disabled={isRecommendingJobs}
                      >
                        {isRecommendingJobs ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Finding Recommendations...
                          </span>
                        ) : (
                          "Get Job Recommendations"
                        )}
                      </Button>
                      
                      {aiInsights.jobMatches.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-3">Recommended Jobs</h4>
                          <ul className="space-y-4">
                            {aiInsights.jobMatches.map((job, index) => (
                              <li key={index} className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{job}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="justify-start p-4 h-auto text-left"
                        onClick={() => document.getElementById('resumeFile')?.click()}
                      >
                        <FileText className="w-5 h-5 mr-3 text-indigo-500"/>
                        <div>
                          <p className="font-semibold">Update Resume</p>
                          <p className="text-xs text-slate-500">Upload a new version</p>
                        </div>
                      </Button>
                      
                      <Button size="lg" variant="outline" className="justify-start p-4 h-auto text-left">
                        <Briefcase className="w-5 h-5 mr-3 text-indigo-500"/>
                        <div>
                          <p className="font-semibold">My Applications</p>
                          <p className="text-xs text-slate-500">Track your job applications</p>
                        </div>
                      </Button>
                      
                      <Button size="lg" variant="outline" className="justify-start p-4 h-auto text-left">
                        <Bookmark className="w-5 h-5 mr-3 text-indigo-500"/>
                        <div>
                          <p className="font-semibold">Saved Jobs</p>
                          <p className="text-xs text-slate-500">View your bookmarked positions</p>
                        </div>
                      </Button>
                      
                      <Button size="lg" variant="outline" className="justify-start p-4 h-auto text-left">
                        <Lightbulb className="w-5 h-5 mr-3 text-indigo-500"/>
                        <div>
                          <p className="font-semibold">Job Alerts</p>
                          <p className="text-xs text-slate-500">Manage your notifications</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
// import React, { useState, useEffect, useCallback } from "react";
// import { Card, CardContent } from "../components/ui/card";
// import { Button } from "../components/ui/Button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Input } from "../components/ui/Input";
// import { motion } from "framer-motion";
// import { Progress } from "../components/ui/progress";
// import {
//   UserCircle,
//   BrainCircuit,
//   Zap,
//   CheckCircle,
//   Edit,
//   Camera,
// } from "lucide-react";
// import * as pdfjsLib from 'pdfjs-dist';
// import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
// import mammoth from 'mammoth';

// // Import ALL AI routes from api/aiApi.js
// import {
//   analyzeResume,
//   recommendJobs,
// } from "../api/aiApi";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// export default function ProfilePage({ userType, isLoggedIn, userName }) {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [aiInsights, setAiInsights] = useState({
//     resumeScore: null,
//     jobMatches: [],
//   });
//   const [avatarImage, setAvatarImage] = useState("https://i.pravatar.cc/150?img=5");
//   const [resumeText, setResumeText] = useState("");
//   const [resumeFile, setResumeFile] = useState(null);
//   const [skillsInput, setSkillsInput] = useState("");
//   const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
//   const [isRecommendingJobs, setIsRecommendingJobs] = useState(false);
//   const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

//   useEffect(() => {
//     // Optionally re-validate token here if needed
//   }, [authToken, isLoggedIn]);

//   const processPdfFile = useCallback(async (file) => {
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//       let text = '';
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         text += content.items.map(s => s.str).join(' ') + '\n';
//       }
//       return text;
//     } catch (error) {
//       console.error("Error parsing PDF:", error);
//       alert("Failed to parse the PDF file.");
//       return null;
//     }
//   }, []);

//   const processDocxFile = useCallback(async (file) => {
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const result = await mammoth.convertToText({ arrayBuffer });
//       return result.value;
//     } catch (error) {
//       console.error("Error parsing DOCX:", error);
//       alert("Failed to parse the DOCX file.");
//       return null;
//     }
//   }, []);

//   const processTextFile = useCallback(async (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         resolve(event.target.result);
//       };
//       reader.onerror = (error) => {
//         console.error("Error reading text file:", error);
//         alert("Failed to read the text file.");
//         reject(null);
//       };
//       reader.readAsText(file);
//     });
//   }, []);

//   const handleFileChange = useCallback(async (file) => {
//     setResumeFile(file);
//     setResumeText("");

//     if (file) {
//       let extractedText = null;
//       if (file.type === 'application/pdf') {
//         extractedText = await processPdfFile(file);
//       } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
//         extractedText = await processDocxFile(file);
//       } else if (file.type === 'text/plain') {
//         extractedText = await processTextFile(file);
//       } else {
//         alert("Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files.");
//         setResumeFile(null);
//         return;
//       }

//       if (extractedText) {
//         setResumeText(extractedText);
//       }
//     }
//   }, [processPdfFile, processDocxFile, processTextFile, setResumeFile, setResumeText]);

//   const handleFileUpload = useCallback((e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleFileChange(file);
//     }
//   }, [handleFileChange]);

//   const handleFileDrop = useCallback((e) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0) {
//       handleFileChange(files[0]);
//     }
//   }, [handleFileChange]);

// const handleAnalyzeResume = async () => {
//   if (!resumeText.trim() && !resumeFile) {
//     return alert("Please paste your resume text or upload a file.");
//   }
//   setIsAnalyzingResume(true);
//   try {
//     const response = await analyzeResume({ text: resumeText }); // Changed 'resume' to 'text' to match backend
//     setAiInsights((prev) => ({ ...prev, resumeScore: response.data.analysis })); // Access 'analysis'
//   } catch (error) {
//     console.error("Analyze Resume Error:", error);
//     alert("Failed to analyze resume.");
//   } finally {
//     setIsAnalyzingResume(false);
//   }
// };
//   const handleRecommendJobs = async () => {
//     if (!skillsInput.trim()) return alert("Please enter your skills.");
//     setIsRecommendingJobs(true);
//     try {
//       const response = await recommendJobs({ skills: skillsInput.split(",").map(s => s.trim()) });
//       const recommendationsString = response?.data?.recommendations;

//       if (typeof recommendationsString === 'string') {
//         const recommendationsArray = recommendationsString.split('\n\n').filter(item => item.trim() !== '');
//         setAiInsights((prev) => ({ ...prev, jobMatches: recommendationsArray }));
//       } else if (Array.isArray(response?.data?.recommendations)) {
//         setAiInsights((prev) => ({ ...prev, jobMatches: response.data.recommendations }));
//       } else {
//         console.warn("Received unexpected job recommendations format:", recommendationsString);
//         setAiInsights((prev) => ({ ...prev, jobMatches: [] }));
//         alert("Failed to process job recommendations.");
//       }
//     } catch (error) {
//       console.error("Recommend Jobs Error:", error);
//       alert("Failed to recommend jobs.");
//     } finally {
//       setIsRecommendingJobs(false);
//     }
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-semibold text-gray-800 mb-4">
//         {userType === "candidate" ? "Candidate Profile" : "Employer Profile"}
//       </h1>

//       <div className="p-4 bg-blue-50 rounded-xl flex items-center justify-between shadow-inner">
//         {isLoggedIn ? (
//           <h2 className="text-lg text-gray-700 font-medium">
//             Hi <span className="font-bold text-blue-600">{userName}</span>!
//           </h2>
//         ) : (
//           <h2 className="text-lg text-gray-700 font-medium">Welcome!</h2>
//         )}
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl shadow-inner">
//           <TabButton value="overview" label="Overview" icon={<UserCircle className="h-4 w-4 mr-1" />} activeTab={activeTab} />
//           <TabButton value="ai" label="AI Insights" icon={<BrainCircuit className="h-4 w-4 mr-1" />} activeTab={activeTab} />
//           <TabButton value="actions" label="Quick Actions" icon={<Zap className="h-4 w-4 mr-1" />} activeTab={activeTab} />
//         </TabsList>

//         <TabsContent value="overview">
//           <div className="space-y-4">
//             <CandidateProfileHeader
//               name={userName}
//               title={userType === "candidate" ? "Frontend Developer" : "Employer Representative"}
//               completion={0}
//               avatarImage={avatarImage}
//               handleAvatarChange={handleAvatarChange}
//             />
//             <EditableSectionCard title="Basic Information" fields={["Full Name", "Email", "Phone", "Location"]} />
//             <EditableSectionCard title="Professional Summary" fields={["Short Bio"]} />
//             <EditableSectionCard title="Work Experience" fields={["Company", "Job Title", "Duration"]} />
//             <EditableSectionCard title="Skills" fields={["Technical Skills", "Soft Skills"]} />
//             <EditableSectionCard title="Education" fields={["Degree", "University"]} />
//             <EditableSectionCard title="Certifications & Projects" fields={["Certifications", "Projects"]} />
//             <EditableSectionCard title="Preferences" fields={["Preferred Job Type", "Notice Period"]} />
//           </div>
//         </TabsContent>

//         <TabsContent value="ai">
//           <Card className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg">
//             <CardContent className="p-6 space-y-4">
//               <h3 className="text-lg font-bold text-gray-700">AI Powered Insights</h3>

//               <div className="mb-4">
//                 <label htmlFor="resumeText" className="block text-gray-700 text-sm font-bold mb-2">
//                   Paste Your Resume:
//                 </label>
//                 <textarea
//                   id="resumeText"
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   rows="5"
//                   value={resumeText}
//                   onChange={(e) => setResumeText(e.target.value)}
//                 />
//                 <p className="text-gray-500 text-xs mt-1">Or upload your resume:</p>
//                 <div
//                   className="border-2 border-dashed rounded-md p-4 mt-2 cursor-pointer"
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                   }}
//                   onDrop={handleFileDrop}
//                 >
//                   <label htmlFor="resumeFile" className="cursor-pointer">
//                     <span className="text-blue-500">Drag and drop your files here</span> or <span className="underline">browse</span>
//                     <input
//                       type="file"
//                       id="resumeFile"
//                       className="hidden"
//                       accept=".pdf,.doc,.docx,.txt"
//                       onChange={handleFileUpload}
//                     />
//                   </label>
//                 </div>
//                 <Button onClick={handleAnalyzeResume} className="mt-2" disabled={isAnalyzingResume}>
//                   {isAnalyzingResume ? "Analyzing..." : "Analyze Resume"}
//                 </Button>
//                 {aiInsights.resumeScore && typeof aiInsights.resumeScore === 'object' && aiInsights.resumeScore !== null && (
//                   <div className="mt-4 text-gray-700">
//                     <strong className="block mb-2">Resume Analysis:</strong>
//                     <ul className="list-disc list-inside">
//                       {Object.entries(aiInsights.resumeScore).map(([key, value]) => (
//                         <li key={key}>
//                           <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//                 {aiInsights.resumeScore && typeof aiInsights.resumeScore === 'string' && (
//                   <div className="mt-4 text-gray-700">
//                     <strong className="block mb-2">Resume Analysis:</strong>
//                     <p>{aiInsights.resumeScore.split('\n').map((line, index) => (
//                       <React.Fragment key={index}>
//                         {line}
//                         <br />
//                       </React.Fragment>
//                     ))}</p>
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="skillsInput" className="block text-gray-700 text-sm font-bold mb-2">
//                   Enter Your Skills (comma-separated):
//                 </label>
//                 <Input
//                   type="text"
//                   id="skillsInput"
//                   placeholder="e.g., React, Node.js, Communication"
//                   value={skillsInput}
//                   onChange={(e) => setSkillsInput(e.target.value)}
//                 />
//                 <Button onClick={handleRecommendJobs} variant="secondary" className="mt-2" disabled={isRecommendingJobs}>
//                   {isRecommendingJobs ? "Recommending..." : "Recommend Jobs"}
//                 </Button>
//                 {aiInsights.jobMatches.length > 0 && (
//                   <div className="mt-2 text-gray-700">
//                     <p className="font-semibold">Job Recommendations:</p>
//                     <ul className="list-disc list-inside">
//                       {aiInsights.jobMatches.map((job, index) => (
//                         <li key={index}>{job}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="actions">
//           <Card className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg">
//             <CardContent className="p-6 space-y-4">
//               <h3 className="text-lg font-bold text-gray-700">Quick Actions</h3>
//               <div className="flex flex-wrap gap-3">
//                 {userType === "candidate" ? (
//                   <>
//                     <Button variant="outline">Upload Resume</Button> {/* Consider triggering file input click */}
//                     <Button variant="outline">View Applied Jobs</Button>
//                     <Button variant="outline">Saved Jobs</Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button variant="outline">Post New Job</Button>
//                     <Button variant="outline">View Applications</Button>
//                     <Button variant="outline">Analytics Dashboard</Button>
//                   </>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// // Reusable components (CandidateProfileHeader, EditableSectionCard, TabButton) remain the same
// function CandidateProfileHeader({ name, title, completion, avatarImage, handleAvatarChange }) {
//   return (
//     <Card className="shadow-md rounded-2xl p-4 flex items-center gap-4 bg-gradient-to-r from-blue-50 via-white to-blue-50">
//       <div className="relative group">
//         <Avatar className="h-16 w-16">
//           <AvatarImage src={avatarImage} alt="Profile" />
//           <AvatarFallback>{name ? name[0] : "U"}</AvatarFallback>
//         </Avatar>
//         <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer border group-hover:scale-110 transition-transform">
//           <Camera className="h-4 w-4 text-gray-600" />
//           <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
//         </label>
//       </div>
//       <div className="flex-1">
//         <h2 className="text-xl font-bold text-gray-800">Hi {name}!</h2>
//         <p className="text-gray-600">{title}</p>
//         <Progress value={completion} className="h-2 mt-2 rounded-full" />
//         <p className="text-xs text-gray-500 mt-1">{completion}% Complete</p>
//       </div>
//       <Button variant="secondary">Complete Profile</Button>
//     </Card>
//   );
// }

// function EditableSectionCard({ title, fields }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [values, setValues] = useState(Object.fromEntries(fields.map(f => [f, ""])));

//   const handleChange = (field, value) => {
//     setValues((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <Card className="shadow-md rounded-xl border hover:shadow-lg transition-shadow">
//       <CardContent className="p-4 space-y-2">
//         <div className="flex items-center justify-between">
//           <h4 className="text-md font-semibold text-gray-700">{title}</h4>
//           <Button size="icon" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
//             <Edit className={`h-4 w-4 ${isEditing ? "text-blue-600" : "text-gray-500"}`} />
//           </Button>
//         </div>
//         <ul className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
//           {fields.map((field, idx) => (
//             <li key={idx} className="flex items-center gap-1">
//               <CheckCircle className="h-3 w-3 text-green-500" />
//               {isEditing ? (
//                 <Input
//                   value={values[field]}
//                   placeholder={field}
//                   onChange={(e) => handleChange(field, e.target.value)}
//                   className="h-7 text-sm"
//                 />
//               ) : (
//                 <span className="hover:text-blue-600 transition">{values[field] || field}</span>
//               )}
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   );
// }

// function TabButton({ value, label, icon, activeTab }) {
//   const isActive = activeTab === value;
//   return (
//     <TabsTrigger value={value} className="relative flex items-center justify-center gap-1 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
//       {icon} {label}
//       {isActive && (
//         <motion.div
//           layoutId="underline"
//           className="absolute bottom-0 h-[3px] w-3/4 bg-blue-500 rounded-full"
//         />
//       )}
//     </TabsTrigger>
//   );
// }
