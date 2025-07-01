// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileText, Bookmark, BrainCircuit, Briefcase, Building2, Users, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';

// --- Skeleton Components ---

const StatCardSkeleton = () => (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 flex items-center space-x-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex-1 space-y-2">
            <div className="h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
    </div>
);

const ActionCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg h-full flex flex-col p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex-1 space-y-2">
                 <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
                 <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
        </div>
        <div className="flex-grow my-2 space-y-3">
            <div className="h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
            <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700 mt-auto"></div>
    </div>
);


// --- UI Components ---

const DashboardStatCard = ({ icon, value, label, color, linkTo }) => (
    <Link to={linkTo} className="block">
        <motion.div 
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            whileHover={{ scale: 1.03 }}
        >
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
        </motion.div>
    </Link>
);

const DashboardActionCard = ({ icon, title, description, linkTo, linkLabel, children }) => (
    <motion.div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg h-full flex flex-col p-6">
        <div className="flex items-center space-x-4 mb-4">
            <div className="flex-shrink-0 text-indigo-500">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
        <div className="flex-grow my-2">
            {children}
        </div>
        <Link to={linkTo} className="mt-auto text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center group">
            {linkLabel}
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
    </motion.div>
);

// --- Main Dashboard Component ---

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ applications: 0, bookmarks: 0 });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  
  // Separate loading states for progressive UI rendering
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Fetch user first for a quick initial render of the header
      try {
        const userRes = await axiosInstance.get('/users/me');
        const userData = userRes.data.data;
        setUser(userData);
        setLoadingUser(false); // User loaded, header can now render

        // 2. If user is a candidate, fetch the heavier data
        if (userData.role === 'candidate') {
          const [appsRes, bookmarksRes] = await Promise.all([
            axiosInstance.get('/applications/my-applications').catch(e => ({ data: [] })), // Prevent one failure from stopping all
            axiosInstance.get('/bookmarks').catch(e => ({ data: [] }))
          ]);
          
          setStats({ applications: appsRes.data.length, bookmarks: bookmarksRes.data.length });
          setRecentApplications(appsRes.data.slice(0, 3));
          setRecentBookmarks(bookmarksRes.data.slice(0, 3));
        }

      } catch (err) {
        console.error("Dashboard: Failed to fetch data, redirecting to login.", err);
        navigate('/login');
      } finally {
        // All data loading is complete
        setLoadingData(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);
  
  const isCandidate = user?.role === 'candidate';
  const isEmployer = user?.role === 'employer';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <AnimatePresence>
                {loadingUser ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-12 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-6 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.name}</span>
                        </h1>
                        <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">Here's your personalized command center.</p>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {/* Candidate View */}
          {isCandidate && (
            <>
              {/* Stat Cards */}
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" variants={containerVariants}>
                {loadingData ? (
                    <> <StatCardSkeleton/> <StatCardSkeleton/> <StatCardSkeleton/> </>
                ) : (
                    <>
                        <motion.div variants={itemVariants}>
                          <DashboardStatCard icon={<FileText className="w-6 h-6 text-white"/>} value={stats.applications} label="Applications Submitted" color="bg-green-500" linkTo="/applications" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DashboardStatCard icon={<Bookmark className="w-6 h-6 text-white"/>} value={stats.bookmarks} label="Jobs Saved" color="bg-purple-500" linkTo="/bookmarks" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <DashboardStatCard icon={<UserCheck className="w-6 h-6 text-white"/>} value="Manage" label="Your Profile" color="bg-blue-500" linkTo="/profile" />
                        </motion.div>
                    </>
                )}
              </motion.div>

              {/* Action Cards */}
              <motion.div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" variants={containerVariants}>
                {loadingData ? (
                    <> <ActionCardSkeleton/> <ActionCardSkeleton/> <ActionCardSkeleton/> </>
                ) : (
                    <>
                        <motion.div variants={itemVariants}>
                            <DashboardActionCard title="My Applications" description="Keep track of your active applications" icon={<Briefcase size={24}/>} linkTo="/applications" linkLabel="View all applications">
                                <ul className="space-y-3">
                                    {recentApplications.length > 0 ? recentApplications.map(app => (
                                        <li key={app._id} className="text-sm text-slate-600 dark:text-slate-300 flex justify-between items-center"><span>{app.job?.title || 'Job Title'}</span><span className="capitalize text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{app.status}</span></li>
                                    )) : <p className="text-sm text-slate-400">No recent applications.</p>}
                                </ul>
                            </DashboardActionCard>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <DashboardActionCard title="Saved Jobs" description="Review positions you're interested in" icon={<Bookmark size={24}/>} linkTo="/bookmarks" linkLabel="View all bookmarks">
                                <ul className="space-y-3">
                                    {recentBookmarks.length > 0 ? recentBookmarks.map(bm => (
                                    <li key={bm._id} className="text-sm text-slate-600 dark:text-slate-300">{bm.title} at {bm.company?.name || 'a company'}</li>
                                    )) : <p className="text-sm text-slate-400">No saved jobs yet.</p>}
                                </ul>
                            </DashboardActionCard>
                        </motion.div>
                        <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-1">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl h-full flex flex-col text-white">
                                <BrainCircuit size={32} className="mb-4"/>
                                <h3 className="text-2xl font-bold">AI Career Assistant</h3>
                                <p className="mt-2 text-indigo-200 flex-grow">Get personalized job recommendations, resume feedback, and interview prep.</p>
                                <Button asChild size="lg" className="mt-6 bg-white text-indigo-600 hover:bg-indigo-100 font-bold w-full">
                                    <Link to="/ai/recommend-jobs">Activate Assistant</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
              </motion.div>
            </>
          )}

          {/* Employer View */}
          {isEmployer && !loadingUser && (
             <motion.div className="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" variants={containerVariants}>
                 <motion.div variants={itemVariants}>
                    <DashboardActionCard title="Company Profile" icon={<Building2 size={24}/>} description="Manage your company's public face" linkTo="/company/profile" linkLabel="Edit company profile">
                      <p className="text-sm text-slate-500">Keep your details up-to-date to attract the best talent.</p>
                    </DashboardActionCard>
                 </motion.div>
                 <motion.div variants={itemVariants}>
                    <DashboardActionCard title="Post a New Job" icon={<Briefcase size={24}/>} description="Create a new listing to find talent" linkTo="/jobs/new" linkLabel="Create new job">
                       <p className="text-sm text-slate-500">Reach thousands of qualified candidates by posting a job today.</p>
                    </DashboardActionCard>
                 </motion.div>
                 <motion.div variants={itemVariants}>
                    <DashboardActionCard title="Manage Applicants" icon={<Users size={24}/>} description="Review candidates for your roles" linkTo="/employer/applicants" linkLabel="View all applicants">
                       <p className="text-sm text-slate-500">See who has applied to your open positions.</p>
                    </DashboardActionCard>
                 </motion.div>
             </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
// // src/pages/dashboard/Dashboard.jsx
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/Button';
// import { FileTextIcon, UserIcon, BookmarkIcon, BriefcaseIcon, LayoutDashboardIcon, Building2Icon } from 'lucide-react';
// import { motion } from 'framer-motion';
// import axiosInstance from '../../utils/axiosInstance'; // Use the correct, configured instance

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         // --- THIS IS THE FIX: Only fetch the user's profile ---
//         const res = await axiosInstance.get('/users/me');
//         setUser(res.data.data); // The user object is inside res.data.data
//       } catch (err) {
//         console.error("Dashboard: Failed to fetch user profile, redirecting to login.", err);
//         navigate('/login');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserProfile();
//   }, [navigate]);

//   if (loading || !user) {
//     return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;
//   }
  
//   const isCandidate = user.role === 'candidate';
//   const isEmployer = user.role === 'employer';

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
//         <p className="text-gray-600">Your personalized dashboard</p>
//       </div>

//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//         {isCandidate && (
//           <>
//             <DashboardCard
//               title="My Applications"
//               icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
//               description="Track your job applications"
//               action="View Applications"
//               onClick={() => navigate('/applications')}
//             />
//             <DashboardCard
//               title="Saved Jobs"
//               icon={<BookmarkIcon className="w-6 h-6 text-purple-600" />}
//               description="Your bookmarked positions"
//               action="View Bookmarks"
//               onClick={() => navigate('/bookmarks')}
//             />
//             <DashboardCard
//               title="AI Assistant"
//               icon={<LayoutDashboardIcon className="w-6 h-6 text-pink-600" />}
//               description="Get personalized career help"
//               action="Try Now"
//               onClick={() => navigate('/ai/recommend-jobs')}
//             />
//           </>
//         )}

//         {isEmployer && (
//            <>
//             <DashboardCard
//               title="Company Profile"
//               icon={<Building2Icon className="w-6 h-6 text-indigo-600" />}
//               description="Manage your company information"
//               action="Edit Profile"
//               onClick={() => navigate('/company/profile')}
//             />
//             <DashboardCard
//               title="Post a Job"
//               icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
//               description="Create a new job listing"
//               action="Create Job"
//               onClick={() => navigate('/jobs/new')}
//             />
//            </>
//         )}
//       </div>
//     </div>
//   );
// };

// // This sub-component does not need changes
// const DashboardCard = ({ title, description, icon, action, onClick }) => (
//     <motion.div
//         whileHover={{ scale: 1.05 }}
//         className="bg-white/80 p-6 rounded-xl shadow-sm cursor-pointer"
//         onClick={onClick}
//     >
//         <div className="flex items-start space-x-4">
//             <div className="p-3 bg-white rounded-full shadow-inner">{icon}</div>
//             <div>
//                 <h2 className="text-xl font-bold text-gray-900">{title}</h2>
//                 <p className="text-sm text-gray-500 mt-1">{description}</p>
//             </div>
//         </div>
//         <Button variant="outline" className="w-full mt-4">{action}</Button>
//     </motion.div>
// );

// export default Dashboard;