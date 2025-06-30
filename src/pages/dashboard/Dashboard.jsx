import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import {
  FileTextIcon,
  UserIcon,
  BookmarkIcon,
  BriefcaseIcon,
  LayoutDashboardIcon,
  Building2Icon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userResponse, statsResponse] = await Promise.all([
        axiosInstance.get('/users/me'),
        axiosInstance.get('/users/stats')
      ]);

      setUser(userResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
      
      // Redirect to login if unauthorized
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto max-w-md p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg">
          <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dashboard Error</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Already handled by error state
  }

  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';
  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's happening with your account today
          </p>
        </motion.div>

        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 flex flex-wrap gap-4"
          >
            {isCandidate && (
              <>
                <StatBadge
                  value={stats.applicationsCount || 0}
                  label="Applications"
                  icon={<BriefcaseIcon className="w-4 h-4" />}
                  trend={stats.applicationsTrend}
                />
                <StatBadge
                  value={stats.bookmarksCount || 0}
                  label="Bookmarks"
                  icon={<BookmarkIcon className="w-4 h-4" />}
                />
                <StatBadge
                  value={stats.resumeComplete ? 'Complete' : 'Incomplete'}
                  label="Resume Status"
                  icon={stats.resumeComplete ? 
                    <CheckCircleIcon className="w-4 h-4 text-green-500" /> : 
                    <AlertCircleIcon className="w-4 h-4 text-yellow-500" />}
                  status={stats.resumeComplete ? 'success' : 'warning'}
                />
              </>
            )}
            {isEmployer && (
              <>
                <StatBadge
                  value={stats.jobsPosted || 0}
                  label="Active Jobs"
                  icon={<BriefcaseIcon className="w-4 h-4" />}
                />
                <StatBadge
                  value={stats.applicationsReceived || 0}
                  label="New Applications"
                  icon={<FileTextIcon className="w-4 h-4" />}
                />
              </>
            )}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isCandidate && (
          <>
            <DashboardCard
              index={0}
              title="Resume Builder"
              description="Create or update your professional resume"
              icon={<FileTextIcon className="w-6 h-6 text-blue-600" />}
              action={stats?.resumeComplete ? "Update Resume" : "Create Resume"}
              status={stats?.resumeComplete ? 'complete' : 'incomplete'}
              onClick={() => navigate('/resume')}
            />
            <DashboardCard
              index={1}
              title="My Applications"
              description="Track your job applications"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="View Applications"
              count={stats?.applicationsCount}
              onClick={() => navigate('/applications')}
            />
            <DashboardCard
              index={2}
              title="Saved Jobs"
              description="Your bookmarked positions"
              icon={<BookmarkIcon className="w-6 h-6 text-purple-600" />}
              action="View Bookmarks"
              count={stats?.bookmarksCount}
              onClick={() => navigate('/bookmarks')}
            />
            <DashboardCard
              index={3}
              title="AI Career Assistant"
              description="Get personalized job search help"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-pink-600" />}
              action="Try Now"
              onClick={() => navigate('/ai/chat')}
            />
          </>
        )}

        {isEmployer && (
          <>
            <DashboardCard
              index={0}
              title="Company Profile"
              description="Manage your company information"
              icon={<Building2Icon className="w-6 h-6 text-indigo-600" />}
              action="Edit Profile"
              onClick={() => navigate('/companies')}
            />
            <DashboardCard
              index={1}
              title="Post New Job"
              description="Create a new job listing"
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              action="Create Job"
              onClick={() => navigate('/jobs/new')}
            />
            <DashboardCard
              index={2}
              title="Manage Jobs"
              description="View and edit your job postings"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-teal-600" />}
              action="View Jobs"
              count={stats?.jobsPosted}
              onClick={() => navigate('/jobs')}
            />
          </>
        )}

        {isAdmin && (
          <>
            <DashboardCard
              index={0}
              title="User Management"
              description="Manage platform users"
              icon={<UserIcon className="w-6 h-6 text-blue-600" />}
              action="View Users"
              count={stats?.userCount}
              onClick={() => navigate('/admin/users')}
            />
            <DashboardCard
              index={1}
              title="Job Moderation"
              description="Review and approve jobs"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="Manage Jobs"
              count={stats?.jobCount}
              onClick={() => navigate('/admin/jobs')}
            />
            <DashboardCard
              index={2}
              title="Categories"
              description="Manage job categories"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-purple-600" />}
              action="Edit Categories"
              onClick={() => navigate('/admin/categories')}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

const StatBadge = ({ value, label, icon, trend, status }) => {
  const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
  const statusBg = status === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 
                   status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                   'bg-white/70 dark:bg-gray-700/70';

  return (
    <div className={`flex items-center ${statusBg} px-4 py-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700`}>
      <div className="mr-3 p-2 rounded-full bg-white dark:bg-gray-600 shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className="flex items-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mr-2">{value}</p>
          {trend !== undefined && trend !== 0 && (
            <span className={`text-xs ${trendColor} flex items-center`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const DashboardCard = ({ title, description, icon, action, onClick, index, count, status }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border ${
      status === 'complete' ? 'border-green-200 dark:border-green-800' : 
      status === 'incomplete' ? 'border-yellow-200 dark:border-yellow-800' : 
      'border-white/40 dark:border-gray-700'
    } rounded-xl p-6 cursor-pointer transition-all relative group`}
    onClick={onClick}
  >
    {count !== undefined && (
      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
        {count}
      </span>
    )}
    <div className="flex items-start space-x-4 mb-4">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`p-3 rounded-full ${
          status === 'complete' ? 'bg-green-100 dark:bg-green-900/30' : 
          status === 'incomplete' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
          'bg-white dark:bg-gray-700'
        } shadow-sm`}
      >
        {icon}
      </motion.div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
    <Button 
      variant={status === 'incomplete' ? 'destructive' : 'outline'} 
      className="w-full font-medium text-sm group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 transition-colors"
    >
      {action}
    </Button>
  </motion.div>
);

export default Dashboard;