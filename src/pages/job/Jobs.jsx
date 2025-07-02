import React, { useEffect, useState, useCallback, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Briefcase, MapPin, Search, X, Loader2, ChevronsRight, Award, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JobService from "@/api/jobApi";
import CategoryService from "@/api/categoryApi";
import { Button } from "@/components/ui/Button";

// --- New Components / Enhanced Existing Ones ---

// SearchBar Component
const SearchBar = ({ onSearch, initialSearch, initialLocation }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [locationTerm, setLocationTerm] = useState(initialLocation || '');

    const handleSearchClick = () => {
        onSearch(searchTerm, locationTerm);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setLocationTerm('');
        onSearch('', ''); // Trigger a search with empty terms
    };

    // Keep internal state in sync with external initial values (URL params)
    useEffect(() => {
        setSearchTerm(initialSearch || '');
    }, [initialSearch]);

    useEffect(() => {
        setLocationTerm(initialLocation || '');
    }, [initialLocation]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4 relative z-10 backdrop-blur-sm"
        >
            <div className="flex flex-1 w-full gap-3">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Job title, keywords..."
                        className="w-full py-3 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Location (e.g., Remote, NYC)"
                        className="w-full py-3 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
            <Button
                onClick={handleSearchClick}
                className="w-full md:w-auto h-auto py-3 px-8 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all rounded-xl shadow-md"
            >
                Search Jobs
            </Button>
            {(searchTerm || locationTerm) && (
                <Button
                    onClick={clearSearch}
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 md:relative md:top-auto md:right-auto text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                >
                    <X size={20} />
                </Button>
            )}
        </motion.div>
    );
};


// Job List Item Component (Enhanced)
const JobListItem = memo(({ job, onHover, isActive }) => {
  return (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => onHover(job)}
        className="relative group cursor-pointer"
    >
      <Link to={`/jobs/${job._id}`} className="block">
        <div
          className={`p-5 rounded-xl border-2 transition-all duration-300 ease-in-out
            ${isActive
              ? 'bg-white dark:bg-slate-800 shadow-2xl translate-x-0 border-indigo-500 ring-2 ring-indigo-500/30'
              : 'bg-white/70 dark:bg-slate-800/40 border-transparent group-hover:bg-white dark:group-hover:bg-slate-800/70 group-hover:border-indigo-400 group-hover:shadow-lg'
            }
            flex flex-col h-full
          `}
        >
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            {job.company?.name || "A Reputable Company"}
          </p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center text-slate-500 dark:text-slate-400 text-sm gap-x-4 gap-y-1 flex-grow">
            <span className="flex items-center"><MapPin size={14} className="mr-1.5 flex-shrink-0" />{job.location || "Remote"}</span>
            <span className="flex items-center"><Briefcase size={14} className="mr-1.5 flex-shrink-0" />{job.employmentType || "Full-time"}</span>
            {job.salaryRange && ( // Assuming salaryRange is available
              <span className="flex items-center"><DollarSign size={14} className="mr-1.5 flex-shrink-0" />{job.salaryRange}</span>
            )}
          </div>
          {isActive && (
              <motion.div layoutId="active-job-indicator" className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-xl" />
          )}
        </div>
      </Link>
    </motion.div>
  );
});

// Featured Job Display Component (Enhanced)
const FeaturedJobDisplay = ({ job }) => {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 shadow-xl">
        <Search size={48} className="text-indigo-400 dark:text-indigo-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Jobs Selected</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">Hover over a job on the left to see its details here.</p>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">Or try a different search or category.</p>
      </div>
    );
  }

  const skills = job.skills || []; // Ensure skills is an array

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="flex-grow">
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">{job.company?.name}</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">{job.title}</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400 text-base mt-4">
          <div className="flex items-center gap-1.5"><MapPin size={18} />{job.location}</div>
          <div className="flex items-center gap-1.5"><Briefcase size={18} />{job.employmentType}</div>
          {job.salaryRange && (
             <div className="flex items-center gap-1.5"><DollarSign size={18} />{job.salaryRange}</div>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-6 text-lg leading-relaxed line-clamp-[9] md:line-clamp-[12] min-h-[10rem] overflow-hidden">{job.description}</p>

        {skills.length > 0 && (
            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                    <Award size={18} className="text-amber-500" /> Core Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                    <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300 transform transition-transform hover:scale-105 shadow-sm">{skill}</span>
                    ))}
                </div>
            </div>
        )}
      </div>
      <div className="mt-auto pt-8">
        <Link to={`/jobs/${job._id}`}>
          <Button size="lg" className="w-full font-bold text-lg py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
            View Full Details & Apply <ChevronsRight size={20} className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Skeleton Loader for FeaturedJobDisplay
const FeaturedJobDisplaySkeleton = () => (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-2 mb-4"></div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="mt-6 space-y-3 flex-grow">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-11/12"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-10/12"></div>
        </div>
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
            <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                ))}
            </div>
        </div>
        <div className="mt-auto pt-8">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
        </div>
    </div>
);


// Main Jobs Component
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [featuredJob, setFeaturedJob] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const locationTerm = searchParams.get('location') || '';
  const selectedCategorySlug = searchParams.get('category');

  // Function to fetch all categories
  const fetchAllCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const fetchedCategories = await CategoryService.fetchAll();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Modify fetchJobs to handle search, location, and category
  const fetchJobs = useCallback(async (pageNum, search, location, categorySlug) => {
    setLoading(true);
    try {
      let res;
      const commonParams = { page: pageNum, limit: 10 };

      if (categorySlug) {
        res = await JobService.fetchByCategory(categorySlug, commonParams);
      } else {
        const params = {
          ...commonParams,
          ...(search && { search: `"${search}"` }),
          ...(location && { location: `"${location}"` }),
        };
        res = await JobService.fetchJobs(params);
      }

      setJobs(res.jobs || []);
      setTotalPages(res.totalPages || 1);
      setTotalJobs(res.total || 0);
      setFeaturedJob(res.jobs?.[0] || null);

    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setTotalPages(1);
      setTotalJobs(0);
      setFeaturedJob(null);
    } finally {
      setTimeout(() => setLoading(false), 500); // Simulate network latency for smoother UX
    }
  }, []);

  // Effect to fetch all categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Effect to trigger job fetching when page, searchTerm, locationTerm, or selectedCategorySlug changes
  useEffect(() => {
    // Reset page to 1 if any filter (search, location, or category) changes from its initial/default state
    // AND the current page is not already 1.
    // This prevents re-fetching with old page number on new filter
    if (page !== 1 && (searchTerm || locationTerm || selectedCategorySlug)) {
        // Check if the current URL params are different from what would result from page 1
        const currentSearchParams = new URLSearchParams(window.location.search);
        currentSearchParams.set('page', '1');
        const expectedUrl = currentSearchParams.toString();
        if (window.location.search !== `?${expectedUrl}` && window.location.search !== `?${expectedUrl}&`) {
            setPage(1); // Only reset page if it's not already 1 and a filter is active
            return; // Skip immediate fetch, it will re-trigger on page state update
        }
    }
    fetchJobs(page, searchTerm, locationTerm, selectedCategorySlug);
  }, [page, searchTerm, locationTerm, selectedCategorySlug, fetchJobs]);


  // Handler for search bar submission
  const handleSearchBarSubmit = (searchVal, locationVal) => {
    setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams);
        if (searchVal) newParams.set('search', searchVal); else newParams.delete('search');
        if (locationVal) newParams.set('location', locationVal); else newParams.delete('location');
        newParams.delete('category'); // Clear category filter when searching
        newParams.set('page', 1);
        return newParams;
    });
  };

  // Handler for category clicks
  const handleCategoryClick = (categorySlug) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      if (categorySlug) {
        newParams.set('category', categorySlug);
        newParams.delete('search'); // Clear search term when category is selected
        newParams.delete('location'); // Clear location term when category is selected
      } else {
        newParams.delete('category');
      }
      newParams.set('page', 1);
      return newParams;
    });
  };

  // Handler for clearing all filters (search, location, and category)
  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 min-h-screen relative overflow-hidden">
        {/* Subtle background gradients/blobs for aesthetic */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                    {/* Dynamically change the title based on active filter */}
                    {selectedCategorySlug
                        ? (categories.find(cat => cat.slug === selectedCategorySlug)?.name || 'Category') + ' Jobs'
                        : (searchTerm || locationTerm)
                            ? 'Search Results'
                            : <>Find Your <span className="text-indigo-600 dark:text-indigo-400 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Next Role</span></>
                    }
                </h1>
                <p className="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                   {selectedCategorySlug
                      ? <>Explore <span className="font-bold text-slate-900 dark:text-white">{totalJobs}</span> opportunities in "{categories.find(cat => cat.slug === selectedCategorySlug)?.name || selectedCategorySlug}"</>
                      : (searchTerm || locationTerm)
                          ? <>Found <span className="font-bold text-slate-900 dark:text-white">{totalJobs}</span> {totalJobs === 1 ? 'job' : 'jobs'} matching your criteria.</>
                          : "We meticulously curate opportunities from the world's most innovative companies."
                   }
                </p>
            </motion.div>

            {/* Search Bar */}
            <SearchBar
                onSearch={handleSearchBarSubmit}
                initialSearch={searchTerm}
                initialLocation={locationTerm}
            />

            {(searchTerm || locationTerm || selectedCategorySlug) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-8"
                >
                    <Button
                        onClick={clearAllFilters}
                        variant="ghost"
                        className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full px-6 py-2 shadow-sm"
                    >
                        <X size={16} className="mr-2" /> Clear All Filters
                    </Button>
                </motion.div>
            )}

            {/* Category Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="my-16 text-center"
            >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Explore by Category</h3>
                {loadingCategories ? (
                    <div className="flex justify-center flex-wrap gap-3">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="h-10 w-32 bg-slate-200/80 dark:bg-slate-800/50 rounded-full animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button
                            onClick={() => handleCategoryClick(null)}
                            variant={!selectedCategorySlug && !searchTerm && !locationTerm ? "default" : "outline"}
                            className={`${(!selectedCategorySlug && !searchTerm && !locationTerm) ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'} rounded-full px-5 py-2 text-base font-semibold transition-all duration-200`}
                        >
                            All Categories
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category._id}
                                onClick={() => handleCategoryClick(category.slug)}
                                variant={selectedCategorySlug === category.slug ? "default" : "outline"}
                                className={`${selectedCategorySlug === category.slug ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'} rounded-full px-5 py-2 text-base font-semibold transition-all duration-200`}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-12">
                <div className="lg:sticky lg:top-24 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar pr-2">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <FeaturedJobDisplaySkeleton key="featured-loading" />
                        ) : (
                            <motion.div
                                key={featuredJob?._id || 'empty-featured'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <FeaturedJobDisplay job={featuredJob} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="h-[140px] bg-slate-200/80 dark:bg-slate-800/50 rounded-xl animate-pulse shadow-md"></div>
                        ))
                    ) : (
                        <AnimatePresence>
                            {jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <JobListItem
                                        key={job._id}
                                        job={job}
                                        onHover={setFeaturedJob}
                                        isActive={featuredJob?._id === job._id}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800/40 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
                                >
                                    <Search size={48} className="mx-auto mb-4 text-indigo-400" />
                                    <p className="font-semibold text-lg">No Jobs Found</p>
                                    <p className="text-sm mt-1 max-w-sm mx-auto">
                                        {searchTerm || locationTerm || selectedCategorySlug
                                            ? `No results for "${searchTerm || selectedCategorySlug || locationTerm}". Try different keywords or categories.`
                                            : "Currently no open positions match your search criteria. Please check back later."
                                        }
                                    </p>
                                    {(searchTerm || locationTerm || selectedCategorySlug) && (
                                        <Button
                                            onClick={clearAllFilters}
                                            variant="outline"
                                            className="mt-6 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full"
                                        >
                                            Reset Filters
                                        </Button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}

                    {!loading && totalPages > 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex justify-center items-center pt-8 space-x-2"
                        >
                            <Button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                variant="ghost"
                                className="text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                Previous
                            </Button>
                            <span className="font-medium text-slate-700 dark:text-slate-300 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                variant="ghost"
                                className="text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                Next
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Jobs;
// import React, { useEffect, useState, useCallback, memo } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import { Briefcase, MapPin, Search } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import JobService from "@/api/jobApi";
// import CategoryService from "@/api/categoryApi"; // <--- NEW: Import CategoryService
// import { Button } from "@/components/ui/Button";

// // Job List Item Component (No changes needed)
// const JobListItem = memo(({ job, onHover, isActive }) => {
//   return (
//     <div onMouseEnter={() => onHover(job)} className="relative group">
//       <Link to={`/jobs/${job._id}`} className="block">
//         <div 
//           className={`p-5 rounded-xl border-2 transition-all duration-300 ease-in-out
//             ${isActive 
//               ? 'bg-white dark:bg-slate-800 shadow-2xl -translate-x-2 border-indigo-500 ring-2 ring-indigo-500/30' 
//               : 'bg-white/80 dark:bg-slate-800/40 border-transparent group-hover:bg-white dark:group-hover:bg-slate-800/70 group-hover:border-indigo-400 group-hover:shadow-lg'
//             }`
//           }
//         >
//           <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
//             {job.company?.name || "A Reputable Company"}
//           </p>
//           <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
//             {job.title}
//           </h3>
//           <div className="flex flex-wrap items-center text-slate-500 dark:text-slate-400 text-sm mt-3 gap-x-4 gap-y-1">
//             <span className="flex items-center"><MapPin size={14} className="mr-1.5 flex-shrink-0" />{job.location || "Remote"}</span>
//             <span className="flex items-center"><Briefcase size={14} className="mr-1.5 flex-shrink-0" />{job.employmentType || "Full-time"}</span>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// });

// // Featured Job Display Component (No changes needed)
// const FeaturedJobDisplay = ({ job }) => {
//   if (!job) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700">
//         <Search size={48} className="text-indigo-400 dark:text-indigo-500 mb-4" />
//         <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Jobs Found</h3>
//         <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">There are no open positions matching your criteria. Try a different search.</p>
//       </div>
//     );
//   }
  
//   const skills = job.skills || ['React', 'Node.js', 'MongoDB'];

//   return (
//     <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
//       <div className="flex-grow">
//         <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">{job.company?.name}</p>
//         <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 leading-tight">{job.title}</h2>
//         <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400 text-sm mt-4">
//           <div className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</div>
//           <div className="flex items-center gap-1.5"><Briefcase size={16} />{job.employmentType}</div>
//         </div>
//         <p className="text-slate-600 dark:text-slate-300 mt-6 text-base leading-relaxed line-clamp-4">{job.description}</p>
//         <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
//           <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Core Skills</h4>
//           <div className="flex flex-wrap gap-2">
//             {skills.map(skill => (
//               <span key={skill} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">{skill}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="mt-auto pt-8">
//         <Link to={`/jobs/${job._id}`}>
//           <Button size="lg" className="w-full font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white">View Full Details & Apply</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// // Main Jobs Component
// const Jobs = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalJobs, setTotalJobs] = useState(0);
//   const [featuredJob, setFeaturedJob] = useState(null);
  
//   // New state for categories
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   // Use useSearchParams for both search term and category
//   const [searchParams, setSearchParams] = useSearchParams();
//   const searchTerm = searchParams.get('search');
//   const selectedCategorySlug = searchParams.get('category'); // Get the selected category slug

//   // Function to fetch all categories
//   const fetchAllCategories = useCallback(async () => {
//     setLoadingCategories(true);
//     try {
//       const fetchedCategories = await CategoryService.fetchAll();
//       setCategories(fetchedCategories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       // Optionally show a toast error for categories here
//     } finally {
//       setLoadingCategories(false);
//     }
//   }, []);

//   // Modify fetchJobs to conditionally call fetchJobs or fetchByCategory
//   const fetchJobs = useCallback(async (pageNum, search, categorySlug) => {
//     setLoading(true);
//     try {
//       let res;
//       if (categorySlug) {
//         // If a category slug is present, use the dedicated category endpoint
//         res = await JobService.fetchByCategory(categorySlug, { page: pageNum, limit: 10 });
//       } else {
//         // Otherwise, use the general fetchJobs endpoint
//         const params = {
//           page: pageNum,
//           limit: 10,
//           ...(search && { search: `"${search}"` }), // Exact phrase matching for general search
//         };
//         res = await JobService.fetchJobs(params);
//       }
      
//       setJobs(res.jobs || []);
//       setTotalPages(res.totalPages || 1);
//       setTotalJobs(res.total || 0);
//       setFeaturedJob(res.jobs?.[0] || null);

//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       // Optionally set a state to show an error message in the UI
//       setJobs([]); // Clear jobs on error
//       setTotalPages(1);
//       setTotalJobs(0);
//       setFeaturedJob(null);
//     } finally {
//       setTimeout(() => setLoading(false), 300); // Simulate loading time
//     }
//   }, []); // Dependencies for useCallback: none because params are passed directly

//   // Effect to fetch all categories on component mount
//   useEffect(() => {
//     fetchAllCategories();
//   }, [fetchAllCategories]);

//   // Effect to trigger job fetching when page, searchTerm, or selectedCategorySlug changes
//   useEffect(() => {
//     // If a filter (search or category) is active, and page is not 1, reset page to 1
//     // This prevents being stuck on page 3 of a previous filter when a new filter is applied.
//     if (page !== 1 && (searchTerm || selectedCategorySlug)) {
//         setPage(1); // Reset page to 1
//     } else {
//         // Fetch jobs with current page, search term, and category slug
//         fetchJobs(page, searchTerm, selectedCategorySlug);
//     }
//   }, [page, searchTerm, selectedCategorySlug, fetchJobs]);

//   // Handler for category clicks
//   const handleCategoryClick = (categorySlug) => {
//     setSearchParams(prevParams => {
//       const newParams = new URLSearchParams(prevParams);
//       if (categorySlug) {
//         newParams.set('category', categorySlug);
//         newParams.delete('search'); // Clear search term when category is selected
//       } else {
//         newParams.delete('category'); // Clear category filter
//       }
//       newParams.set('page', 1); // Reset to first page when category changes
//       return newParams;
//     });
//   };

//   // Handler for clearing all filters (search and category)
//   const clearAllFilters = () => {
//     setSearchParams(new URLSearchParams()); // Clear all params
//     setPage(1); // Reset page
//   };
  
//   return (
//     <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
//         <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-16">
//                 <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
//                     {/* Dynamically change the title based on active filter */}
//                     {selectedCategorySlug 
//                         ? categories.find(cat => cat.slug === selectedCategorySlug)?.name + ' Jobs'
//                         : searchTerm 
//                             ? 'Search Results' 
//                             : <>Find Your <span className="text-indigo-500">Next Role</span></>
//                     }
//                 </h1>
//                 <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
//                    {selectedCategorySlug
//                       ? <>Showing <span className="font-bold text-slate-800 dark:text-white">{totalJobs}</span> opportunities in "{categories.find(cat => cat.slug === selectedCategorySlug)?.name || selectedCategorySlug}"</>
//                       : searchTerm 
//                           ? <>Found <span className="font-bold text-slate-800 dark:text-white">{totalJobs}</span> {totalJobs === 1 ? 'job' : 'jobs'} for "{searchTerm}"</>
//                           : "We meticulously curate opportunities from the world's most innovative companies."
//                    }
//                 </p>
//                 {(searchTerm || selectedCategorySlug) && (
//                     <Button 
//                         onClick={clearAllFilters} 
//                         variant="ghost" 
//                         className="mt-6 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700"
//                     >
//                         Clear Filters
//                     </Button>
//                 )}
//             </motion.div>

//             {/* Category Filter Section */}
//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 transition={{ duration: 0.5, delay: 0.2 }} 
//                 className="mb-12 text-center"
//             >
//                 <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Explore by Category</h3>
//                 {loadingCategories ? (
//                     <div className="flex justify-center gap-3">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                             <div key={i} className="h-8 w-24 bg-slate-200/80 dark:bg-slate-800/50 rounded-full animate-pulse"></div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="flex flex-wrap justify-center gap-3">
//                         <Button 
//                             onClick={() => handleCategoryClick(null)}
//                             variant={!selectedCategorySlug && !searchTerm ? "default" : "outline"} // Default if no category/search
//                             className={`${(!selectedCategorySlug && !searchTerm) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'} rounded-full px-4 py-2 text-sm font-semibold`}
//                         >
//                             All Categories
//                         </Button>
//                         {categories.map((category) => (
//                             <Button 
//                                 key={category._id} 
//                                 onClick={() => handleCategoryClick(category.slug)}
//                                 variant={selectedCategorySlug === category.slug ? "default" : "outline"}
//                                 className={`${selectedCategorySlug === category.slug ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'} rounded-full px-4 py-2 text-sm font-semibold`}
//                             >
//                                 {category.name}
//                             </Button>
//                         ))}
//                     </div>
//                 )}
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
//                 <div className="lg:sticky lg:top-24">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={featuredJob?._id || 'empty'}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                             transition={{ duration: 0.35, ease: "easeInOut" }}
//                         >
//                             <FeaturedJobDisplay job={featuredJob} />
//                         </motion.div>
//                     </AnimatePresence>
//                 </div>

//                 <div className="space-y-4">
//                     {loading ? (
//                         Array.from({ length: 5 }).map((_, i) => (
//                             <div key={i} className="h-[124px] bg-slate-200/80 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
//                         ))
//                     ) : jobs.length > 0 ? (
//                         jobs.map((job) => (
//                             <JobListItem 
//                                 key={job._id} 
//                                 job={job} 
//                                 onHover={setFeaturedJob} 
//                                 isActive={featuredJob?._id === job._id} 
//                             />
//                         ))
//                     ) : (
//                         <div className="text-center py-16 text-slate-500 bg-white dark:bg-slate-800/40 rounded-xl">
//                             <Search size={48} className="mx-auto mb-4 text-indigo-400" />
//                             <p className="font-semibold">No jobs found</p>
//                             <p className="text-sm mt-1">
//                                 {searchTerm || selectedCategorySlug
//                                     ? `No results for "${searchTerm || selectedCategorySlug}". Try different keywords or categories.`
//                                     : "Currently no open positions. Please check back later."
//                                 }
//                             </p>
//                         </div>
//                     )}

//                     {!loading && totalPages > 1 && (
//                         <div className="flex justify-center items-center pt-8 space-x-2">
//                             <Button 
//                                 onClick={() => setPage(p => Math.max(1, p - 1))} 
//                                 disabled={page === 1} 
//                                 variant="ghost"
//                             >
//                                 Previous
//                             </Button>
//                             <span className="font-medium text-slate-700 dark:text-slate-300 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md">
//                                 Page {page} of {totalPages}
//                             </span>
//                             <Button 
//                                 onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
//                                 disabled={page === totalPages} 
//                                 variant="ghost"
//                             >
//                                 Next
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Jobs;