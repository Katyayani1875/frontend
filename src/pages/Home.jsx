// frontend/job-ui/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { ChevronDown, Bookmark, BookmarkCheck } from "lucide-react";
import CountUp from "react-countup";
import { toast } from "react-hot-toast";

// Components
import JobTitleSearch from "@/components/JobTitleSearch";
import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowItworks";

// Services
import JobService from "@/api/jobApi";

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState([]);
  const [debouncedJobTitle, setDebouncedJobTitle] = useState(jobTitle);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMarquee, setShowMarquee] = useState(true);

  // Constants
  const popularCategories = [
    { title: "IT", icon: "💻", slug: "it" },
    { title: "Finance", icon: "💰", slug: "finance" },
    { title: "Design", icon: "🎨", slug: "design" },
    { title: "Marketing", icon: "📣", slug: "marketing" },
  ];

  const companyLogos = [
    "google", "microsoft", "tata", "amazon", 
    "wipro", "flipkart", "Loreal", "deloitte", "myntra"
  ];

  // Fetch bookmarks on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarkedJobs = await JobService.bookmarks.fetchAll();
        setBookmarks(bookmarkedJobs.map(job => job._id));
      } catch (error) {
        console.log("Bookmarks not loaded - user may not be authenticated");
      }
    };
    fetchBookmarks();
  }, []);

  // Debounce job title search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedJobTitle(jobTitle);
    }, 500);
    return () => clearTimeout(handler);
  }, [jobTitle]);

  // Fetch jobs when filters change
  useEffect(() => {
    const fetchJobsData = async () => {
      if (!debouncedJobTitle && !category) {
        setJobs([]);
        return;
      }

      setIsLoading(true);
      try {
        const { jobs } = await JobService.fetchJobs({
          title: debouncedJobTitle,
          category,
          page: 1,
          limit: 10
        });
        setJobs(jobs);
      } catch (error) {
        toast.error("Failed to load jobs");
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsData();
  }, [debouncedJobTitle, category]);

  // Hide marquee after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowMarquee(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const toggleBookmark = async (jobId) => {
    try {
      if (bookmarks.includes(jobId)) {
        await JobService.bookmarks.remove(jobId);
        setBookmarks(prev => prev.filter(id => id !== jobId));
        toast.success("Bookmark removed");
      } else {
        await JobService.bookmarks.add(jobId);
        setBookmarks(prev => [...prev, jobId]);
        toast.success("Bookmark added");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login to bookmark jobs");
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-[#0C1A2B] dark:to-[#0C1A2B] py-16 px-4 md:px-20 transition-colors duration-500">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl opacity-40 z-0" />

      {/* Hero Section */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discover Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Next Opportunity
          </span>
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Match with top companies, get AI career support, and land your dream job faster.
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-10 text-center mt-4 mb-10 text-gray-700 dark:text-gray-400 text-sm md:text-base">
        🔍 <CountUp end={1200} duration={2} />+ jobs | 👥{" "}
        <CountUp end={300} duration={2} />+ companies hiring now
      </div>

      {/* Search Bar */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <JobTitleSearch
            value={jobTitle}
            onChange={setJobTitle}
            onSelect={setJobTitle}
          />
        </div>

        <div 
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
          onClick={() => toast("Coming soon! Category filter will be available soon")}
        >
          <span className="text-sm text-gray-600 dark:text-gray-200">
            All Categories
          </span>
          <ChevronDown size={16} className="text-gray-500 dark:text-gray-300" />
        </div>

        <button
          onClick={() => setDebouncedJobTitle(jobTitle)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search Jobs"}
        </button>
      </div>

      {/* Categories */}
      <div className="relative z-10 mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {popularCategories.map((cat) => (
            <a
              key={cat.slug}
              href={`/jobs/category/${cat.slug}`}
              className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="text-3xl">{cat.icon}</div>
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-medium">
                {cat.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Company Logos */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-20">
        <h2 className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Trusted by top companies
        </h2>
        {showMarquee && (
          <Marquee gradient={false} speed={40} pauseOnHover className="overflow-hidden">
            <div className="flex gap-10 items-center">
              {companyLogos.map((name) => (
                <img
                  key={name}
                  src={`/logos/${name}.png`}
                  alt={name}
                  className="h-10 object-contain"
                  loading="lazy"
                />
              ))}
            </div>
          </Marquee>
        )}
      </div>

      {/* Carousel Section */}
      <div className="relative z-10 mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Find Your Perfect Job
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto mb-10">
          Explore opportunities tailored to your skills. AI support + real-time updates = faster hiring.
        </p>
        <div className="max-w-5xl mx-auto">
          <HeroCarousel />
        </div>

        <div className="mt-8">
          <a
            href="/jobs"
            className="mb-4 inline-block px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
          >
            Browse All Jobs
          </a>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-5xl mx-auto">
        <HowItWorks />
      </div>

      {/* Job Results */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading jobs...</p>
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="relative z-10 mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Job Results ({jobs.length})
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {job.company?.name || "Unknown Company"} • {job.location}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(job._id)}
                    className="text-blue-600 dark:text-blue-400 hover:scale-110 transition"
                    aria-label={bookmarks.includes(job._id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    {bookmarks.includes(job._id) ? (
                      <BookmarkCheck className="w-5 h-5 fill-current" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                  <a 
                    href={`/jobs/${job._id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}