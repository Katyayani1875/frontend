import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiExternalLink, FiChevronLeft } from "react-icons/fi";
import api from "../../utils/axios";

const CompanyJobs = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [companyRes, jobsRes] = await Promise.all([
          api.get(`/companies/${companyId}`),
          api.get(`/jobs/company/${companyId}`)
        ]);
        
        setCompany(companyRes.data);
        setJobs(jobsRes.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load company data");
        console.error("Error fetching company data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium">{error}</p>
          <Link 
            to="/companies" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiChevronLeft className="mr-1" /> Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-blue-600">
                  {company?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">Jobs at {company?.name || 'Company'}</h1>
              <p className="mt-2 text-lg text-blue-100 max-w-3xl">
                {company?.tagline || "Explore career opportunities"}
              </p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center text-blue-100">
                  <FiBriefcase className="mr-2" />
                  <span>{jobs.length} open positions</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <FiMapPin className="mr-2" />
                  <span>{company?.headquarters || "Global locations"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About {company?.name || 'the company'}</h2>
                <p className="text-gray-600 mb-6">
                  {company?.description || 'No company description available.'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiBriefcase className="mr-3 text-gray-400" />
                    <span>{company?.industry || "Industry not specified"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-3 text-gray-400" />
                    <span>{company?.headquarters || "Location not specified"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiClock className="mr-3 text-gray-400" />
                    <span>Founded {company?.foundedYear || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Open Positions</h2>
              <span className="text-sm text-gray-500">{jobs.length} jobs available</span>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <p className="text-gray-500 mb-4">No current job openings at {company?.name || 'this company'}</p>
                <Link 
                  to="/companies" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiChevronLeft className="mr-1" /> Browse Other Companies
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link 
                    to={`/jobs/${job._id}`} 
                    key={job._id}
                    className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold text-blue-600 mb-2">{job.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiMapPin className="mr-2 text-gray-400" />
                        <span>{job.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <FiBriefcase className="mr-2 text-gray-400" />
                        <span>{job.type || 'Employment type not specified'}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <FiDollarSign className="mr-2 text-gray-400" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                      {job.description || 'No job description provided.'}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <span className="inline-flex items-center text-sm text-blue-600">
                        View details <FiExternalLink className="ml-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobs;
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { BriefcaseIcon, MapPinIcon } from "lucide-react";
// import api from "../../utils/axios";

// const CompanyJobs = () => {
//   const { companyId } = useParams();
//   const [companyJobs, setCompanyJobs] = useState([]);
//   const [companyName, setCompanyName] = useState("Company");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchCompanyJobs = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get(`/jobs/company/${companyId}`);
//       const jobs = res.data.jobs || [];
//       setCompanyJobs(jobs);

//       if (jobs.length > 0) {
//         // Support both populated company or just companyId with name
//         const name =
//           jobs[0]?.company?.name ||
//           jobs[0]?.companyId?.name ||
//           "Company";
//         setCompanyName(name);
//       }
//     } catch (err) {
//       console.error("Error fetching company jobs:", err);
//       setError("Failed to load jobs. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyJobs();
//   }, [companyId]);

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
//         Jobs at {companyName}
//       </h1>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : companyJobs.length === 0 ? (
//         <p className="text-center text-gray-500">No jobs found for this company.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {companyJobs.map((job) => (
//             <Link to={`/jobs/${job._id}`} key={job._id}>
//               <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition duration-200 hover:scale-[1.01]">
//                 <h2 className="text-xl font-semibold text-blue-600">
//                   {job.title || "Untitled Job"}
//                 </h2>
//                 <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
//                   <MapPinIcon className="w-4 h-4" />
//                   <span>{job.location || "Remote"}</span>
//                 </div>
//                 <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
//                   <BriefcaseIcon className="w-4 h-4" />
//                   <span>{job.type || "Full-time"}</span>
//                 </div>
//                 <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
//                   {job.description || "No job description provided."}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyJobs;

