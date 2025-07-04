// src/pages/job/Jobs.jsx
import React, { useEffect, useState, useCallback, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Briefcase, MapPin, Search, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JobService from "@/api/jobApi";
import CategoryService from "@/api/categoryApi";
import { Button } from "@/components/ui/Button";

// --- PREMIUM UI COMPONENTS ---

const SearchBar = memo(({ onSearch, initialSearch }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    const handleSearchClick = useCallback(() => {
        onSearch(searchTerm);
    }, [onSearch, searchTerm]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    useEffect(() => {
        setSearchTerm(initialSearch || '');
    }, [initialSearch]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto"
        >
            <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search job titles, skills, or keywords..."
                    className="w-full h-16 pl-14 pr-32 text-base bg-white border border-slate-200 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    onClick={handleSearchClick}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                    Search
                </Button>
            </div>
        </motion.div>
    );
});

const CategoryFilters = memo(({ categories, selectedSlug, onSelect, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center flex-wrap gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-10 w-28 bg-slate-100 rounded-full animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex justify-center flex-wrap gap-2">
            <Button
                onClick={() => onSelect(null)}
                variant={!selectedSlug ? "default" : "outline"}
                className={`rounded-full px-5 h-10 text-sm font-medium ${!selectedSlug ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
                All Categories
            </Button>
            {categories.map((category) => (
                <Button
                    key={category._id}
                    onClick={() => onSelect(category.slug)}
                    variant={selectedSlug === category.slug ? "default" : "outline"}
                    className={`rounded-full px-5 h-10 text-sm font-medium ${selectedSlug === category.slug ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
});

const JobListItem = memo(({ job, onHover, isActive }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => onHover(job)}
            className="relative group"
        >
            <Link to={`/jobs/${job._id}`} className="block">
                <div
                    className={`p-5 rounded-xl border transition-all duration-300 h-full
                        ${isActive
                            ? 'bg-white shadow-lg border-blue-500'
                            : 'bg-white border-slate-200 group-hover:bg-slate-50 group-hover:border-slate-300 group-hover:shadow-md'
                        }
                    `}
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Briefcase size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 leading-tight">
                                {job.title}
                            </h3>
                            <p className="text-sm text-blue-600 mt-1">
                                {job.company?.name || "Leading Company"}
                            </p>
                            <div className="flex items-center text-slate-500 text-sm gap-x-4 mt-2">
                                <span className="flex items-center"><MapPin size={14} className="mr-1.5" />{job.location || "Remote"}</span>
                                <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{job.employmentType || "Full-time"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});

const FeaturedJobDisplay = ({ job }) => {
    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Briefcase size={40} className="text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Select a Job</h3>
                <p className="text-slate-500 mt-1 max-w-xs">Hover over a job listing to see details</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col overflow-hidden">
            <div className="p-6 pb-0">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Briefcase size={24} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
                        <p className="text-blue-600 font-medium">{job.company?.name}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-600 text-sm mb-6">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-slate-400" />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Briefcase size={16} className="text-slate-400" />
                        {job.employmentType}
                    </div>
                </div>
                
                <div className="prose prose-sm text-slate-600 mb-6">
                    <p>{job.description}</p>
                </div>
            </div>
            
            {(job.skills && job.skills.length > 0) && (
                <div className="px-6 pt-4 pb-6 border-t border-slate-100">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map(skill => (
                            <span key={skill} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-auto p-6 pt-0">
                <Link to={`/jobs/${job._id}`}>
                    <Button className="w-full h-12 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm">
                        View Full Details & Apply <ChevronsRight size={18} className="ml-1" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

// --- SKELETON LOADERS ---

const JobListItemSkeleton = () => (
    <div className="p-5 bg-white rounded-xl border border-slate-200 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg"></div>
            <div className="w-full space-y-2">
                <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="flex gap-4">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    </div>
);

const FeaturedJobSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col animate-pulse">
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="h-6 bg-slate-100 rounded w-48"></div>
                    <div className="h-4 bg-slate-100 rounded w-32"></div>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="h-4 bg-slate-100 rounded w-24"></div>
                <div className="h-4 bg-slate-100 rounded w-24"></div>
            </div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 bg-slate-100 rounded" style={{width: `${100 - i*10}%`}}></div>
                ))}
            </div>
        </div>
        <div className="px-6 pt-4 pb-6 border-t border-slate-100">
            <div className="h-4 bg-slate-100 rounded w-24 mb-3"></div>
            <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-slate-100 rounded-full"></div>
                ))}
            </div>
        </div>
        <div className="p-6 pt-0">
            <div className="h-12 bg-slate-100 rounded-lg"></div>
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
        setFeaturedJob(null);
        try {
            if (categories.length === 0) {
                setLoadingCategories(true);
                const fetchedCategories = await CategoryService.fetchAll();
                setCategories(fetchedCategories);
                setLoadingCategories(false);
            }

            let res;
            const commonParams = { page: pageNum, limit: 10 };
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
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-12">
                {/* Premium Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Find Your Next <span className="text-blue-600">Opportunity</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We meticulously curate opportunities from the world's most innovative companies.
                    </p>
                </header>

                {/* Search & Categories */}
                <div className="mb-12">
                    <SearchBar onSearch={handleSearch} initialSearch={searchTerm} />
                    <div className="mt-8">
                        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Explore by Category
                        </h2>
                        <CategoryFilters 
                            categories={categories} 
                            selectedSlug={selectedCategorySlug} 
                            onSelect={handleCategorySelect} 
                            loading={loadingCategories} 
                        />
                    </div>
                </div>

                {/* Job Listings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job List Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <JobListItemSkeleton key={i} />)
                        ) : jobs.length > 0 ? (
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
                        ) : (
                            <div className="text-center py-16 bg-slate-50 rounded-xl">
                                <Briefcase size={40} className="mx-auto mb-4 text-slate-400" />
                                <p className="font-semibold text-slate-700">No Jobs Found</p>
                                <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Featured Job Column */}
                    <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <FeaturedJobSkeleton key="loading-featured" />
                            ) : (
                                <motion.div
                                    key={featuredJob?._id || "empty-featured"}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MemoizedFeaturedJob job={featuredJob} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        <Button 
                            onClick={() => setPage(p => Math.max(1, p - 1))} 
                            disabled={page === 1} 
                            variant="outline" 
                            className="px-5 h-10"
                        >
                            Previous
                        </Button>
                        <span className="font-medium text-slate-700 px-4 py-2 rounded-md text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <Button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                            disabled={page === totalPages} 
                            variant="outline" 
                            className="px-5 h-10"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;