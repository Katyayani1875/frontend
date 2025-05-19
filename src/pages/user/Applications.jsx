import { useEffect, useState } from 'react';
import api from '../../utils/axios'; // <-- use your custom axios instance here
import Loader from '../../components/shared/Loader';
import EmptyState from '../../components/shared/EmptyState';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications'); // baseURL + /applications
      setApplications(res.data);
    } catch (error) {
      toast.error('Failed to load applications');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    const confirmWithdraw = window.confirm('Are you sure you want to withdraw this application?');
    if (!confirmWithdraw) return;

    try {
      setDeletingId(id);
      await api.delete(`/applications/${id}`);
      toast.success('Application withdrawn');
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error('Error withdrawing application');
      console.error('Error withdrawing application:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) return <Loader />;

  if (applications.length === 0)
    return (
      <EmptyState
        title="No Applications"
        description="You haven't applied to any jobs yet."
      />
    );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen">
      <h1 className="text-2xl font-bold text-white">Your Applications</h1>
      <div className="grid gap-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="p-4 rounded-xl bg-[#132235] border border-[#7293c5] shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">{app.job?.title}</h2>
                <p className="text-gray-400 text-sm">
                  {app.job?.company} - {app.job?.location}
                </p>
                <p className="text-gray-300 mt-2">
                  <span className="font-medium">Cover Letter:</span> {app.coverLetter || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => handleWithdraw(app._id)}
                disabled={deletingId === app._id}
                className={`text-red-400 hover:text-red-600 transition ${
                  deletingId === app._id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Withdraw Application"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Applied on: {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
