// src/pages/job/Jobs.jsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Building, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

// A professional, memoized Job List Item component
const JobListItem = memo(({ job, onHover, isActive }) => {
  return (
    <div onMouseEnter={() => onHover(job)} className="relative">
      <Link to={`/jobs/${job._id}`} className="block">
        <div className={`p-5 rounded-lg border transition-all duration-300 ${isActive ? 'bg-white dark:bg-gray-800 shadow-2xl -translate-x-2 border-indigo-500' : 'bg-transparent dark:bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {job.company?.name || "A Reputable Company"}
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2">
            <MapPin size={14} className="mr-2" />
            <span>{job.location || "Remote"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
});

// Featured Job Display with the new button
const FeaturedJobDisplay = ({ job }) => {
  if (!job) return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-100 dark:bg-gray-800/20 rounded-2xl">
      <Zap size={48} className="text-indigo-300 dark:text-indigo-600 mb-4" />
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Select a Job</h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Hover over a listing to see the details here.</p>
    </div>
  );

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex-grow">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{job.company?.name}</p>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">{job.title}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 dark:text-gray-400 text-sm mt-4">
          <div className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</div>
          <div className="flex items-center gap-1.5"><Briefcase size={14} />{job.employmentType}</div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-6 line-clamp-4">{job.description}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link to={`/jobs/${job._id}`}>
          <button className="btn-shine w-full">
            View Full Details & Apply
          </button>
        </Link>
      </div>
    </div>
  );
};

// A  Skeleton Loader for the list view
const SkeletonListItem = () => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg flex items-center space-x-6 animate-pulse">
    <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);


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
      if (pageNum === 1 && fetchedJobs.length > 0) {
        setFeaturedJob(fetchedJobs[0]);
      } else if (fetchedJobs.length > 0) {
        // Keep the featured job if it's still in the list, otherwise update it
        if (!fetchedJobs.find(j => j._id === featuredJob?._id)) {
          setFeaturedJob(fetchedJobs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [featuredJob]);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && !loading) {
      setPage(newPage);
    }
  };
  
  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-white">
            Find Your <span className="text-indigo-500">Next Role</span>
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            We meticulously curate opportunities from the world's most innovative companies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredJob?._id || 'empty'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <FeaturedJobDisplay job={featuredJob} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 7 }).map((_, i) => <SkeletonListItem key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <JobListItem key={job._id} job={job} onHover={setFeaturedJob} isActive={featuredJob?._id === job._id} />
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">No open positions found.</p>
            )}

            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center pt-8 space-x-2">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="btn-ghost-premium">Previous</button>
                <span className="font-semibold text-gray-700 dark:text-gray-300 px-4">Page {page}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="btn-ghost-premium">Next</button>
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