import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
import api from "../../utils/axios";

const CompanyJobs = () => {
  const { companyId } = useParams();
  const [companyJobs, setCompanyJobs] = useState([]);
  const [companyName, setCompanyName] = useState("Company");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCompanyJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/jobs/company/${companyId}`);
      const jobs = res.data.jobs || [];
      setCompanyJobs(jobs);

      if (jobs.length > 0) {
        // Support both populated company or just companyId with name
        const name =
          jobs[0]?.company?.name ||
          jobs[0]?.companyId?.name ||
          "Company";
        setCompanyName(name);
      }
    } catch (err) {
      console.error("Error fetching company jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Jobs at {companyName}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : companyJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found for this company.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyJobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id}>
              <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition duration-200 hover:scale-[1.01]">
                <h2 className="text-xl font-semibold text-blue-600">
                  {job.title || "Untitled Job"}
                </h2>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{job.location || "Remote"}</span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{job.type || "Full-time"}</span>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {job.description || "No job description provided."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
