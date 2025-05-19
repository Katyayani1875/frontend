import { useEffect, useState } from 'react';
import api from "@/lib/axios";
import { Button } from '@/components/ui/Button';
import { FileTextIcon, SparklesIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resumes/me'); // Using custom api instance
        setUploadedResume(res.data);
      } catch (err) {
        console.log('No resume found');
      }
    };

    fetchResume();
  }, []);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resume) {
      return toast.error('Please select a resume file first.');
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      setUploading(true);
      const res = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Resume uploaded successfully!');
      setUploadedResume(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Upload Your Resume
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        {uploadedResume && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-700 border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileTextIcon className="w-6 h-6 text-blue-600" />
              <span className="text-blue-700 dark:text-white font-medium">
                {uploadedResume.filename}
              </span>
            </div>
            <a
              href={uploadedResume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 underline"
            >
              View
            </a>
          </div>
        )}

        <div className="mt-6">
          <Link to="/ai/analyze-resume">
            <Button variant="secondary" className="flex items-center gap-2 w-full">
              <SparklesIcon className="w-5 h-5" />
              Analyze Resume with AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
