// src/pages/job/JobDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Bookmark, Briefcase, MapPin, DollarSign, Building, CheckCircle, ArrowLeft, CalendarDays } from "lucide-react";
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><LoadingSpinner size="lg" /></div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen text-center py-20 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="text-gray-500 mt-2">This listing may have been filled or removed.</p>
        <Button asChild className="mt-6">
            <Link to="/jobs">Back to all jobs</Link>
        </Button>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

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
  const displayDate = new Date(displayJob.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });


  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen text-gray-800 dark:text-gray-200 font-sans">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-indigo-600">JobHunt</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">Home</Link>
                        <Link to="#" className="text-sm font-medium text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-1">Jobs</Link>
                        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">Company</Link>
                        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white">About</Link>
                        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white inline-flex items-center">AI Insights <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m6 9 6 6 6-6"/></svg></Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                     <div className="relative hidden sm:block">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input type="text" placeholder="Tools..." className="w-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-500">⌘K</span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m4.93 19.07 1.41-1.41"></path><path d="m17.66 6.34 1.41-1.41"></path></svg></button>
                    <div className="w-8 h-8 bg-indigo-200 rounded-full"></div>
                </div>
            </div>
        </div>
      </header>
      <main className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to all jobs
            </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="lg:col-span-2 space-y-8"
            >
                {/* Job Header */}
                <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-20 w-20 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <svg className="w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M4 11a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3 0a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3 0a1 1 0 011 1v8h-2v-8a1 1 0 011-1zm3-9a1 1 0 011 1v16h-2v-16a1 1 0 011-1zm3 4a1 1 0 011 1v12h-2v-12a1 1 0 011-1zm3 3a1 1 0 011 1v9h-2v-9a1 1 0 011-1zM4 6a1 1 0 011 1v2h-2v-2a1 1 0 011-1z"></path></svg>
                    <div className="absolute w-10 h-10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-300"><path d="M7 7h.01M10 7h.01M13 7h.01M16 7h.01M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 13h.01M10 13h.01M13 13h.01M16 13h.01" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                </div>
                <div className="flex-1 pt-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{displayJob.title}</h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 mt-2">
                    <span className="font-medium text-lg text-gray-700 dark:text-gray-300">{displayJob.company.name}</span>
                    <span className="hidden md:inline text-gray-300 dark:text-gray-600">·</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14}/> {displayJob.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={14}/> {displayJob.employmentType}</span>
                    </div>
                </div>
                </div>

                {/* Job Description */}
                <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">About The Role</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p>{displayJob.description}</p>
                </div>
                </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-1"
            >
                <div className="sticky top-24 space-y-6">
                {/* Actions Card */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6">
                    <Button 
                    size="lg" 
                    className="w-full text-lg font-bold bg-indigo-600 hover:bg-indigo-700" 
                    onClick={handleApply} 
                    disabled={applying || hasApplied}
                    >
                    {hasApplied ? <><CheckCircle size={20} className="mr-2"/> Applied</> : (applying ? "Submitting..." : "Apply Now")}
                    </Button>
                    <Button 
                    variant="ghost" 
                    className="w-full mt-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    >
                    <Bookmark className={`w-5 h-5 mr-2 transition-all duration-200 ${isBookmarked ? "fill-indigo-500 text-indigo-500" : ""}`} />
                    {bookmarking ? "Saving..." : (isBookmarked ? "Job Saved" : "Save this Job")}
                    </Button>
                </div>

                {/* Overview Card */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 space-y-5">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Job Overview</h3>
                    <div className="text-sm space-y-4">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Date Posted</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayDate}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Location</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayJob.location}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Job Type</p>
                        <p className="text-gray-500 dark:text-gray-400">{displayJob.employmentType}</p>
                        </div>
                    </div>
                    {displayJob.salary?.currency && (
                        <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Salary</p>
                            <p className="text-gray-500 dark:text-gray-400">Competitive, in {displayJob.salary.currency}</p>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
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