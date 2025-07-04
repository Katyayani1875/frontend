import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { generateCoverLetter } from '../../api/aiApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, User, Briefcase, FileText, Download, Copy, RefreshCw, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'react-hot-toast';

const STEPS = [
    { id: 1, name: 'Job Details', icon: <Briefcase size={18} /> },
    { id: 2, name: 'Your Profile', icon: <User size={18} /> },
    { id: 3, name: 'Generated Letter', icon: <FileText size={18} /> },
];

const GenerateCoverLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      resumeText: '',
      platform: '',
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.resumeText || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await generateCoverLetter(formData);
      setCoverLetter(response.data.coverLetter);
      setCurrentStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error generating cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(coverLetter, 180);
    doc.text(splitText, 15, 20);
    doc.save(`${formData.name}_${formData.companyName}_CoverLetter.pdf`);
  };

  const handleReset = () => {
    setFormData({ 
      jobTitle: '', 
      companyName: '', 
      jobDescription: '', 
      name: '', 
      email: '', 
      phone: '', 
      address: '', 
      resumeText: '',
      platform: ''
    });
    setCoverLetter('');
    setCurrentStep(1);
  };

  const livePreviewText = `
${formData.name || '[Your Name]'}
${formData.address || '[Your Address]'}
${formData.phone || '[Your Phone]'}
${formData.email || '[Your Email]'}

${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

Hiring Manager
${formData.companyName || '[Company Name]'}
[Company Address]

Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${formData.jobTitle || '[Job Title]'} position at ${formData.companyName || '[Company Name]'}, which I discovered on ${formData.platform || '[Platform]'}. 

${formData.resumeText ? `My background includes: ${formData.resumeText}` : '[Your key achievements and skills]'}

I welcome the opportunity to discuss how my experience aligns with your needs. Thank you for your time and consideration.

Sincerely,
${formData.name || '[Your Name]'}
`.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            AI-Powered Tool
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            AI Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Craft a professional cover letter in minutes with our intelligent AI assistant
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500'
                    }`}>
                      {currentStep > step.id ? <Check size={18} /> : step.icon}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      currentStep > step.id 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px]">
            {/* Form Section */}
            <div className="p-8 border-r border-gray-200 dark:border-gray-700">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tell us about the role
                      </h2>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Job Title*
                        </label>
                        <Input
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          placeholder="e.g. Senior Product Designer"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Name*
                        </label>
                        <Input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Google"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Where did you find this job?
                        </label>
                        <Input
                          name="platform"
                          value={formData.platform}
                          onChange={handleChange}
                          placeholder="e.g. LinkedIn, Company Website"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Job Description (Optional)
                        </label>
                        <Textarea
                          name="jobDescription"
                          value={formData.jobDescription}
                          onChange={handleChange}
                          placeholder="Paste the job description for better results"
                          rows={6}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tell us about you
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name*
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email*
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone
                          </label>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address
                          </label>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Key Achievements & Skills*
                        </label>
                        <Textarea
                          name="resumeText"
                          value={formData.resumeText}
                          onChange={handleChange}
                          placeholder="Describe your most relevant experience for this role"
                          rows={6}
                          className="w-full"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Highlight 2-3 key accomplishments that align with this job
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      {loading ? (
                        <>
                          <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Crafting your perfect cover letter
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            Our AI is analyzing your profile and the job requirements...
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                            <Check className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Your cover letter is ready!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Review it on the right and download or copy it.
                          </p>
                          <div className="flex gap-3">
                            <Button 
                              onClick={handleCopy}
                              variant="outline"
                              className="gap-2"
                            >
                              <Copy size={16} />
                              {copied ? 'Copied!' : 'Copy'}
                            </Button>
                            <Button 
                              onClick={handleDownloadPdf}
                              className="gap-2"
                            >
                              <Download size={16} />
                              Download PDF
                            </Button>
                          </div>
                          <Button 
                            onClick={handleReset}
                            variant="ghost"
                            className="mt-4 gap-2"
                          >
                            <RefreshCw size={16} />
                            Create Another
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Section */}
            <div className="hidden lg:block bg-gray-50 dark:bg-gray-700/20 p-8 overflow-auto">
              <div className="sticky top-0 bg-gray-50 dark:bg-gray-700/20 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStep === 3 && !loading ? 'Final version' : 'Preview based on your inputs'}
                </p>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200">
                  {currentStep === 3 && !loading ? coverLetter : livePreviewText}
                </pre>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <div>
              {currentStep > 1 && currentStep < 3 && (
                <Button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft size={16} />
                  Back
                </Button>
              )}
            </div>
            <div>
              {currentStep === 1 && (
                <Button 
                  onClick={() => setCurrentStep(2)}
                  className="gap-2"
                >
                  Continue
                  <ChevronRight size={16} />
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="gap-2"
                >
                  <Sparkles size={16} />
                  Generate Cover Letter
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCoverLetter;
// import React, { useState } from 'react';
// import jsPDF from 'jspdf';
// import { generateCoverLetter } from '../../api/aiApi'; 

// const GenerateCoverLetter = () => {
//   const [jobTitle, setJobTitle] = useState('');
//   const [companyName, setCompanyName] = useState('');
//   const [resumeText, setResumeText] = useState('');
//   const [jobDescription, setJobDescription] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [date, setDate] = useState('');
//   const [address, setAddress] = useState('');
//   const [coverLetter, setCoverLetter] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleGenerate = async () => {
//     if (!jobTitle || !companyName || !resumeText || !name || !email || !phone || !address) {
//       setError('Please fill in all required fields.');
//       return;
//     }

//     setError('');
//     setLoading(true);
//     try {
//       const response = await generateCoverLetter({
//         jobTitle,
//         companyName,
//         resumeText,
//         jobDescription,
//         name,
//         email,
//         phone,
//         date,
//         address,
//       });
//       setCoverLetter(response.data.coverLetter);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error generating cover letter. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async () => {
//     if (coverLetter) {
//       try {
//         await navigator.clipboard.writeText(coverLetter);
//         alert('Cover letter copied to clipboard!');
//       } catch (err) {
//         alert('Failed to copy cover letter.');
//       }
//     }
//   };

//   const handleDownloadPdf = () => {
//     if (coverLetter) {
//       const doc = new jsPDF();
//       doc.text(coverLetter, 10, 10);
//       doc.save(`CoverLetter_${companyName}_${jobTitle}.pdf`);
//     }
//   };

//   const handleReset = () => {
//     setJobTitle('');
//     setCompanyName('');
//     setResumeText('');
//     setJobDescription('');
//     setName('');
//     setEmail('');
//     setPhone('');
//     setAddress('');
//     setDate('');
//     setCoverLetter('');
//     setError('');
//   };

//   return (
//     <div className="bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen py-16 px-6 sm:px-8 lg:px-12 flex items-center justify-center">
//       <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-r from-purple-400 to-indigo-500 py-10 px-8 text-white text-center">
//           <h2 className="text-4xl font-semibold tracking-tight mb-2">
//             Craft Your Winning Cover Letter
//           </h2>
//           <p className="text-lg opacity-80">
//             Let our AI help you make the best first impression.
//           </p>
//         </div>
//         <div className="p-8 space-y-6">
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//               <strong className="font-bold">Oops!</strong>
//               <span className="block sm:inline">{error}</span>
//             </div>
//           )}
//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Your Name:
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="Your Full Name"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Your Email:
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="you@example.com"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Your Phone:
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="+91 1234567890"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="date" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Date:
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Your Address:
//                 </label>
//                 <input
//                   type="text"
//                   id="address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="Your Current Address"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Job Title:
//                 </label>
//                 <input
//                   type="text"
//                   id="jobTitle"
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="e.g., Software Engineer"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="companyName" className="block text-gray-700 text-sm font-semibold mb-2">
//                   Company Name:
//                 </label>
//                 <input
//                   type="text"
//                   id="companyName"
//                   value={companyName}
//                   onChange={(e) => setCompanyName(e.target.value)}
//                   className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                   placeholder="e.g., Google"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="resumeText" className="block text-gray-700 text-sm font-semibold mb-2">
//                 Key Achievements & Skills:
//                 <span className="text-gray-500 text-xs italic">(Focus on relevant skills and quantifiable achievements)</span>
//               </label>
//               <textarea
//                 id="resumeText"
//                 value={resumeText}
//                 onChange={(e) => setResumeText(e.target.value)}
//                 rows={4}
//                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                 placeholder="Highlight your most relevant experience and skills for this role."
//               />
//             </div>
//             <div>
//               <label htmlFor="jobDescription" className="block text-gray-700 text-sm font-semibold mb-2">
//                 Job Description (Optional):
//                 <span className="text-gray-500 text-xs italic">(Paste the job description to tailor your letter even more)</span>
//               </label>
//               <textarea
//                 id="jobDescription"
//                 value={jobDescription}
//                 onChange={(e) => setJobDescription(e.target.value)}
//                 rows={3}
//                 className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
//                 placeholder="Paste the job description here."
//               />
//             </div>
//           </div>
//           <div className="flex justify-center space-x-4 mt-8">
//             <button
//               onClick={handleGenerate}
//               disabled={loading}
//               className={`inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
//                 loading ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 'Generate Cover Letter'
//               )}
//             </button>
//             <button
//               onClick={handleReset}
//               className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//         {coverLetter && (
//           <div className="bg-gray-50 p-8 border-t border-gray-200">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//               Your Personalized Cover Letter:
//             </h3>
//             <div className="bg-white rounded-md shadow-md p-6 border border-gray-200 overflow-auto">
//               <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap">{coverLetter}</pre>
//             </div>
//             <div className="mt-4 flex justify-end space-x-3">
//               <button
//                 onClick={handleCopy}
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Copy to Clipboard
//               </button>
//               <button
//                 onClick={handleDownloadPdf}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Download as PDF
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GenerateCoverLetter;