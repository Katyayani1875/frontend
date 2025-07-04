import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Building, DollarSign, ArrowRight, AlertTriangle, ChevronLeft, CalendarDays } from "lucide-react";
import api from "../../utils/axios";

// A utility function to safely format the salary object
const formatSalary = (salary) => {
  if (!salary) return "Not disclosed";
  if (typeof salary === 'string') return salary;
  if (typeof salary === 'object' && salary.amount && salary.currency) {
    return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: salary.currency, minimumFractionDigits: 0 }).format(salary.amount)}`;
  }
  return "Competitive";
};

// Skeleton loader for an elegant loading experience
const CompanyJobsSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-800 h-56 w-full"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-6 h-64">
                        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="block bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                             <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                             <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                             <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


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
        // Mock delay to showcase the skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1200));
        const [companyRes, jobsRes] = await Promise.all([
          api.get(`/companies/${companyId}`),
          api.get(`/jobs/company/${companyId}`)
        ]);
        
        setCompany(companyRes.data.company); // Assuming company data is nested
        setJobs(jobsRes.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load company data. The resource may not be available.");
        console.error("Error fetching company data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  if (loading) {
    return <CompanyJobsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
          <AlertTriangle className="h-16 w-16 mx-auto text-red-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">An Error Occurred</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
          <Link 
            to="/companies" 
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Company Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shadow-md border border-indigo-200 dark:border-indigo-800">
                <Building className="h-12 w-12 text-indigo-600 dark:text-indigo-400"/>
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">CAREERS AT</p>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{company?.name || 'Company'}</h1>
              <p className="mt-1 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                {company?.tagline || `Explore ${jobs.length} open positions and join our team.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Company Info Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About {company?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {company?.description || 'No company description available.'}
              </p>
              <div className="space-y-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center text-gray-600 dark:text-gray-400"><Briefcase size={16} className="mr-3" /><span>{company?.industry || "Not specified"}</span></div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400"><MapPin size={16} className="mr-3" /><span>{company?.headquarters || "Not specified"}</span></div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400"><CalendarDays size={16} className="mr-3" /><span>Founded in {company?.foundedYear || "N/A"}</span></div>
              </div>
            </div>
          </aside>

          {/* Jobs Section */}
          <main className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Open Positions ({jobs.length})</h2>
            {jobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800/50 p-8 rounded-xl shadow-sm text-center border border-gray-200 dark:border-gray-700/50">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No Openings Right Now</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Please check back later for new opportunities.</p>
              </div>
            ) : (
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {jobs.map((job) => (
                  <motion.div key={job._id} variants={itemVariants}>
                    <Link 
                      to={`/jobs/${job._id}`} 
                      className="group block bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 border border-gray-200 dark:border-gray-700/50 hover:-translate-y-1"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                            {job.title}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full mt-2 sm:mt-0">
                          {job.employmentType || 'Full-time'}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center"><MapPin size={14} className="mr-1.5" />{job.location || 'Remote'}</div>
                        <div className="flex items-center"><DollarSign size={14} className="mr-1.5" />{formatSalary(job.salary)}</div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                          View Details <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>
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

