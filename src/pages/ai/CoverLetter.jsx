// src/pages/ai/GenerateCoverLetter.jsx

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { generateCoverLetter } from '../../api/aiApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, User, Briefcase, FileText, Download, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

const STEPS = [
    { id: 1, name: 'The Role', icon: <Briefcase/> },
    { id: 2, name: 'About You', icon: <User/> },
    { id: 3, name: 'Your Letter', icon: <FileText/> },
];

const GenerateCoverLetter = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
      jobTitle: '', companyName: '', jobDescription: '',
      name: '', email: '', phone: '', address: '',
      resumeText: '',
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.resumeText || !formData.name) {
      return toast.error('Please fill in all required fields.');
    }
    setLoading(true);
    setCurrentStep(3); // Move to the final step to show loading/result
    try {
      const response = await generateCoverLetter(formData);
      setCoverLetter(response.data.coverLetter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error generating cover letter.');
      setCurrentStep(2); // Go back if error
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard!');
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    // Basic text wrapping
    const splitText = doc.splitTextToSize(coverLetter, 180);
    doc.text(splitText, 15, 20);
    doc.save(`CoverLetter_${formData.companyName}.pdf`);
  };

  const handleReset = () => {
    setFormData({ jobTitle: '', companyName: '', jobDescription: '', name: '', email: '', phone: '', address: '', resumeText: '' });
    setCoverLetter('');
    setCurrentStep(1);
  };
  
  const livePreviewText = `
[Your Name]
[Your Address]
[Your Phone]
[Your Email]

[Date]

[Hiring Manager Name/Title]
[Company Name]
[Company Address]

Dear [Hiring Manager Name],

I am writing to express my enthusiastic interest in the **${formData.jobTitle || '(Job Title)'}** position at **${formData.companyName || '(Company Name)'}**, which I discovered on [Platform where you saw the ad]. Having followed [Company Name]'s impressive work in [Industry], I am confident that my skills in **${(formData.resumeText.split(' ').slice(0, 5).join(' ') + '...') || '(Your Skills)'}** align perfectly with the requirements of this role.

In my previous role at [Previous Company], I was responsible for [Your responsibilities]. One of my proudest moments was when I **${formData.resumeText || '(Your Achievement)'}**. This experience has equipped me with a strong foundation in [Relevant Skill 1] and [Relevant Skill 2], which I am eager to bring to your innovative team.

Thank you for considering my application. I have attached my resume for your review and welcome the opportunity to discuss how I can contribute to **${formData.companyName}**'s continued success.

Sincerely,
${formData.name || '(Your Name)'}
  `.trim();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Cover Letter Generator</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">Craft a professional cover letter in minutes. Let our AI help you make the best first impression.</p>
            </motion.div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {STEPS.map((step, i) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep >= step.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-500'}`}>
                                        {currentStep > step.id ? <Check/> : step.icon}
                                    </div>
                                    <p className={`mt-2 text-xs font-semibold ${currentStep >= step.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>{step.name}</p>
                                </div>
                                {i < STEPS.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${currentStep > i + 1 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[450px]">
                    {/* Left Side: Form */}
                    <div className="md:pr-8 md:border-r md:border-slate-200 dark:md:border-slate-700">
                        <AnimatePresence mode="wait">
                            <motion.div key={currentStep} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tell us about the role</h3>
                                        <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g., Software Engineer"/>
                                        <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., Google"/>
                                        <Textarea label="Job Description (Optional)" name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Paste job description for better results" rows={5}/>
                                    </div>
                                )}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tell us about you</h3>
                                        <Input label="Your Name" name="name" value={formData.name} onChange={handleChange} />
                                        <Input label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                        <Input label="Your Phone" name="phone" value={formData.phone} onChange={handleChange} />
                                        <Input label="Your Address" name="address" value={formData.address} onChange={handleChange} />
                                        <Textarea label="Key Achievements & Skills" name="resumeText" value={formData.resumeText} onChange={handleChange} placeholder="Highlight your most relevant experience for this role" rows={5}/>
                                    </div>
                                )}
                                {currentStep === 3 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                       {loading ? (
                                           <>
                                            <Loader2 size={48} className="text-indigo-500 animate-spin" />
                                            <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-white">Crafting your letter...</h3>
                                            <p className="text-slate-500">Our AI is working its magic!</p>
                                           </>
                                       ) : (
                                           <>
                                            <Check size={48} className="text-green-500" />
                                            <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-white">Your letter is ready!</h3>
                                            <p className="text-slate-500">Copy, download, or edit it on the right.</p>
                                            <div className="mt-6 flex gap-3">
                                                <Button onClick={handleCopy} variant="outline"><Copy className="w-4 h-4 mr-2"/> Copy</Button>
                                                <Button onClick={handleDownloadPdf} variant="outline"><Download className="w-4 h-4 mr-2"/> PDF</Button>
                                                <Button onClick={handleReset} variant="ghost"><RefreshCw className="w-4 h-4 mr-2"/> Start Over</Button>
                                            </div>
                                           </>
                                       )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Live Preview / Result */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 font-mono text-xs text-slate-600 dark:text-slate-400 leading-relaxed overflow-auto relative">
                        <AnimatePresence>
                            <motion.pre 
                                key={currentStep === 3 && !loading ? 'result' : 'preview'}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="whitespace-pre-wrap"
                            >
                                {currentStep === 3 && !loading ? coverLetter : livePreviewText}
                            </motion.pre>
                        </AnimatePresence>
                        <div className="absolute top-2 right-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">LIVE PREVIEW</div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        {currentStep > 1 && currentStep < 3 && (
                            <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
                        )}
                    </div>
                    <div>
                        {currentStep === 1 && (
                            <Button onClick={() => setCurrentStep(2)}>Next: About You</Button>
                        )}
                        {currentStep === 2 && (
                            <Button onClick={handleGenerate} disabled={loading}><Sparkles className="w-4 h-4 mr-2"/> Generate Letter</Button>
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