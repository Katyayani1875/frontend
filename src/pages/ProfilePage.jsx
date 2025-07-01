import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BrainCircuit, Zap, CheckCircle, Edit, Camera, FileText, Share2, Plus, Briefcase, GraduationCap, Star, Lightbulb, Bookmark, Mail, Phone, MapPin, X } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import mammoth from 'mammoth';
import { analyzeResume, recommendJobs } from "../api/aiApi";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Enhanced ProfileSectionCard with better animations
const ProfileSectionCard = ({ title, icon, children, onEdit }) => (
  <motion.div 
    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
    whileHover={{ scale: 1.005 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {React.cloneElement(icon, { className: "text-indigo-500 dark:text-indigo-400" })}
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          onClick={onEdit}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  </motion.div>
);

// Enhanced InfoRow with better spacing
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 text-sm">
    <div className="text-slate-400 dark:text-slate-500 mt-0.5">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div>
      <p className="font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-slate-700 dark:text-slate-200 mt-0.5">{value || 'Not provided'}</p>
    </div>
  </div>
);

// Enhanced TabButton with better animations
const TabButton = ({ value, label, icon, activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors rounded-lg z-10"
    >
      {isActive && (
        <motion.div
          layoutId="activeProfileTab"
          className="absolute inset-0 bg-white dark:bg-slate-800 shadow-md rounded-lg"
          style={{ borderRadius: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      )}
      <span className="relative z-20 flex items-center gap-2">
        {React.cloneElement(icon, { 
          size: 16,
          className: isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
        })}
        <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}>
          {label}
        </span>
      </span>
    </button>
  );
};

// Enhanced EditModal with form validation
const EditModal = ({ section, profileData, onSave, onClose }) => {
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(profileData);
    setErrors({});
  }, [profileData, section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (section?.id === 'basicInfo') {
      if (!formData.name?.trim()) newErrors.name = 'Name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    }
    
    if (section?.id === 'summary' && !formData.bio?.trim()) {
      newErrors.bio = 'Summary is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getFormContent = () => {
    switch (section?.id) {
      case 'basicInfo':
        return (
          <div className="space-y-4">
            <div>
              <Input 
                label="Full Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                error={errors.name}
              />
            </div>
            <div>
              <Input 
                label="Professional Title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Input 
                label="Email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <div>
              <Input 
                label="Phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Input 
                label="Location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 'summary':
        return (
          <div>
            <Textarea 
              label="Professional Summary" 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              rows={6}
              error={errors.bio}
              className="min-h-[200px]"
            />
          </div>
        );
      default:
        return <p>No form available for this section.</p>;
    }
  };

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              {getFormContent()}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Figma'],
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
  const [editingSection, setEditingSection] = useState(null);

  // File processing functions remain the same
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

  const openEditModal = (id, title) => setEditingSection({ id, title });
  const closeModal = () => setEditingSection(null);
  const handleSave = (updatedData) => {
    setProfileData(updatedData);
    
    // Calculate new completeness score
    let completeness = 65; // base score
    if (updatedData.bio?.length > 50) completeness += 10;
    if (updatedData.skills?.length >= 3) completeness += 10;
    if (updatedData.experience?.length > 0) completeness += 10;
    if (updatedData.education?.length > 0) completeness += 5;
    
    setProfileData(prev => ({ ...prev, completeness: Math.min(100, completeness) }));
    closeModal();
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
      <EditModal 
        section={editingSection} 
        profileData={profileData} 
        onSave={handleSave} 
        onClose={closeModal} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          initial="hidden" 
          animate="visible" 
          variants={containerVariants}
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
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md">
                  <FileText className="w-4 h-4 mr-2" /> Download Resume
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" /> Share Profile
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
            <div className="relative bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 flex items-center space-x-2 shadow-inner border border-slate-200/50 dark:border-slate-700/50">
              <TabButton 
                value="overview" 
                label="Overview" 
                icon={<User size={16} />} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <TabButton 
                value="ai" 
                label="AI Insights" 
                icon={<BrainCircuit size={16} />} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
              <TabButton 
                value="actions" 
                label="Quick Actions" 
                icon={<Zap size={16} />} 
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
                      icon={<User className="text-indigo-500" />} 
                      onEdit={() => openEditModal('summary', 'Edit Professional Summary')}
                    >
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {profileData.bio || "No summary provided. Add a professional summary to highlight your experience and skills."}
                      </p>
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Basic Information" 
                      icon={<User className="text-indigo-500" />} 
                      onEdit={() => openEditModal('basicInfo', 'Edit Basic Information')}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow icon={<User size={16} />} label="Full Name" value={profileData.name} />
                        <InfoRow icon={<Mail size={16} />} label="Email" value={profileData.email} />
                        <InfoRow icon={<Phone size={16} />} label="Phone" value={profileData.phone} />
                        <InfoRow icon={<MapPin size={16} />} label="Location" value={profileData.location} />
                      </div>
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Work Experience" 
                      icon={<Briefcase className="text-indigo-500" />} 
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
                            <Plus className="w-4 h-4 mr-2" /> Add Experience
                          </Button>
                        </>
                      )}
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Education" 
                      icon={<GraduationCap className="text-indigo-500" />} 
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
                            <Plus className="w-4 h-4 mr-2" /> Add Education
                          </Button>
                        </>
                      )}
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Skills" 
                      icon={<Star className="text-indigo-500" />} 
                      onEdit={() => alert('Editing Skills!')}
                    >
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map(skill => (
                          <span 
                            key={skill} 
                            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </ProfileSectionCard>
                  </>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <ProfileSectionCard 
                      title="Resume Analysis" 
                      icon={<FileText className="text-indigo-500" />} 
                      onEdit={() => {}}
                    >
                      <div className="mb-4">
                        <label htmlFor="resumeText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Paste Your Resume:
                        </label>
                        <Textarea
                          id="resumeText"
                          className="w-full min-h-[200px]"
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste your resume text here..."
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Or upload your resume:</p>
                        <div
                          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 mt-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleFileDrop}
                        >
                          <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center justify-center">
                            <FileText className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-2" />
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
                        disabled={isAnalyzingResume || (!resumeText && !resumeFile)}
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
                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
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
                    </ProfileSectionCard>

                    <ProfileSectionCard 
                      title="Job Recommendations" 
                      icon={<Briefcase className="text-indigo-500" />} 
                      onEdit={() => {}}
                    >
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
                        disabled={isRecommendingJobs || !skillsInput.trim()}
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
                    </ProfileSectionCard>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-6">
                    <ProfileSectionCard 
                      title="Quick Actions" 
                      icon={<Zap className="text-indigo-500" />} 
                      onEdit={() => {}}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="justify-start p-4 h-auto text-left hover:bg-indigo-50 dark:hover:bg-slate-700"
                          onClick={() => document.getElementById('resumeFile')?.click()}
                        >
                          <FileText className="w-5 h-5 mr-3 text-indigo-500" />
                          <div>
                            <p className="font-semibold">Update Resume</p>
                            <p className="text-xs text-slate-500">Upload a new version</p>
                          </div>
                        </Button>
                        
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="justify-start p-4 h-auto text-left hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Briefcase className="w-5 h-5 mr-3 text-indigo-500" />
                          <div>
                            <p className="font-semibold">My Applications</p>
                            <p className="text-xs text-slate-500">Track your job applications</p>
                          </div>
                        </Button>
                        
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="justify-start p-4 h-auto text-left hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Bookmark className="w-5 h-5 mr-3 text-indigo-500" />
                          <div>
                            <p className="font-semibold">Saved Jobs</p>
                            <p className="text-xs text-slate-500">View your bookmarked positions</p>
                          </div>
                        </Button>
                        
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="justify-start p-4 h-auto text-left hover:bg-indigo-50 dark:hover:bg-slate-700"
                        >
                          <Lightbulb className="w-5 h-5 mr-3 text-indigo-500" />
                          <div>
                            <p className="font-semibold">Job Alerts</p>
                            <p className="text-xs text-slate-500">Manage your notifications</p>
                          </div>
                        </Button>
                      </div>
                    </ProfileSectionCard>
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