// src/pages/job/Jobs.jsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { BriefcaseIcon, MapPinIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

// A performant, memoized Job Card component
const JobCard = memo(({ job, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99], 
        delay: index * 0.07, 
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0px 20px 25px -5px rgba(0, 0,0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg flex flex-col overflow-hidden"
    >
      <div className="p-6 flex-grow">
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
          {job.company?.name || "A Reputable Company"}
        </p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 h-14">
          {job.title}
        </h2>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <MapPinIcon className="w-4 h-4 mr-2 shrink-0" />
          <span>{job.location || "Remote"}</span>
        </div>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
          <BriefcaseIcon className="w-4 h-4 mr-2 shrink-0" />
          <span>{job.employmentType || "Full-time"}</span>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/30 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <Link
          to={`/jobs/${job._id}`}
          className="group text-sm font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
});

// A Skeleton Loader for a professional loading state
const SkeletonCard = () => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/jobs", { params: { page: pageNum } });
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Optionally, show a toast notification here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Explore Job Opportunities
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover your next career move with our curated list of opportunities from top companies.
          </p>
        </motion.div>
        
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <JobCard key={job._id} job={job} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No jobs found.</p>
            )}
          </div>
        </AnimatePresence>

        {!loading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center items-center mt-12 space-x-4"
          >
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jobs;