// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileTextIcon, UserIcon, BookmarkIcon, BriefcaseIcon, LayoutDashboardIcon, Building2Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance'; // Use the correct, configured instance

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // --- THIS IS THE FIX: Only fetch the user's profile ---
        const res = await axiosInstance.get('/users/me');
        setUser(res.data.data); // The user object is inside res.data.data
      } catch (err) {
        console.error("Dashboard: Failed to fetch user profile, redirecting to login.", err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  if (loading || !user) {
    return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;
  }
  
  const isCandidate = user.role === 'candidate';
  const isEmployer = user.role === 'employer';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
        <p className="text-gray-600">Your personalized dashboard</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isCandidate && (
          <>
            <DashboardCard
              title="My Applications"
              icon={<BriefcaseIcon className="w-6 h-6 text-green-600" />}
              description="Track your job applications"
              action="View Applications"
              onClick={() => navigate('/applications')}
            />
            <DashboardCard
              title="Saved Jobs"
              icon={<BookmarkIcon className="w-6 h-6 text-purple-600" />}
              description="Your bookmarked positions"
              action="View Bookmarks"
              onClick={() => navigate('/bookmarks')}
            />
            <DashboardCard
              title="AI Assistant"
              icon={<LayoutDashboardIcon className="w-6 h-6 text-pink-600" />}
              description="Get personalized career help"
              action="Try Now"
              onClick={() => navigate('/ai/recommend-jobs')}
            />
          </>
        )}

        {isEmployer && (
           <>
            <DashboardCard
              title="Company Profile"
              icon={<Building2Icon className="w-6 h-6 text-indigo-600" />}
              description="Manage your company information"
              action="Edit Profile"
              onClick={() => navigate('/company/profile')}
            />
            <DashboardCard
              title="Post a Job"
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              description="Create a new job listing"
              action="Create Job"
              onClick={() => navigate('/jobs/new')}
            />
           </>
        )}
      </div>
    </div>
  );
};

// This sub-component does not need changes
const DashboardCard = ({ title, description, icon, action, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/80 p-6 rounded-xl shadow-sm cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-full shadow-inner">{icon}</div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
        <Button variant="outline" className="w-full mt-4">{action}</Button>
    </motion.div>
);

export default Dashboard;