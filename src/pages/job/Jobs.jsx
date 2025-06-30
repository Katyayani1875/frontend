import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { BriefcaseIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";

const categoryFilters = [
  { name: "Software Development", icon: "💻" },
  { name: "Data Science", icon: "📊" },
  { name: "Graphic Design", icon: "🎨" },
  { name: "Marketing", icon: "📢" },
  { name: "Finance", icon: "💰" },
];

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, query };
      const res = await axiosInstance.get("/jobs", { params });
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      setError("Error fetching jobs, please try again later.");
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [query, page]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleCategoryClick = (category) => {
    setQuery(category);
    setPage(1);
    setActiveCategory(category);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Job Opportunities</h1>
          <p className="mt-2 text-lg text-gray-500">Find your next great opportunity.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Search by title, company, keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10 rounded-md"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white rounded-md py-2 px-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            >
              Search
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-start gap-2 mt-4">
            {categoryFilters.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                  activeCategory === cat.name ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-center text-red-500 mb-6">{error}</div>}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mb-10">
            <div className="w-10 h-10 border-4 border-t-4 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Recommended Jobs Section */}
        {!loading && jobs.length > 0 && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 inline-flex items-center gap-2">
              Recommended Jobs
              <span className="relative inline-block">
                <span className="text-gray-800 text-2xl font-semibold border border-yellow-700 rounded-full px-4 py-1 animate-glow shadow-sm">
                  FOR YOU
                </span>
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Looking for the best? Here are the top-rated jobs by our community.
            </p>
          </div>
        )}

        {/* Job Listings - Grid Layout */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">No jobs found matching your criteria.</p>
            ) : (
              jobs.map((job) => (
                <motion.div
                  key={job._id}
                  className="bg-white rounded-md shadow-md hover:shadow-lg transition duration-200 flex flex-col justify-between"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-indigo-700 line-clamp-2 mb-2">{job.title}</h2>
                    <p className="text-gray-600 text-sm mb-2">{job.company?.name || job.companyName || "A Reputable Company"}</p>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <BriefcaseIcon className="w-4 h-4 mr-1" />
                      <span>{job.type || "Full-time"}</span>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
                  </div>
                  <div className="border-t border-gray-200 p-4">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="block w-full text-center bg-indigo-500 text-white rounded-md py-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 py-2 rounded-md ${
                page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
              } mr-2`}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-2 rounded-md ${
                page === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
              } ml-2`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;