// src/pages/bookmark/Bookmarks.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BookmarkMinusIcon, Building2Icon, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import JobService from '../../api/jobApi.js';

const Bookmarks = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        const bookmarks = await JobService.bookmarks.fetchAll();
        // Transform the data to match what your UI expects
        const transformedBookmarks = bookmarks.map(bookmark => ({
          ...bookmark.job,          // Spread all job properties
          bookmarkId: bookmark._id  // Keep the bookmark ID for removal
        }));
        setBookmarkedJobs(transformedBookmarks);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        toast.error('Failed to load your bookmarked jobs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      // Find the bookmark to get its ID
      const bookmarkToRemove = bookmarkedJobs.find(job => job._id === jobId);
      if (!bookmarkToRemove) return;
      
      await JobService.bookmarks.remove(bookmarkToRemove.bookmarkId || jobId);
      setBookmarkedJobs(prev => prev.filter(job => job._id !== jobId));
      toast.success('Removed from bookmarks.');
    } catch (err) {
      console.error('Error removing bookmark:', err);
      toast.error('Failed to remove bookmark.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading Bookmarks...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-200 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Bookmarked Jobs</h1>

        {bookmarkedJobs.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkMinusIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">No bookmarked jobs yet.</p>
            <Link to="/jobs">
              <Button size="lg" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                Explore Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl shadow-lg border flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 truncate">{job.title}</h2>
                  <div className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                    <Building2Icon size={16} />
                    <span>{job.company?.name || "A Company"}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <MapPinIcon size={16} />
                    <span>{job.location || 'Remote'}</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Link to={`/jobs/${job._id}`} className="w-full">
                    <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      View Job
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRemove(job._id)}
                  >
                    <BookmarkMinusIcon className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;