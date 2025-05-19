import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { generateCoverLetter } from '../../api/aiApi'; 

const GenerateCoverLetter = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!jobTitle || !companyName || !resumeText || !name || !email || !phone || !address) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await generateCoverLetter({
        jobTitle,
        companyName,
        resumeText,
        jobDescription,
        name,
        email,
        phone,
        date,
        address,
      });
      setCoverLetter(response.data.coverLetter);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (coverLetter) {
      try {
        await navigator.clipboard.writeText(coverLetter);
        alert('Cover letter copied to clipboard!');
      } catch (err) {
        alert('Failed to copy cover letter.');
      }
    }
  };

  const handleDownloadPdf = () => {
    if (coverLetter) {
      const doc = new jsPDF();
      doc.text(coverLetter, 10, 10);
      doc.save(`CoverLetter_${companyName}_${jobTitle}.pdf`);
    }
  };

  const handleReset = () => {
    setJobTitle('');
    setCompanyName('');
    setResumeText('');
    setJobDescription('');
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setDate('');
    setCoverLetter('');
    setError('');
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen py-16 px-6 sm:px-8 lg:px-12 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-400 to-indigo-500 py-10 px-8 text-white text-center">
          <h2 className="text-4xl font-semibold tracking-tight mb-2">
            Craft Your Winning Cover Letter
          </h2>
          <p className="text-lg opacity-80">
            Let our AI help you make the best first impression.
          </p>
        </div>
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Oops!</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Phone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="+91 1234567890"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-700 text-sm font-semibold mb-2">
                  Date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Address:
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Your Current Address"
                />
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-semibold mb-2">
                  Job Title:
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Company Name:
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Google"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="resumeText" className="block text-gray-700 text-sm font-semibold mb-2">
                Key Achievements & Skills:
                <span className="text-gray-500 text-xs italic">(Focus on relevant skills and quantifiable achievements)</span>
              </label>
              <textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Highlight your most relevant experience and skills for this role."
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-gray-700 text-sm font-semibold mb-2">
                Job Description (Optional):
                <span className="text-gray-500 text-xs italic">(Paste the job description to tailor your letter even more)</span>
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Paste the job description here."
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Cover Letter'
              )}
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
          </div>
        </div>
        {coverLetter && (
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Your Personalized Cover Letter:
            </h3>
            <div className="bg-white rounded-md shadow-md p-6 border border-gray-200 overflow-auto">
              <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap">{coverLetter}</pre>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download as PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCoverLetter;