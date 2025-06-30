import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import Loader from '../../components/shared/Loader';
import EmptyState from '../../components/shared/EmptyState';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/applications');
      setApplications(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load applications');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;

    try {
      setDeletingId(id);
      await axiosInstance.delete(`/applications/${id}`);
      toast.success('Application withdrawn successfully');
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
      console.error('Withdraw error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="mr-1 h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (loading) return <Loader className="min-h-[60vh]" />;

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No Applications Found"
        description="You haven't applied to any jobs yet. Start exploring opportunities!"
        actionText="Browse Jobs"
        actionHref="/jobs"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Applications</h1>
        <p className="mt-2 text-gray-600">Track and manage your job applications</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Pending ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('accepted')}
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Accepted ({applications.filter(a => a.status === 'accepted').length})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Rejected ({applications.filter(a => a.status === 'rejected').length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No applications match your filter criteria</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app._id}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {app.job?.company?.logo ? (
                        <img
                          src={app.job.company.logo}
                          alt={`${app.job.company.name} logo`}
                          className="h-12 w-12 object-contain rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <Building2Icon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        {app.job?.title}
                      </h2>
                      <p className="text-gray-600">
                        {app.job?.company?.name || 'Company not specified'} • {app.job?.location || 'Location not specified'}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(app.status)}
                        <span className="ml-2 text-sm text-gray-500">
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    disabled={deletingId === app._id || app.status !== 'pending'}
                    className={`flex items-center justify-center px-4 py-2 text-sm rounded-md ${
                      deletingId === app._id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : app.status !== 'pending'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                    title={
                      app.status !== 'pending'
                        ? 'Cannot withdraw non-pending applications'
                        : 'Withdraw application'
                    }
                  >
                    {deletingId === app._id ? (
                      'Withdrawing...'
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Withdraw
                      </>
                    )}
                  </button>
                </div>
              </div>

              {app.coverLetter && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Your Cover Letter</h3>
                  <p className="text-gray-600 whitespace-pre-line">{app.coverLetter}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applications;