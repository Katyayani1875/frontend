// src/pages/job/Jobs.jsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Building, ChevronRight, Search, Zap, Code, BarChart, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "@/components/ui/Button";

// Redesigned: Professional, memoized Job List Item component for the right column
const JobListItem = memo(({ job, onHover, isActive }) => {
  return (
    <div onMouseEnter={() => onHover(job)} className="relative group">
      {/* The entire card is a hover target, but the link makes it accessible */}
      <Link to={`/jobs/${job._id}`} className="block">
        <div 
          className={`p-5 rounded-xl border-2 transition-all duration-300 ease-in-out
            ${isActive 
              ? 'bg-white dark:bg-gray-800 shadow-2xl -translate-x-2 border-indigo-500 ring-2 ring-indigo-500/30' 
              : 'bg-white/80 dark:bg-gray-800/40 border-transparent group-hover:bg-white dark:group-hover:bg-gray-800/70 group-hover:border-indigo-400 group-hover:shadow-lg'
            }`
          }
        >
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {job.company?.name || "A Reputable Company"}
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm mt-3 gap-x-4 gap-y-1">
            <span className="flex items-center"><MapPin size={14} className="mr-1.5 flex-shrink-0" />{job.location || "Remote"}</span>
            <span className="flex items-center"><Briefcase size={14} className="mr-1.5 flex-shrink-0" />{job.employmentType || "Full-time"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
});

// Redesigned: Featured Job Display for the left column
const FeaturedJobDisplay = ({ job }) => {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <Zap size={48} className="text-indigo-400 dark:text-indigo-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Select a Job to View</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">Hover over a job listing on the right to see the full details here.</p>
      </div>
    );
  }
  
  // Assuming job object might have a skills array, provide a fallback for styling.
  const skills = job.skills || ['React', 'Tailwind CSS', 'JavaScript', 'User Interfaces'];

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex-grow">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          {job.company?.name}
        </p>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
          {job.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 text-sm mt-4">
          <div className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</div>
          <div className="flex items-center gap-1.5"><Briefcase size={16} />{job.employmentType}</div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mt-6 text-base leading-relaxed line-clamp-4">
          {job.description}
        </p>

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Core Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
      <div className="mt-auto pt-8">
        <Link to={`/jobs/${job._id}`}>
          <Button size="lg" className="w-full font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white">View Full Details & Apply</Button>
        </Link>
      </div>
    </div>
  );
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredJob, setFeaturedJob] = useState(null);

  const fetchJobs = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/jobs", { params: { page: pageNum, limit: 10 } });
      const fetchedJobs = res.data.jobs || [];
      setJobs(fetchedJobs);
      setTotalPages(res.data.totalPages || 1);
      if (fetchedJobs.length > 0 && pageNum === 1) { // Only auto-select on first load
        setFeaturedJob(fetchedJobs[0]);
      } else if (fetchedJobs.length === 0) {
        setFeaturedJob(null);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setTimeout(() => setLoading(false), 300); // Simulate network delay for smoother skeleton
    }
  }, []);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
                    Find Your <span className="text-indigo-500">Next Role</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    We meticulously curate opportunities from the world's most innovative companies, ensuring you find a role that not only matches your skills but also fuels your passion.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left Column: Featured Job - Sticky on large screens */}
                <div className="lg:sticky lg:top-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={featuredJob?._id || 'empty'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <FeaturedJobDisplay job={featuredJob} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Column: Job List */}
                <div className="space-y-4">
                    {loading ? (
                        // Skeleton loaders that match the new card design
                        Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-[124px] bg-gray-200/80 dark:bg-gray-800/50 rounded-xl animate-pulse"></div>)
                    ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                            <JobListItem key={job._id} job={job} onHover={setFeaturedJob} isActive={featuredJob?._id === job._id} />
                        ))
                    ) : (
                        <div className="text-center py-16 text-gray-500 bg-white dark:bg-gray-800/40 rounded-xl">
                            <p className="font-semibold">No open positions found.</p>
                            <p className="text-sm mt-1">Please check back later or adjust your search filters.</p>
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center pt-8 space-x-2">
                            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="ghost">Previous</Button>
                            <span className="font-medium text-gray-700 dark:text-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">Page {page} of {totalPages}</span>
                            <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="ghost">Next</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Jobs;
// // src/pages/job/Jobs.jsx

// import React, { useEffect, useState, useCallback, memo } from "react";
// import { Link } from "react-router-dom";
// import { Briefcase, MapPin, Building, ChevronRight, Search, Zap, Code, BarChart, PenTool } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import axiosInstance from "../../utils/axiosInstance";
// import { Button } from "@/components/ui/Button";

// // Professional, memoized Job List Item component for the right column
// const JobListItem = memo(({ job, onHover, isActive }) => {
//   return (
//     <div onMouseEnter={() => onHover(job)} className="relative">
//       <Link to={`/jobs/${job._id}`} className="block">
//         <div className={`p-5 rounded-lg border transition-all duration-300 ${isActive ? 'bg-white dark:bg-gray-800 shadow-2xl -translate-x-2 border-indigo-500' : 'bg-transparent dark:bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
//           <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
//             {job.company?.name || "A Reputable Company"}
//           </p>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
//             {job.title}
//           </h3>
//           <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
//             <MapPin size={14} className="mr-2" />
//             <span>{job.location || "Remote"}</span>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// });

// // Featured Job Display for the left column
// const FeaturedJobDisplay = ({ job }) => {
//   if (!job) return (
//     <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-100 dark:bg-gray-800/20 rounded-2xl">
//       <Zap size={48} className="text-indigo-300 dark:text-indigo-600 mb-4" />
//       <h3 className="text-xl font-bold text-gray-800 dark:text-white">Select a Job</h3>
//       <p className="text-gray-500 dark:text-gray-400 mt-2">Hover over a listing to see the details here.</p>
//     </div>
//   );

//   return (
//     <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
//       <div className="flex-grow">
//         <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
//           {job.company?.name}
//         </p>
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
//           {job.title}
//         </h2>
//         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400 text-sm mt-4">
//           <div className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</div>
//           <div className="flex items-center gap-1.5"><Briefcase size={14} />{job.employmentType}</div>
//         </div>
//         <p className="text-gray-600 dark:text-gray-300 mt-6 line-clamp-4">
//           {job.description}
//         </p>
//       </div>
//       <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//         <Link to={`/jobs/${job._id}`}>
//           <Button size="lg" className="w-full font-bold text-lg">View Full Details & Apply</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// const Jobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [featuredJob, setFeaturedJob] = useState(null);

//   const fetchJobs = useCallback(async (pageNum) => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("/jobs", { params: { page: pageNum, limit: 10 } });
//       const fetchedJobs = res.data.jobs || [];
//       setJobs(fetchedJobs);
//       setTotalPages(res.data.totalPages || 1);
//       if (fetchedJobs.length > 0) {
//         setFeaturedJob(fetchedJobs[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setTimeout(() => setLoading(false), 300);
//     }
//   }, []);

//   useEffect(() => {
//     fetchJobs(page);
//   }, [page, fetchJobs]);
  
//   return (
//     <div className="bg-white dark:bg-black min-h-screen">
//         <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
//                 <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
//                     Find Your <span className="text-indigo-500">Next Role</span>
//                 </h1>
//                 <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
//                     We meticulously curate opportunities from the world's most innovative companies, ensuring you find a role that not only matches your skills but also fuels your passion.
//                 </p>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
//                 {/* Left Column: Featured Job */}
//                 <div className="lg:sticky lg:top-24">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={featuredJob?._id || 'empty'}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             <FeaturedJobDisplay job={featuredJob} />
//                         </motion.div>
//                     </AnimatePresence>
//                 </div>

//                 {/* Right Column: Job List */}
//                 <div className="space-y-4">
//                     {loading ? (
//                         Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800/30 rounded-lg animate-pulse"></div>)
//                     ) : jobs.length > 0 ? (
//                         jobs.map((job) => (
//                             <JobListItem key={job._id} job={job} onHover={setFeaturedJob} isActive={featuredJob?._id === job._id} />
//                         ))
//                     ) : (
//                         <p className="text-center py-10 text-gray-500">No open positions found.</p>
//                     )}

//                     {!loading && totalPages > 1 && (
//                         <div className="flex justify-center items-center pt-8 space-x-2">
//                             <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="ghost">Previous</Button>
//                             <span className="font-medium text-gray-700 dark:text-gray-300">Page {page}</span>
//                             <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="ghost">Next</Button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Jobs;