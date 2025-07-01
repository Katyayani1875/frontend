
// src/pages/job/JobDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Bookmark, Briefcase, MapPin, DollarSign, Building, CheckCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import JobService from "../../api/jobApi.js";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchJobData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { job: jobDetails } = await JobService.fetchJobDetails(id);
        setJob(jobDetails);

        if (!!token) {
          const [bookmarksData, applicationsData] = await Promise.all([
            JobService.bookmarks.fetchAll(),
            JobService.applications.getMyApplications()
          ]);
          setIsBookmarked(bookmarksData.some(b => b?._id === id));
          setHasApplied(applicationsData.some(a => a.job === id));
        }
      } catch (error) {
        toast.error("Could not load job details.");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!isLoggedIn) return navigate("/login", { state: { from: `/jobs/${id}` } });
    setApplying(true);
    try {
      await JobService.applications.apply(id, {});
      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) return navigate("/login", { state: { from: `/jobs/${id}` } });
    setBookmarking(true);
    try {
      if (isBookmarked) {
        await JobService.bookmarks.remove(id);
        toast.success("Bookmark removed");
      } else {
        await JobService.bookmarks.add(id);
        toast.success("Job bookmarked!");
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      toast.error("Bookmark operation failed");
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  }

  if (!job) {
    return <div className="min-h-screen text-center py-20">Job not found.</div>;
  }

  return (
    <div className="bg-slate-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors">
            <ArrowLeft size={16} />
            Back to all jobs
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 h-20 w-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md border border-gray-100 dark:border-gray-700">
                <Building className="w-10 h-10 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{job.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-1">{job.company?.name}</p>
              </div>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>{job.description}</p>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-xl p-6">
                <Button 
                  size="lg" 
                  className="w-full text-lg font-bold" 
                  onClick={handleApply} 
                  disabled={applying || hasApplied}
                >
                  {hasApplied ? <><CheckCircle size={20} className="mr-2"/> Applied</> : (applying ? "Submitting..." : "Apply Now")}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full mt-3 text-gray-600 dark:text-gray-300"
                  onClick={handleBookmark}
                  disabled={bookmarking}
                >
                  <Bookmark className={`w-5 h-5 mr-2 transition-colors ${isBookmarked ? "fill-current text-indigo-500" : ""}`} />
                  {bookmarking ? "Saving..." : (isBookmarked ? "Saved" : "Save Job")}
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Job Overview</h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">Location</p>
                      <p>{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">Job Type</p>
                      <p>{job.employmentType}</p>
                    </div>
                  </div>
                  {job.salary?.currency && (
                     <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Salary</p>
                        <p>Competitive, in {job.salary.currency}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;