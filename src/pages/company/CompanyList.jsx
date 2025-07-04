import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../utils/axios'; // Assuming this is your configured axios instance
import { Building, AlertTriangle } from 'lucide-react';

// Skeleton component for a beautiful loading experience
const CompanyCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 h-48 animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        <div className="absolute bottom-6 left-6 h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
);

// The main CompanyList component, redesigned and focused.
const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using a mock delay to showcase the beautiful skeleton loader
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        const res = await api.get("/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Could not fetch company data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-semibold text-red-800 dark:text-red-300">An Error Occurred</h3>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      );
    }
    
    if (companies.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-100 dark:bg-gray-800/30 rounded-lg">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">No Companies Found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There are currently no companies to display.</p>
            </div>
        )
    }

    return (
      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {companies.map((company) => (
            <motion.li
              key={company._id}
              variants={itemVariants}
              className="relative bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl p-6 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1"
            >
              <div className="flex flex-col justify-between h-36">
                <div>
                  <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                    {company.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-1 h-10">
                    {company.description || "No description available."}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to={`/company/${company._id}/jobs`}
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-medium"
                  >
                    View Jobs
                  </Link>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    );
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight">Browse Companies</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 text-center max-w-2xl mx-auto">Discover pioneering companies and find your next great career opportunity.</p>
        </motion.div>
        
        {renderContent()}

      </main>
    </div>
  );
};

export default CompanyList;
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from '../../utils/axios';

// const CompanyList = () => {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCompanies = async () => {
//     try {
//       const res = await api.get("/companies");
//       setCompanies(res.data);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   if (loading) {
//     return (
//       <p className="text-center py-8 text-gray-500">Loading companies...</p>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-6 text-center">Browse Companies</h1>
//       <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {companies.map((company) => (
//           <li
//             key={company._id}
//             className="border p-4 rounded-lg hover:shadow transition flex flex-col justify-between h-48"
//           >
//             <div>
//               <Link
//                 to={`/company/${company._id}`}
//                 className="text-blue-600 hover:underline text-lg font-semibold block mb-2"
//               >
//                 {company.name}
//               </Link>
//               {company.description && (
//                 <p className="text-gray-600 text-sm line-clamp-2">{company.description}</p>
//               )}
//             </div>
//             <div className="mt-4">
//               <Link to={`/company/${company._id}/jobs`}>
//                 <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 text-sm">
//                   View Jobs
//                 </button>
//               </Link>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default CompanyList;
