// src/pages/HeroSection.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, ChevronDown } from "lucide-react";
import CountUp from "react-countup";

import JobTitleSearch from "@/components/JobTitleSearch";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      axios
        .get(`/api/jobs/search?q=${encodeURIComponent(query)}`)
        .then((res) => {
          // assume backend returns array of job objects: [{ title: "..." }, ...]
          const titles = res.data.jobs?.map((j) => j.title) || [];
          setSuggestions(titles);
        })
        .catch((err) => {
          console.error("Live search error:", err);
          setSuggestions([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section className="relative bg-gradient-to-b from-white to-[#f9fbff] dark:from-[#0C1A2B] dark:to-[#0C1A2B] py-16 px-4 md:px-20 overflow-hidden transition-colors duration-500">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full blur-3xl opacity-50 z-0" />

      {/* Hero Title */}
      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Discover Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
            Next Opportunity
          </span>
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Match with top companies, get AI-generated career support,
          <br className="hidden md:block" />
          and land your dream job faster.
        </p>
      </div>

      {/* Job Stats */}
      <div className="relative z-10 text-center mt-4 mb-8 text-gray-700 dark:text-gray-400 text-sm md:text-base">
        🔍 <CountUp end={1200} duration={2} />+ jobs available | 👥{" "}
        <CountUp end={300} duration={2} />+ companies hiring now
      </div>

      {/* Search Bar */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center transition-colors duration-500">
        {/* Live Job Title Search */}
        <div className="flex items-center gap-2 flex-1">
          <Search size={18} className="text-gray-500 dark:text-gray-300" />
          <JobTitleSearch
            query={query}
            setQuery={setQuery}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
          />
        </div>

        {/* Location Input */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-1">
          <MapPin size={18} className="text-gray-500 dark:text-gray-300" />
          <input
            placeholder="Location"
            className="bg-transparent w-full outline-none text-sm text-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
          <span className="text-sm text-gray-600 dark:text-gray-200">All Categories</span>
          <ChevronDown size={16} className="text-gray-500 dark:text-gray-300" />
        </div>

        {/* Search Button */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl transition-transform transform hover:scale-105 duration-300">
          Search Jobs
        </button>
      </div>

      {/* Popular Categories */}
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
              key={cat.title}
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
        <div className="mt-6">
          <a
            href="/jobs"
            className="inline-block mt-4 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
          >
            Browse All Jobs
          </a>
        </div>
      </div>

      {/* Top Hiring Companies */}
      <div className="relative z-10 mt-14 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Trusted by top companies
        </p>
        <div className="flex justify-center gap-8 items-center flex-wrap">
          <img
            src="/logos/google.png"
            alt="google"
            className="h-10 object-contain dark:invert"
          />
          <img
            src="/logos/microsoft.png"
            alt="microsoft"
            className="h-10 object-contain dark:invert"
          />
          <img
            src="/logos/tata.png"
            alt="tata"
            className="h-10 object-contain dark:invert"
          />
          <img
            src="/logos/amazon.png"
            alt="amazon"
            className="h-10 object-contain dark:invert"
          />
        </div>
      </div>
    </section>
  );
}
