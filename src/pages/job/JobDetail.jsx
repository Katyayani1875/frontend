// src/pages/job/JobDetail.jsx

import React, { useEffect, useState, useCallback } from "react";
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
        if (token) {
          // Assume we have methods to check these statuses
          // For now, we'll keep it simple
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
            {/* Header */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 h-20 w-20 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md border border-gray-100 dark:border-gray-700">
                <Building className="w-10 h-10 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{job.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-1">{job.company?.name}</p>
              </div>
            </div>

            {/* Job Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>{job.description}</p>
              
              {job.responsibilities?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-white">Responsibilities</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
              
              {job.requirements?.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-white">Requirements</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    {job.requirements.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              )}
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
                <Button size="lg" className="w-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700">
                  Apply Now
                </Button>
                <Button variant="ghost" className="w-full mt-3 text-gray-600 dark:text-gray-300">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Save Job
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
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/Button";
// import { BookmarkIcon, BriefcaseIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
// import toast from "react-hot-toast";
// import JobService from "../../api/jobApi.js";
// import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";

// const JobDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [applying, setApplying] = useState(false);
//   const [bookmarking, setBookmarking] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [hasApplied, setHasApplied] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   useEffect(() => {
//     const fetchJobData = async () => {
//       if (!id) {
//         navigate("/jobs");
//         return;
//       }

//       try {
//         setLoading(true);
//         const jobData = await JobService.fetchJobDetails(id);
//         setJob(jobData.job);

//         if (isLoggedIn) {
//           const [bookmarksData, applicationsData] = await Promise.all([
//             JobService.bookmarks.fetchAll(),
//             JobService.applications.getMyApplications()
//           ]);
//           setIsBookmarked(bookmarksData.some(b => b._id === id));
//           setHasApplied(applicationsData.some(a => a.job === id));
//         }
//       } catch (error) {
//         console.error("Failed to fetch job data:", error);
//         toast.error("Failed to load job details");
//         navigate("/jobs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobData();
//   }, [id, navigate, isLoggedIn]);

// const handleApply = async () => {
//   if (!isLoggedIn) {
//     toast.error("Please log in to apply for jobs.");
//     navigate("/login", { state: { from: `/jobs/${id}` } });
//     return;
//   }

//   setApplying(true);
//   try {
//     // Using JobService for consistency
//     const result = await JobService.applications.apply(id, {}); // Empty object since no data needed
    
//     if (result.success) {
//       setHasApplied(true);
//       toast.success("Application submitted successfully!");
//     } else {
//       toast.error(result.message || "Failed to submit application");
//     }
//   } catch (error) {
//     console.error("Application error:", error);
//     toast.error(error.response?.data?.message || "Failed to submit application");
//   } finally {
//     setApplying(false);
//   }
// };
//   const handleBookmark = async () => {
//     if (!isLoggedIn) {
//       navigate("/login", { state: { from: `/jobs/${id}` } });
//       return;
//     }

//     try {
//       setBookmarking(true);
//       if (isBookmarked) {
//         await JobService.bookmarks.remove(id);
//         setIsBookmarked(false);
//         toast.success("Bookmark removed");
//       } else {
//         await JobService.bookmarks.add(id);
//         setIsBookmarked(true);
//         toast.success("Job bookmarked!");
//       }
//     } catch (error) {
//       console.error("Bookmark error:", error);
//       toast.error(error.response?.data?.message || "Bookmark operation failed");
//     } finally {
//       setBookmarking(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (!job) {
//     return (
//       <div className="text-center py-20">
//         <h3 className="text-xl font-medium text-gray-700">Job not found</h3>
//         <Button onClick={() => navigate("/jobs")} className="mt-4">
//           Browse Jobs
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-6">
//         {/* Job Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//           <div className="space-y-2">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
//               {job.title}
//             </h1>
//             <div className="flex items-center gap-2">
//               <p className="text-lg text-gray-700 dark:text-gray-300">
//                 {job.company?.name || "A Reputable Company"}
//               </p>
//               {job.company?.verified && (
//                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                   Verified
//                 </span>
//               )}
//             </div>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//             <Button
//               onClick={handleApply}
//               disabled={hasApplied || applying}
//               className="w-full md:w-auto"
//             >
//               {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
//             </Button>
//             <Button
//               onClick={handleBookmark}
//               variant="ghost"
//               disabled={bookmarking}
//               className="w-full md:w-auto"
//             >
//               <BookmarkIcon
//                 className={`w-5 h-5 mr-2 ${isBookmarked ? "fill-current" : ""}`}
//               />
//               {bookmarking ? "Processing..." : isBookmarked ? "Bookmarked" : "Bookmark"}
//             </Button>
//           </div>
//         </div>

//         {/* Job Meta */}
//           <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
//           <div className="flex items-center gap-1">
//             <MapPinIcon className="w-4 h-4" />
//             <span>{job.location || "Remote"}</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <BriefcaseIcon className="w-4 h-4" />
//             <span>{job.employmentType || "Full-time"}</span>
//           </div>
//           {/* Check if salary exists and has a currency property before rendering */}
//           {job.salary && job.salary.currency && (
//             <div className="flex items-center gap-1">
//               <DollarSignIcon className="w-4 h-4" />
//               <span>Salary in {job.salary.currency}</span>
//             </div>
//           )}
//         </div>

//         {/* Job Description */}
//         <div className="space-y-6">
//           <div className="prose max-w-none dark:prose-invert">
//             <h3 className="text-xl font-semibold">Job Description</h3>
//             <p>{job.description}</p>

//             {job.responsibilities?.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold">Responsibilities</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {job.responsibilities.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {job.requirements?.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold">Requirements</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {job.requirements.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {job.benefits?.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold">Benefits</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {job.benefits.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//             <Button
//               onClick={handleApply}
//               size="lg"
//               disabled={hasApplied || applying}
//               className="w-full md:w-auto"
//             >
//               {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobDetail;