import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
import api from '../../utils/axios';  

const CompanyDetails = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyJobs = async () => {
    try {
      const res = await api.get(`/jobs/company/${companyId}`);
      const jobsData = res.data.jobs;
      setJobs(jobsData);
      if (jobsData.length > 0) {
        setCompany(jobsData[0].company); // assuming all jobs have same company info
      }
    } catch (error) {
      console.error("Error fetching company jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [companyId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading company details...</p>;
  }

  if (!company) {
    return <p className="text-center text-gray-500 py-8">Company not found or no jobs posted yet.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">{company.name}</h1>

      <p className="mb-8 text-gray-700 dark:text-gray-300">
        Explore open positions from {company.name}.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Open Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs currently posted by this company.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id}>
              <div className="p-4 border rounded-lg hover:shadow transition">
                <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500 gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{job.location || "Remote"}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-500 gap-2">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{job.employmentType || "Full-time"}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
