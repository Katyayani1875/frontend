import { useEffect, useState } from 'react';
// import axios from 'axios';
import axios from '@/lib/axios'; // new changes
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BookmarkMinusIcon,
  BriefcaseIcon,
  MapPinIcon,
  CalendarDaysIcon, // Changed from CalendarIcon for consistency if you prefer, or keep CalendarIcon
  BuildingIcon, // Added for company
} from 'lucide-react'; // Import Lucide Icons
import { Button } from '@/components/ui/button'; // Assuming you're using a UI library

const Bookmarks = () => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        // Ensure Axios is configured to send auth tokens if required by authMiddleware
        const res = await axios.get('/api/bookmarks');
        setBookmarkedJobs(res.data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        toast.error(err.response?.data?.message || 'Failed to load bookmarks.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemove = async (jobIdToRemove) => {
    try {
      // Ensure Axios is configured to send auth tokens
      await axios.delete(`/api/bookmarks/${jobIdToRemove}`);
      setBookmarkedJobs((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.job._id !== jobIdToRemove)
      );
      toast.success('Removed from bookmarks.');
    } catch (err) {
      console.error('Error removing bookmark:', err);
      toast.error(err.response?.data?.message || 'Failed to remove bookmark.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Using a generic spinner or replace with your specific class if "loading-spinner" is from a library like DaisyUI */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-200 dark:bg-gray-900 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center sm:text-left">
          My Bookmarked Jobs
        </h1>

        {bookmarkedJobs.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkMinusIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-xl mb-2">
              No bookmarked jobs yet.
            </p>
            <p className="text-gray-400 dark:text-gray-300 mb-6">
              Start exploring and save jobs you're interested in!
            </p>
            <Link to="/jobs"> {/* Assuming '/jobs' is your main jobs listing page */}
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Explore Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedJobs.map((bookmark) => (
              <div
                key={bookmark._id} // Use the bookmark's own ID as the key
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2 truncate">
                    {bookmark.job.title || 'No Title Provided'}
                  </h2>
                  {/* Displaying Company Name */}
                  {bookmark.job.company && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                      <BuildingIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{bookmark.job.company}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{bookmark.job.location || 'Remote'}</span>
                  </p>
                  {/* Changed to "Bookmarked on" as it uses bookmark.createdAt */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 pt-1">
                    <CalendarDaysIcon className="w-4 h-4 flex-shrink-0" />
                    Bookmarked on{' '}
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Link to={`/jobs/${bookmark.job._id}`} className="w-full sm:w-auto">
                    <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                      View Job
                    </Button>
                  </Link>
                  <Button
                    variant="destructive" // This usually implies a specific styling from your UI library
                    size="sm"
                    className="w-full sm:w-auto flex items-center justify-center" // Ensure text alignment
                    onClick={() => handleRemove(bookmark.job._id)}
                  >
                    <BookmarkMinusIcon className="w-4 h-4 mr-1.5" />
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