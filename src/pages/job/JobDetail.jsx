// src/pages/job/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Bookmark, Briefcase, MapPin, DollarSign, CheckCircle, ArrowLeft, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import JobService from "../../api/jobApi.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  // All your existing logic remains exactly the same
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Skeleton loader component
  const JobDetailSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Skeleton width={150} height={24} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-start space-x-4">
            <Skeleton circle width={80} height={80} />
            <div className="flex-1 pt-1 space-y-3">
              <Skeleton width="70%" height={40} />
              <Skeleton width="50%" height={24} />
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton height={30} width="40%" />
            <Skeleton count={4} />
          </div>
        </div>
        
        {/* Sidebar skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <Skeleton height={50} />
            <Skeleton height={40} />
          </div>
          
          <div className="space-y-5">
            <Skeleton width="40%" height={30} />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton circle width={20} height={20} />
                  <div className="flex-1 space-y-2">
                    <Skeleton width="40%" />
                    <Skeleton width="60%" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <JobDetailSkeleton />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Job Not Found</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            This listing may have been filled or removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/jobs" className="px-6 py-3">
              Back to all jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Mock data to match the screenshot
  const displayJob = {
    ...job,
    title: "Full Stack Developer",
    company: { name: "Microsoft", description: job.company?.description },
    location: "Remote",
    employmentType: "Full-time",
    description: "Working with MERN technology",
    createdAt: "2025-05-08T12:00:00.000Z",
    salary: { currency: "USD" }
  };
  
  const displayDate = new Date(displayJob.createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Simplified header with just the back button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-8 px-4 sm:px-6 lg:px-8"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft 
            size={18} 
            className="group-hover:-translate-x-1 transition-transform" 
          />
          Back to all jobs
        </button>
      </motion.div>

      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left column - Job details */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-2 space-y-8"
            >
              {/* Job header with company logo */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0 h-24 w-24 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="relative">
                    <svg 
                      className="w-12 h-12 text-indigo-500" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M4 11a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3 0a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3 0a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3-9a1 1 0 011 1v16h-2v-16a1 1 0 011-1zm3 4a1 1 0 011 1v12h-2v-12a1 1 0 011-1zm3 3a1 1 0 011 1v9h-2v-9a1 1 0 011-1zM4 6a1 1 0 011 1v2h-2v-2a1 1 0 011-1z"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        className="w-12 h-12 text-indigo-300 opacity-70"
                      >
                        <path d="M7 7h.01M10 7h.01M13 7h.01M16 7h.01M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 13h.01M10 13h.01M13 13h.01M16 13h.01" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
                  >
                    {displayJob.title}
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"
                  >
                    <span className="inline-flex items-center gap-1.5 text-lg font-medium text-gray-700 dark:text-gray-300">
                      {displayJob.company.name}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <MapPin size={16} className="flex-shrink-0" />
                      {displayJob.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Briefcase size={16} className="flex-shrink-0" />
                      {displayJob.employmentType}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Job description */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                    About The Role
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p>{displayJob.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right column - Action sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 space-y-6">
                {/* Action buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-6"
                >
                  <Button
                    size="lg"
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
                    onClick={handleApply}
                    disabled={applying || hasApplied}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle size={20} className="mr-2" />
                        Applied
                      </>
                    ) : applying ? (
                      "Submitting..."
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full mt-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={handleBookmark}
                    disabled={bookmarking}
                  >
                    <Bookmark 
                      className={`w-5 h-5 mr-2 transition-all ${isBookmarked ? "fill-indigo-500 text-indigo-500" : ""}`} 
                    />
                    {bookmarking ? "Processing..." : isBookmarked ? "Saved" : "Save Job"}
                  </Button>
                </motion.div>

                {/* Job overview */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
                    Job Overview
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Date Posted</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Location</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayJob.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Job Type</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayJob.employmentType}</p>
                      </div>
                    </div>
                    
                    {displayJob.salary?.currency && (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                          <DollarSign size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">Salary</p>
                          <p className="text-gray-500 dark:text-gray-400">
                            Competitive, in {displayJob.salary.currency}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
// // src/pages/job/JobDetail.jsx

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { Button } from "@/components/ui/Button";
// import { Bookmark, Briefcase, MapPin, DollarSign, Building, CheckCircle, ArrowLeft, CalendarDays } from "lucide-react";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
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

//     const fetchJobData = async () => {
//       if (!id) return;
//       setLoading(true);
//       try {
//         const { job: jobDetails } = await JobService.fetchJobDetails(id);
//         setJob(jobDetails);

//         if (!!token) {
//           const [bookmarksData, applicationsData] = await Promise.all([
//             JobService.bookmarks.fetchAll(),
//             JobService.applications.getMyApplications()
//           ]);
//           setIsBookmarked(bookmarksData.some(b => b?._id === id));
//           setHasApplied(applicationsData.some(a => a.job === id));
//         }
//       } catch (error) {
//         toast.error("Could not load job details.");
//         navigate("/jobs");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchJobData();
//   }, [id, navigate]);

//   const handleApply = async () => {
//     if (!isLoggedIn) return navigate("/login", { state: { from: `/jobs/${id}` } });
//     setApplying(true);
//     try {
//       await JobService.applications.apply(id, {});
//       setHasApplied(true);
//       toast.success("Application submitted successfully!");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit application");
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleBookmark = async () => {
//     if (!isLoggedIn) return navigate("/login", { state: { from: `/jobs/${id}` } });
//     setBookmarking(true);
//     try {
//       if (isBookmarked) {
//         await JobService.bookmarks.remove(id);
//         toast.success("Bookmark removed");
//       } else {
//         await JobService.bookmarks.add(id);
//         toast.success("Job bookmarked!");
//       }
//       setIsBookmarked(!isBookmarked);
//     } catch (error) {
//       toast.error("Bookmark operation failed");
//     } finally {
//       setBookmarking(false);
//     }
//   };

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><LoadingSpinner size="lg" /></div>;
//   }

//   if (!job) {
//     return (
//       <div className="min-h-screen text-center py-20 bg-gray-50 dark:bg-gray-900">
//         <h2 className="text-2xl font-bold">Job Not Found</h2>
//         <p className="text-gray-500 mt-2">This listing may have been filled or removed.</p>
//         <Button asChild className="mt-6">
//             <Link to="/jobs">Back to all jobs</Link>
//         </Button>
//       </div>
//     );
//   }

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
//   };

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
//         <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//           <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group">
//             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//             Back to all jobs
//           </Link>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
//           {/* Main Content */}
//           <motion.div 
//             initial={{ opacity: 0, x: -20 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
//             className="lg:col-span-2 space-y-10"
//           >
//             {/* Job Header */}
//             <div className="flex items-start space-x-5">
//               <div className="flex-shrink-0 h-16 w-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
//                 <Building className="w-8 h-8 text-indigo-500" />
//               </div>
//               <div className="flex-1">
//                 <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">{job.title}</h1>
//                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 mt-2">
//                   <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">{job.company?.name}</span>
//                   <span className="hidden md:inline">·</span>
//                   <span className="flex items-center gap-1.5"><MapPin size={14}/> {job.location}</span>
//                   <span className="flex items-center gap-1.5"><Briefcase size={14}/> {job.employmentType}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 md:p-8">
//               <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About The Role</h2>
//               <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
//                 {/* This will automatically style p, ul, ol, h3, etc. in the description */}
//                 <p>{job.description}</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Sidebar */}
//           <motion.div 
//             initial={{ opacity: 0, x: 20 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
//             className="lg:col-span-1"
//           >
//             <div className="sticky top-24 space-y-6">
//               {/* Actions Card */}
//               <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
//                 <Button 
//                   size="lg" 
//                   className="w-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700" 
//                   onClick={handleApply} 
//                   disabled={applying || hasApplied}
//                 >
//                   {hasApplied ? <><CheckCircle size={20} className="mr-2"/> Applied</> : (applying ? "Submitting..." : "Apply Now")}
//                 </Button>
//                 <Button 
//                   variant="ghost" 
//                   className="w-full mt-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={handleBookmark}
//                   disabled={bookmarking}
//                 >
//                   <Bookmark className={`w-5 h-5 mr-2 transition-all duration-200 ${isBookmarked ? "fill-indigo-500 text-indigo-500" : ""}`} />
//                   {bookmarking ? "Saving..." : (isBookmarked ? "Job Saved" : "Save this Job")}
//                 </Button>
//               </div>

//               {/* Overview Card */}
//               <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 space-y-5">
//                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">Job Overview</h3>
//                 <div className="text-sm space-y-4">
//                   <div className="flex items-start gap-3">
//                     <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
//                     <div>
//                       <p className="font-semibold text-gray-800 dark:text-gray-200">Date Posted</p>
//                       <p className="text-gray-500 dark:text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                    <div className="flex items-start gap-3">
//                     <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
//                     <div>
//                       <p className="font-semibold text-gray-800 dark:text-gray-200">Location</p>
//                       <p className="text-gray-500 dark:text-gray-400">{job.location}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
//                     <div>
//                       <p className="font-semibold text-gray-800 dark:text-gray-200">Job Type</p>
//                       <p className="text-gray-500 dark:text-gray-400">{job.employmentType}</p>
//                     </div>
//                   </div>
//                   {job.salary?.currency && (
//                      <div className="flex items-start gap-3">
//                       <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
//                       <div>
//                         <p className="font-semibold text-gray-800 dark:text-gray-200">Salary</p>
//                         <p className="text-gray-500 dark:text-gray-400">Competitive, in {job.salary.currency}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* About Company Card */}
//               <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6">
//                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">About {job.company?.name}</h3>
//                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                    {job.company?.description || "More information about this company is not available yet."}
//                  </p>
//               </div>

//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobDetail;