import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendJobs } from '../../api/aiApi';
import { Loader2 } from 'lucide-react';

const RecommendJobs = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState('');
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        setLoading(true);
        try {
            const response = await recommendJobs({ skills });
            const parsedRecommendations = parseRecommendations(response.data.recommendations);
            setRecommendations(parsedRecommendations);
        } catch (err) {
            alert(err.response?.data?.message || 'Error recommending jobs');
        } finally {
            setLoading(false);
        }
    };

    const parseRecommendations = (rawRecommendations) => {
        const categories = {};
        const categoryRegex = /\*\*(.+?):\*\*/g;
        const jobRegex = /\*\*(.+?):\*\*(.+)/g;
        let categoryMatch;
        let categoryIndex = 0;

        while ((categoryMatch = categoryRegex.exec(rawRecommendations)) !== null) {
            const categoryTitle = categoryMatch[1].trim();
            const uniqueCategoryKey = `${categoryTitle}-${categoryIndex++}`;
            if (!categories[uniqueCategoryKey]) {
                categories[uniqueCategoryKey] = { title: categoryTitle, jobs: [] };
            }
            let jobMatch;
            while ((jobMatch = jobRegex.exec(rawRecommendations)) !== null) {
                const jobTitle = jobMatch[1].trim();
                const description = jobMatch[2].trim();
                if (rawRecommendations.indexOf(`**${categoryTitle}:**`) < rawRecommendations.indexOf(`**${jobTitle}:**`)) {
                    categories[uniqueCategoryKey].jobs.push({ title: jobTitle, description });
                }
            }
            jobRegex.lastIndex = categoryRegex.lastIndex;
        }
        return Object.values(categories);
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-purple-50 to-indigo-200 py-16 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center w-full max-w-7xl mt-10">
                {user && (
                    <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
                        Welcome, {user.name}!
                    </h2>
                )}
                <h3 className="text-lg font-medium text-center text-gray-700 mt-2 mb-8">
                    Discover job opportunities tailored to your unique skills.
                </h3>

                <div className="relative mb-8">
                    <input
                        type="text"
                        id="skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder=" "
                        className="peer w-full px-5 py-4 bg-gray-100 border border-gray-300 text-gray-800 text-base rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    <label
                        htmlFor="skills"
                        className="absolute left-5 top-4 text-gray-500 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200"
                    >
                        Enter your skills (comma-separated)
                    </label>
                </div>

                <button
                    onClick={handleRecommend}
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Generating...
                        </>
                    ) : (
                        'Get Recommendations'
                    )}
                </button>

                {recommendations && (
                    <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-md text-left">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Recommended Jobs:</h3>
                        {recommendations.map((categoryItem) => (
                            <div key={categoryItem.title} className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-2">{categoryItem.title}</h4>
                                <ul className="list-none pl-0">
                                    {categoryItem.jobs.map((job, index) => (
                                        <li key={`${job.title}-${index}`} className="mb-3">
                                            <div className="flex items-start">
                                                <strong className="text-indigo-500 mr-2">•</strong>
                                                <div>
                                                    <strong className="text-lg text-gray-800">{job.title}</strong>
                                                    {job.description && <p className="text-gray-600 ml-4 mt-1 leading-relaxed">{job.description}</p>}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendJobs;