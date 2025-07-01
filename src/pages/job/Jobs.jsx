// src/pages/job/Jobs.jsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Building, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "@/components/ui/Button"; // Assuming you have this

// A professional, memoized Job List Item component
const JobListItem = memo(({ job, index }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // Decelerate ease for a smooth finish
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.01, zIndex: 10 }}
      className="group relative"
    >
      <Link to={`/jobs/${job._id}`} className="block">
        <div className="bg-white dark:bg-gray-800/50 p-6 border-l-4 border-transparent group-hover:border-indigo-500 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-6">
          {/* Company Logo Placeholder */}
          <div className="flex-shrink-0 h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Building className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          
          {/* Job Info */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {job.company?.name || "A Reputable Company"}
            </p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {job.title}
            </h2>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-2 space-x-4">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{job.location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={14} />
                <span>{job.employmentType || "Full-time"}</span>
              </div>
            </div>
          </div>
          
          {/* Apply Button */}
          <div className="flex items-center justify-end transition-transform duration-300 group-hover:translate-x-1">
            <ChevronRight className="w-8 h-8 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

// A professional Skeleton Loader for the list view
const SkeletonListItem = () => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg flex items-center space-x-6 animate-pulse">
    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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

  const fetchJobs = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/jobs", { params: { page: pageNum, limit: 8 } }); // Fetch 8 jobs per page for a good list view
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      // Add a small delay for a smoother perceived performance
      setTimeout(() => setLoading(false), 500); 
    }
  }, []);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages && !loading) {
      setPage(newPage);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0B1120] text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
            Current Openings
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Find your next career-defining role. We connect exceptional talent with innovative companies.
          </p>
        </motion.div>
        
        <div className="space-y-6">
          <AnimatePresence>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonListItem key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <JobListItem key={job._id} job={job} index={index} />
              ))
            ) : (
              <p className="col-span-full text-center py-10 text-gray-500">No open positions at this time.</p>
            )}
          </AnimatePresence>
        </div>

        {!loading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center items-center mt-16 space-x-4"
          >
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="outline"
              className="dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Previous
            </Button>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              variant="outline"
              className="dark:bg-gray-800 dark:hover:bg-gray-700"
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