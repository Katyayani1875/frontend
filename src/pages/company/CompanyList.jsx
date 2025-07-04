import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../utils/axios';
import { Building, AlertTriangle, Search, ArrowRight } from 'lucide-react';

// Premium Skeleton Loading Component
const CompanyCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 h-64 animate-pulse overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-gray-800/30 to-transparent -skew-x-12 animate-shimmer" />
    <div className="relative z-10 space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3"></div>
      <div className="absolute bottom-6 left-6 h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </div>
);

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate network delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1200));
        const res = await api.get("/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Could not fetch company data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-2xl shadow-inner"
        >
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">Connection Error</h3>
          <p className="text-red-600 dark:text-red-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70 text-red-700 dark:text-red-300 rounded-full font-medium transition-colors"
          >
            Retry
          </button>
        </motion.div>
      );
    }
    
    if (filteredCompanies.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/20 rounded-2xl shadow-inner"
        >
          <div className="mx-auto w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
            <Building className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {searchQuery ? "No matching companies" : "No Companies Found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {searchQuery ? "Try adjusting your search query" : "There are currently no companies to display"}
          </p>
        </motion.div>
      );
    }

    return (
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredCompanies.map((company) => (
            <motion.li
              key={company._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 dark:from-gray-900/80 dark:to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Company logo placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 mb-4 flex items-center justify-center">
                    <Building className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {company.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                    {company.description || "No description available."}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/company/${company._id}/jobs`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full transition-all duration-200 text-sm font-medium group/view"
                  >
                    View Jobs
                    <ArrowRight className="w-4 h-4 group-hover/view:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Browse Companies
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
            Discover pioneering companies and find your next great career opportunity
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-600 dark:focus:border-indigo-600 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {renderContent()}

        {/* Stats section */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-medium text-indigo-600 dark:text-indigo-400">{filteredCompanies.length}</span> of{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">{companies.length}</span> companies
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CompanyList;