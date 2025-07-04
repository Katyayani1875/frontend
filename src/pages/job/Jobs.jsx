// src/pages/job/Jobs.jsx

import React, { useEffect, useState, useCallback, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Briefcase, MapPin, Search, X, Loader2, ChevronsRight, Award, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JobService from "@/api/jobApi";
import CategoryService from "@/api/categoryApi";
import { Button } from "@/components/ui/Button";

// --- REFINED & PROFESSIONAL UI COMPONENTS ---

const SearchBar = memo(({ onSearch, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const handleSearchClick = useCallback(() => {
        onSearch(searchTerm);
    }, [onSearch, searchTerm]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    useEffect(() => {
        setSearchTerm(initialSearch || '');
    }, [initialSearch]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="w-full max-w-2xl mx-auto flex items-center gap-2"
        >
            <div className="relative flex-grow">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by title, skill, or keyword"
                    className="w-full h-14 pl-12 pr-4 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <Button
                onClick={handleSearchClick}
                className="h-14 px-8 text-base font-semibold bg-slate-900 dark:bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-slate-700 dark:hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
                Search
            </Button>
        </motion.div>
    );
});

const CategoryFilters = memo(({ categories, selectedSlug, onSelect, loading }) => {
    if (loading) {
        return (
             <div className="flex justify-center flex-wrap gap-x-3 gap-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex justify-center flex-wrap gap-x-3 gap-y-3">
             <Button
                onClick={() => onSelect(null)}
                variant={!selectedSlug ? "default" : "outline"}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${!selectedSlug ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
                All Categories
            </Button>
            {categories.map((category) => (
                <Button
                    key={category._id}
                    onClick={() => onSelect(category.slug)}
                    variant={selectedSlug === category.slug ? "default" : "outline"}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${selectedSlug === category.slug ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    )
})

const JobListItem = memo(({ job, onHover, isActive }) => {
  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={() => onHover(job)}
        className="relative group cursor-pointer"
    >
      <Link to={`/jobs/${job._id}`} className="block">
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 ease-in-out h-full
            ${isActive
              ? 'bg-white dark:bg-slate-800 shadow-xl scale-[1.02] border-indigo-500'
              : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-600 group-hover:shadow-lg'
            }
          `}
        >
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            {job.company?.name || "A Reputable Company"}
          </p>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-snug">
            {job.title}
          </h3>
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs gap-x-4 mt-3">
            <span className="flex items-center"><MapPin size={14} className="mr-1.5" />{job.location || "Remote"}</span>
            <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{job.employmentType || "Full-time"}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

const FeaturedJobDisplay = ({ job }) => {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
        <Briefcase size={40} className="text-slate-400 dark:text-slate-500 mb-4" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-white">Select a Job</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Hover over a job listing on the right to see its details.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div>
        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">{job.company?.name}</p>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">{job.title}</h2>
        <div className="flex items-center gap-x-6 text-slate-500 dark:text-slate-400 text-sm mt-4">
          <div className="flex items-center gap-1.5"><MapPin size={16} />{job.location}</div>
          <div className="flex items-center gap-1.5"><Briefcase size={16} />{job.employmentType}</div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-6 text-base leading-relaxed line-clamp-[10] min-h-[10rem]">{job.description}</p>

        {(job.skills && job.skills.length > 0) && (
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                        <span key={skill} className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-700 dark:text-slate-200">{skill}</span>
                    ))}
                </div>
            </div>
        )}
      </div>
      <div className="mt-auto pt-6">
        <Link to={`/jobs/${job._id}`}>
          <Button size="lg" className="w-full font-bold text-base py-3 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-700 dark:hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
            View Full Details & Apply <ChevronsRight size={18} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// --- SKELETON LOADERS ---

const JobListItemSkeleton = () => (
    <div className="h-[125px] p-6 bg-slate-100/80 dark:bg-slate-800/50 rounded-2xl animate-pulse">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="flex gap-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
    </div>
)

const FeaturedJobSkeleton = () => (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-2 mb-4"></div>
        <div className="flex gap-x-6 mt-4">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="mt-6 space-y-3 flex-grow">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded" style={{width: `${100 - i*5}%`}}></div>
            ))}
        </div>
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
             <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3"></div>
             <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                ))}
            </div>
        </div>
        <div className="mt-auto pt-6">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-full"></div>
        </div>
    </div>
);


// --- MAIN JOBS COMPONENT ---

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
  const selectedCategorySlug = searchParams.get('category');

  const fetchJobsAndCategories = useCallback(async (pageNum, search, categorySlug) => {
    setLoading(true);
    setFeaturedJob(null); // Reset featured job on new search
    try {
        // Fetch categories only once
        if (categories.length === 0) {
            setLoadingCategories(true);
            const fetchedCategories = await CategoryService.fetchAll();
            setCategories(fetchedCategories);
            setLoadingCategories(false);
        }

        // Fetch jobs based on params
        let res;
        const commonParams = { page: pageNum, limit: 12 }; // Increased limit
        if (categorySlug) {
            res = await JobService.fetchByCategory(categorySlug, commonParams);
        } else {
            res = await JobService.fetchJobs({ ...commonParams, search });
        }
        
        setJobs(res.jobs || []);
        setTotalPages(res.totalPages || 1);
        setTotalJobs(res.total || 0);
        setFeaturedJob(res.jobs?.[0] || null);

    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    fetchJobsAndCategories(page, searchTerm, selectedCategorySlug);
  }, [page, searchTerm, selectedCategorySlug, fetchJobsAndCategories]);

  const handleSearch = (searchVal) => {
    setPage(1);
    setSearchParams(prev => {
        const newParams = new URLSearchParams();
        if (searchVal) newParams.set('search', searchVal);
        return newParams;
    });
  };

  const handleCategorySelect = (slug) => {
    setPage(1);
    setSearchParams(prev => {
        const newParams = new URLSearchParams();
        if (slug) newParams.set('category', slug);
        return newParams;
    });
  };

  const MemoizedFeaturedJob = memo(FeaturedJobDisplay);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Header Section */}
        <motion.header 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Next Role</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We meticulously curate opportunities from the world's most innovative companies.
          </p>
        </motion.header>

        {/* Search & Categories */}
        <SearchBar onSearch={handleSearch} initialSearch={searchTerm} />
        <div className="mt-10">
          <CategoryFilters categories={categories} selectedSlug={selectedCategorySlug} onSelect={handleCategorySelect} loading={loadingCategories} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Featured Job Column (Left on Large Screens) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-[calc(100vh-8rem)]">
              <AnimatePresence mode="wait">
                  {loading ? (
                       <FeaturedJobSkeleton key="loading-featured" />
                  ) : (
                       <motion.div
                           key={featuredJob?._id || "empty-featured"}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           transition={{ duration: 0.3 }}
                       >
                           <MemoizedFeaturedJob job={featuredJob} />
                       </motion.div>
                  )}
              </AnimatePresence>
          </div>

          {/* Job List Column (Right on Large Screens) */}
          <div className="lg:col-span-7">
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => <JobListItemSkeleton key={i} />)}
                </div>
            ) : (
                <>
                    {jobs.length > 0 ? (
                        <div className="space-y-4">
                             <AnimatePresence>
                                {jobs.map(job => (
                                    <JobListItem
                                        key={job._id}
                                        job={job}
                                        onHover={setFeaturedJob}
                                        isActive={featuredJob?._id === job._id}
                                    />
                                ))}
                             </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-2xl">
                             <Briefcase size={40} className="mx-auto mb-4 text-slate-400" />
                             <p className="font-semibold text-lg text-slate-700 dark:text-white">No Jobs Found</p>
                             <p className="text-sm mt-1 max-w-sm mx-auto text-slate-500 dark:text-slate-400">
                                 Your search criteria did not match any open positions. Please try a different search or category.
                             </p>
                        </div>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center items-center pt-8 space-x-2">
                            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline">Previous</Button>
                            <span className="font-medium text-slate-700 dark:text-slate-300 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-sm">Page {page} of {totalPages}</span>
                            <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} variant="outline">Next</Button>
                        </div>
                    )}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;