import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  FileTextIcon,
  UserIcon,
  BookmarkIcon,
  BriefcaseIcon,
  LayoutDashboardIcon,
  Building2Icon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/users/me');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!user) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;

  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';
  const isAdmin = user.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Your personalized dashboard</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isCandidate && (
          <>
            <DashboardCard
              index={0}
              title="Resume"
              icon={<FileTextIcon className="w-6 h-6 text-blue-600" />}
              action="Upload or View"
              onClick={() => navigate('/resume')}
            />
            <DashboardCard
              index={1}
              title="My Applications"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="View Applications"
              onClick={() => navigate('/applications')}
            />
            <DashboardCard
              index={2}
              title="Bookmarked Jobs"
              icon={<BookmarkIcon className="w-6 h-6 text-purple-600" />}
              action="View Bookmarks"
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
              onClick={() => navigate('/ai/smart-job-post')}
            />
            <DashboardCard
              index={2}
              title="Posted Jobs"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-teal-600" />}
              action="Manage Jobs"
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
              onClick={() => navigate('/admin/users')}
            />
            <DashboardCard
              index={1}
              title="Jobs"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              action="Manage Jobs"
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

const DashboardCard = ({ title, icon, action, onClick, index }) => (
  <motion.div
    custom={index}
    initial="hidden"
    animate="visible"
    variants={cardVariants}
    whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/40 dark:border-gray-700 shadow-md rounded-2xl p-6 cursor-pointer transition-transform"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4 mb-4 group">
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="p-3 rounded-full bg-white shadow-inner dark:bg-gray-700"
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
