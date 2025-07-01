import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BriefcaseIcon, MapPinIcon, Building2, Globe, ArrowRight, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import api from '../../utils/axios';

// --- Reusable Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

// --- Skeleton Loader Component for a better UX ---
const SkeletonLoader = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
    {/* Hero Skeleton */}
    <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-2xl mb-12 flex items-center gap-8">
      <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0"></div>
      <div className="flex-grow space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
    </div>
    {/* Jobs Grid Skeleton */}
    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl space-y-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 ml-auto mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

// --- Individual Job Card Component ---
const JobCard = ({ job }) => (
  <motion.div variants={itemVariants}>
    <Link to={`/jobs/${job._id}`} className="group block">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {job.title}
        </h3>
        <div className="flex-grow mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span>{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4 flex-shrink-0" />
            <span>{job.employmentType || "Full-time"}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
          <span className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            View Details
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const CompanyDetails = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // The logic remains the same, no changes needed here.
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      setLoading(true); // Set loading to true at the start of fetch
      try {
        const res = await api.get(`/jobs/company/${companyId}`);
        const jobsData = res.data.jobs || []; // Ensure jobsData is an array
        setJobs(jobsData);
        if (jobsData.length > 0) {
          setCompany(jobsData[0].company);
        } else {
          // If no jobs, we might need to fetch company data separately
          // For now, we'll handle this case gracefully in the UI
          const companyRes = await api.get(`/company/${companyId}`); // Assumes a /company/:id endpoint exists
          setCompany(companyRes.data.company);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompany(null); // Set company to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyJobs();
  }, [companyId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <Inbox className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Company Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          We couldn't find the company you're looking for.
        </p>
        <Link to="/companies" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Browse All Companies
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-slate-50 dark:bg-slate-900 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* --- Company Hero Section --- */}
        <motion.div
          className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-12"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center rounded-xl shadow-lg">
              <span className="text-5xl font-bold text-white">{company.name.charAt(0)}</span>
            </div>
            <div className="flex-grow">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                {company.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                {company.description || "A leader in its industry, committed to innovation and excellence."}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                {company.location && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{company.website}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Open Positions Section --- */}
        <motion.h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8" variants={itemVariants}>
          Open Positions ({jobs.length})
        </motion.h2>

        {jobs.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center text-center bg-white dark:bg-slate-800/50 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"
            variants={itemVariants}
          >
            <Inbox className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No Openings Right Now</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
              {company.name} doesn't have any open positions at the moment. Check back later or browse other companies.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {jobs.map((job) => (
              <JobCard job={job} key={job._id} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyDetails;
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { BriefcaseIcon, MapPinIcon } from "lucide-react";
// import api from '../../utils/axios';  

// const CompanyDetails = () => {
//   const { companyId } = useParams();
//   const [company, setCompany] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCompanyJobs = async () => {
//     try {
//       const res = await api.get(`/jobs/company/${companyId}`);
//       const jobsData = res.data.jobs;
//       setJobs(jobsData);
//       if (jobsData.length > 0) {
//         setCompany(jobsData[0].company); // assuming all jobs have same company info
//       }
//     } catch (error) {
//       console.error("Error fetching company jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanyJobs();
//   }, [companyId]);

//   if (loading) {
//     return <p className="text-center text-gray-500 py-8">Loading company details...</p>;
//   }

//   if (!company) {
//     return <p className="text-center text-gray-500 py-8">Company not found or no jobs posted yet.</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4">{company.name}</h1>

//       <p className="mb-8 text-gray-700 dark:text-gray-300">
//         Explore open positions from {company.name}.
//       </p>

//       <h2 className="text-2xl font-semibold mb-4">Open Jobs</h2>

//       {jobs.length === 0 ? (
//         <p className="text-gray-500">No jobs currently posted by this company.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           {jobs.map((job) => (
//             <Link to={`/jobs/${job._id}`} key={job._id}>
//               <div className="p-4 border rounded-lg hover:shadow transition">
//                 <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
//                 <div className="mt-1 flex items-center text-sm text-gray-500 gap-2">
//                   <MapPinIcon className="w-4 h-4" />
//                   <span>{job.location || "Remote"}</span>
//                 </div>
//                 <div className="mt-1 flex items-center text-sm text-gray-500 gap-2">
//                   <BriefcaseIcon className="w-4 h-4" />
//                   <span>{job.employmentType || "Full-time"}</span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyDetails;
