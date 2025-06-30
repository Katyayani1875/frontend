import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { BookmarkIcon, BriefcaseIcon, MapPinIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import toast from "react-hot-toast";
import JobService from "../../api/jobApi";
import ApplicationService from "@/services/applicationService";
import BookmarkService from "@/services/bookmarkService";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) {
        navigate("/jobs");
        return;
      }

      try {
        setLoading(true);
        const [jobData, bookmarksData, applicationsData] = await Promise.all([
          JobService.getJobDetails(id),
          user ? BookmarkService.getUserBookmarks() : Promise.resolve([]),
          user ? ApplicationService.getUserApplications() : Promise.resolve([])
        ]);

        setJob(jobData);
        setIsBookmarked(bookmarksData.some(b => b.job._id === id));
        setHasApplied(applicationsData.some(a => a.job._id === id));
      } catch (error) {
        console.error("Failed to fetch job data:", error);
        toast.error("Failed to load job details");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, navigate, user]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setApplying(true);
      await ApplicationService.createApplication(id);
      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application error:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    try {
      setBookmarking(true);
      if (isBookmarked) {
        await BookmarkService.removeBookmark(id);
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await BookmarkService.addBookmark(id);
        setIsBookmarked(true);
        toast.success("Job bookmarked!");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error(error.response?.data?.message || "Bookmark operation failed");
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-gray-700">Job not found</h3>
        <Button onClick={() => navigate("/jobs")} className="mt-4">
          Browse Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 space-y-6">
        {/* Job Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {job.title}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {job.company?.name || "A Reputable Company"}
              </p>
              {job.company?.verified && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className="w-full md:w-auto"
            >
              {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
            </Button>
            <Button
              onClick={handleBookmark}
              variant="ghost"
              disabled={bookmarking}
              className="w-full md:w-auto"
            >
              <BookmarkIcon
                className={`w-5 h-5 mr-2 ${isBookmarked ? "fill-current" : ""}`}
              />
              {bookmarking ? "Processing..." : isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </div>

        {/* Job Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-4 h-4" />
            <span>{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1">
            <BriefcaseIcon className="w-4 h-4" />
            <span>{job.employmentType || "Full-time"}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <DollarSignIcon className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.postedAt && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{new Date(job.postedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="space-y-6">
          <div className="prose max-w-none dark:prose-invert">
            <h3 className="text-xl font-semibold">Job Description</h3>
            <p>{job.description}</p>

            {job.responsibilities?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={handleApply}
              size="lg"
              disabled={hasApplied || applying}
              className="w-full md:w-auto"
            >
              {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;