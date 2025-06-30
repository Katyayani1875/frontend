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
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        axiosInstance.get('/users/me'),
        axiosInstance.get('/users/stats')
      ]);
      setUser(userRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load dashboard. Redirecting...
      </div>
    );
  }

  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';
  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Your personalized dashboard</p>
        
        {/* Stats Overview */}
        {stats.applicationsCount >= 0 && (
          <div className="flex gap-4 mt-4">
            {isCandidate && (
              <>
                <StatBadge 
                  value={stats.applicationsCount} 
                  label="Applications" 
                  icon={<BriefcaseIcon className="w-4 h-4" />}
                />
                <StatBadge
                  value={stats.bookmarksCount}
                  label="Bookmarks"
                  icon={<BookmarkIcon className="w-4 h-4" />}
                />
              </>
            )}
            {isEmployer && (
              <StatBadge
                value={stats.jobsPosted}
                label="Jobs Posted"
                icon={<BriefcaseIcon className="w-4 h-4" />}
              />
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isCandidate && (
          <>
            <DashboardCard
              index={0}
              title="Resume"
              icon={<FileTextIcon className="w-6 h-6 text-blue-600" />}
              action="Upload or View"
              count={stats.resumeComplete ? '✓' : '!'}
              onClick={() => navigate('/resume')}
            />
            <DashboardCard
              index={1}
              title="My Applications"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="View Applications"
              count={stats.applicationsCount}
              onClick={() => navigate('/applications')}
            />
            <DashboardCard
              index={2}
              title="Bookmarked Jobs"
              icon={<BookmarkIcon className="w-6 h-6 text-purple-600" />}
              action="View Bookmarks"
              count={stats.bookmarksCount}
              onClick={() => navigate('/bookmarks')}
            />
            <DashboardCard
              index={3}
              title="AI Assistant"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-pink-600" />}
              action="Open AI Tools"
              onClick={() => navigate('/ai/chat')}
            />
          </>
        )}

        {isEmployer && (
          <>
            <DashboardCard
              index={0}
              title="Company Profile"
              icon={<Building2Icon className="w-6 h-6 text-indigo-600" />}
              action="Manage Profile"
              onClick={() => navigate('/companies')}
            />
            <DashboardCard
              index={1}
              title="Post a Job"
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              action="Create Job"
              onClick={() => navigate('/jobs/new')}
            />
            <DashboardCard
              index={2}
              title="Posted Jobs"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-teal-600" />}
              action="Manage Jobs"
              count={stats.jobsPosted}
              onClick={() => navigate('/jobs')}
            />
          </>
        )}

        {isAdmin && (
          <>
            <DashboardCard
              index={0}
              title="Users"
              icon={<UserIcon className="w-6 h-6 text-blue-600" />}
              action="Manage Users"
              count={stats.userCount}
              onClick={() => navigate('/admin/users')}
            />
            <DashboardCard
              index={1}
              title="Jobs"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="Manage Jobs"
              count={stats.jobCount}
              onClick={() => navigate('/admin/jobs')}
            />
            <DashboardCard
              index={2}
              title="Categories"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-purple-600" />}
              action="Manage Categories"
              onClick={() => navigate('/admin/categories')}
            />
          </>
        )}
      </div>
    </div>
  );
};

const StatBadge = ({ value, label, icon }) => (
  <div className="flex items-center bg-white/70 dark:bg-gray-700/70 px-3 py-2 rounded-lg shadow-sm">
    <span className="mr-2 text-gray-500 dark:text-gray-300">{icon}</span>
    <span className="font-medium text-gray-900 dark:text-white">
      {value} <span className="text-sm text-gray-500">{label}</span>
    </span>
  </div>
);

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

const DashboardCard = ({ title, icon, action, onClick, index, count }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-white/40 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-all relative"
    onClick={onClick}
  >
    {count !== undefined && (
      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
        {count}
      </span>
    )}
    <div className="flex items-center space-x-4 mb-4">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="p-3 rounded-full bg-white shadow-sm dark:bg-gray-700"
      >
        {icon}
      </motion.div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <Button variant="outline" className="w-full font-medium text-sm">
      {action}
    </Button>
  </motion.div>
);

export default Dashboard;