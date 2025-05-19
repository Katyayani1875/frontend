// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Search, MapPin, ChevronDown } from "lucide-react";
import CountUp from "react-countup";
import JobTitleSearch from "@/components/JobTitleSearch";
import HeroCarousel from "@/components/HeroCarousel";
import { fetchJobs } from "@/api/jobApi";
import HowItWorks from "@/components/HowItworks";
//new changes
import { fetchBookmarks, addBookmark, removeBookmark } from "@/api/jobApi";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "react-hot-toast";
//end new changes

export default function Home() {
  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState("");
  const [jobs, setJobs] = useState([]);
  const [debouncedJobTitle, setDebouncedJobTitle] = useState(jobTitle);
  const [playMarquee, setPlayMarquee] = useState(true);
  const [bookmarks, setBookmarks] = useState([]); //new changes
  

//newchange
useEffect(() => {
  const getBookmarks = async () => {
    const res = await fetchBookmarks();
    setBookmarks(res.map((b) => b.job._id));
  };
  getBookmarks();
}, []);
//end new changes

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedJobTitle(jobTitle);
    }, 500);
    return () => clearTimeout(handler);
  }, [jobTitle]);

 // After fetching jobs in the useEffect:
useEffect(() => {
  const search = async () => {
    if (debouncedJobTitle || category) {
      try {
        const results = await fetchJobs({
          title: debouncedJobTitle,
          location: "", // Removed location from the search
          category,
        });

        // ✅ CORRECTED RESPONSE HANDLING
        if (results && Array.isArray(results.jobs)) {
          setJobs(results.jobs);
        } else {
          setJobs([]);
          console.warn("Unexpected jobs response:", results);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    } else {
      setJobs([]);
    }
  };

  search();
}, [debouncedJobTitle, category]);

// Removed location dependency

  useEffect(() => {
    const duration = 10000;
    const timer = setTimeout(() => setPlayMarquee(false), duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-[#0C1A2B] dark:to-[#0C1A2B] py-16 px-4 md:px-20 transition-colors duration-500">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl opacity-40 z-0" />

      {/* Hero Text */}
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

        {/* Removed Location Input */}

        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            All Categories
          </span>
          <ChevronDown size={16} className="text-gray-500 dark:text-gray-300" />
        </div>

        <button
          onClick={() => setDebouncedJobTitle(jobTitle)}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300"
        >
          Search Jobs
        </button>
      </div>

      {/* Categories */}
      <div className="relative z-10 mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { title: "IT", icon: "💻", slug: "it" },
            { title: "Finance", icon: "💰", slug: "finance" },
            { title: "Design", icon: "🎨", slug: "design" },
            { title: "Marketing", icon: "📣", slug: "marketing" },
          ].map((cat) => (
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
        <Marquee gradient={false} speed={40} pauseOnHover className="overflow-hidden">
          <div className="flex gap-10 items-center">
            {[
              "google", "microsoft", "tata", "amazon", "wipro",
              "flipkart", "Loreal", "deloitte", "myntra"
            ].map((name) => (
              <img
                key={name}
                src={`/logos/${name}.png`}
                alt={name}
                className="h-10 object-contain"
              />
            ))}
          </div>
        </Marquee>
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

        {/* Browse All CTA */}
        <div className="mt-8">
          <a
            href="/jobs"
            className=" mb-4 inline-block px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
          >
            Browse All Jobs
          </a>
        </div>
      </div>

       <div className="max-w-5xl mx-auto">
          <HowItWorks />
        </div>



      {/* Job Results */}
      {/* {jobs.length > 0 && (
        <div className="relative z-10 mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Job Results
          </h2>
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {job.title}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company?.name || "Unknown Company"} • {job.location}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">
                    {job.category}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )} */}
  {jobs.length > 0 && (
  <div className="relative z-10 mt-20 max-w-5xl mx-auto">
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
      Job Results
    </h2>
    <ul className="space-y-4">
      {jobs.map((job) => {
        const isBookmarked = bookmarks.includes(job._id);

        const toggleBookmark = async () => {
          try {
            if (isBookmarked) {
              await removeBookmark(job._id);
              setBookmarks((prev) => prev.filter((id) => id !== job._id));
              toast.success("Bookmark removed");
            } else {
              await addBookmark(job._id);
              setBookmarks((prev) => [...prev, job._id]);
              toast.success("Bookmark added");
            }
          } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
          }
        };

        return (
          <li
            key={job._id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-col"
          >
            <div className="flex justify-between items-start">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {job.title}
              </span>

              <button
                onClick={toggleBookmark}
                className="text-blue-600 dark:text-blue-400 hover:scale-110 transition"
                aria-label="Toggle Bookmark"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {job.company?.name || "Unknown Company"} • {job.location}
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">
                {job.category}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
)}


    </section>
  );
}