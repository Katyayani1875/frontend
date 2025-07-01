import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendJobs } from '../../api/aiApi';
import { Loader2, BrainCircuit, X, Briefcase, Building, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (['Enter', ','].includes(e.key) && inputValue.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-3 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow shadow-sm">
            {tags.map(tag => (
                <motion.span 
                    key={tag}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-md"
                >
                    {tag}
                    <button 
                        onClick={() => removeTag(tag)} 
                        className="text-indigo-500 hover:text-indigo-800 dark:hover:text-white"
                        aria-label={`Remove ${tag} skill`}
                    >
                        <X size={14} />
                    </button>
                </motion.span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Enter skills (e.g., 'React') and press Enter..." : ""}
                className="flex-grow p-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                aria-label="Add skills"
            />
        </div>
    );
};

const JobCard = ({ title, company, location, description, skills, matchScore }) => (
    <motion.div 
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
    >
        <div className="flex-grow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{company}</span>
                        <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                    </div>
                </div>
                {matchScore && (
                    <div className="flex-shrink-0 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold">
                        {matchScore}% Match
                    </div>
                )}
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 mt-4 text-sm leading-relaxed line-clamp-3">
                {description}
            </p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-2 mb-4">
                {skills?.map(skill => (
                    <span 
                        key={skill} 
                        className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                        {skill}
                    </span>
                ))}
            </div>
            <Button variant="outline" className="w-full font-semibold group-hover:bg-indigo-50 dark:group-hover:bg-slate-700">
                View Details <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </motion.div>
);

const SkeletonJobCard = () => (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="space-y-3">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="flex gap-4">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
            <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mt-6"></div>
    </div>
);

const RecommendJobs = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        if (skills.length === 0) {
            alert("Please enter at least one skill.");
            return;
        }
        
        setLoading(true);
        setRecommendations(null);
        
        try {
            const response = await recommendJobs({ skills: skills.join(', ') });
            const parsedRecommendations = parseRecommendations(response.data.recommendations);
            setRecommendations(parsedRecommendations);
        } catch (err) {
            console.error("Recommendation error:", err);
            alert(err.response?.data?.message || 'Error recommending jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const parseRecommendations = (raw) => {
        if (!raw) return [];
        
        // Split by double newlines to get categories
        const sections = raw.split(/\n\s*\n/).filter(s => s.trim());
        
        return sections.map(section => {
            const lines = section.split('\n').filter(line => line.trim() !== '');
            const title = lines[0]?.replace(/\*|:/g, '').trim() || "Recommended Jobs";
            
            const jobs = lines.slice(1).map(line => {
                // Extract job title and description
                const [jobTitlePart, ...descParts] = line.split(':');
                const jobTitle = jobTitlePart?.replace(/\*/g, '').trim() || "Job Opportunity";
                const description = descParts.join(':').trim() || 
                    "An exciting opportunity matching your skills and experience.";
                
                // Generate some realistic placeholder data
                const companies = ["TechCorp", "InnovateCo", "Digital Solutions", "FutureTech", "WebWorks"];
                const locations = ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL"];
                const relatedSkills = [...skills];
                
                // Add some related skills if we have space
                const extraSkills = ["JavaScript", "TypeScript", "AWS", "Agile", "CI/CD", "REST APIs"];
                while (relatedSkills.length < 5 && extraSkills.length > 0) {
                    const randomSkill = extraSkills.splice(Math.floor(Math.random() * extraSkills.length), 1)[0];
                    if (!relatedSkills.includes(randomSkill)) {
                        relatedSkills.push(randomSkill);
                    }
                }
                
                return { 
                    title: jobTitle,
                    company: companies[Math.floor(Math.random() * companies.length)],
                    location: locations[Math.floor(Math.random() * locations.length)],
                    description,
                    skills: relatedSkills,
                    matchScore: Math.floor(Math.random() * 30) + 70 // Random match score between 70-100%
                };
            });
            
            return { 
                title, 
                jobs: jobs.filter(j => j.title && j.description) 
            };
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full mb-4">
                        <BrainCircuit className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        AI-Powered Job Recommendations
                    </h1>
                    {user && (
                        <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
                            Welcome back, {user.name}!
                        </p>
                    )}
                    <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                        Enter your skills below and discover roles that match your expertise. Our AI analyzes thousands of jobs to find your perfect match.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="skills-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Your Skills
                            </label>
                            <TagInput tags={skills} setTags={setSkills} />
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Add as many relevant skills as you can for better matches
                            </p>
                        </div>
                        
                        <Button
                            onClick={handleRecommend}
                            disabled={loading || skills.length === 0}
                            size="lg"
                            className="w-full font-semibold mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Analyzing Your Skills...
                                </>
                            ) : (
                                "Find My Perfect Jobs"
                            )}
                        </Button>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {[...Array(4)].map((_, i) => (
                                <SkeletonJobCard key={i} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {recommendations && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-12"
                    >
                        {recommendations.map((category, index) => (
                            <section key={index} className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {category.title}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {category.jobs.map((job, jobIndex) => (
                                        <JobCard key={jobIndex} {...job} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RecommendJobs;
// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { recommendJobs } from '../../api/aiApi';
// import { Loader2 } from 'lucide-react';

// const RecommendJobs = () => {
//     const { user } = useAuth();
//     const [skills, setSkills] = useState('');
//     const [recommendations, setRecommendations] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleRecommend = async () => {
//         setLoading(true);
//         try {
//             const response = await recommendJobs({ skills });
//             const parsedRecommendations = parseRecommendations(response.data.recommendations);
//             setRecommendations(parsedRecommendations);
//         } catch (err) {
//             alert(err.response?.data?.message || 'Error recommending jobs');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const parseRecommendations = (rawRecommendations) => {
//         const categories = {};
//         const categoryRegex = /\*\*(.+?):\*\*/g;
//         const jobRegex = /\*\*(.+?):\*\*(.+)/g;
//         let categoryMatch;
//         let categoryIndex = 0;

//         while ((categoryMatch = categoryRegex.exec(rawRecommendations)) !== null) {
//             const categoryTitle = categoryMatch[1].trim();
//             const uniqueCategoryKey = `${categoryTitle}-${categoryIndex++}`;
//             if (!categories[uniqueCategoryKey]) {
//                 categories[uniqueCategoryKey] = { title: categoryTitle, jobs: [] };
//             }
//             let jobMatch;
//             while ((jobMatch = jobRegex.exec(rawRecommendations)) !== null) {
//                 const jobTitle = jobMatch[1].trim();
//                 const description = jobMatch[2].trim();
//                 if (rawRecommendations.indexOf(`**${categoryTitle}:**`) < rawRecommendations.indexOf(`**${jobTitle}:**`)) {
//                     categories[uniqueCategoryKey].jobs.push({ title: jobTitle, description });
//                 }
//             }
//             jobRegex.lastIndex = categoryRegex.lastIndex;
//         }
//         return Object.values(categories);
//     };

//     return (
//         <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-purple-50 to-indigo-200 py-16 px-4 sm:px-6 lg:px-8">
//             <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center w-full max-w-7xl mt-10">
//                 {user && (
//                     <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
//                         Welcome, {user.name}!
//                     </h2>
//                 )}
//                 <h3 className="text-lg font-medium text-center text-gray-700 mt-2 mb-8">
//                     Discover job opportunities tailored to your unique skills.
//                 </h3>

//                 <div className="relative mb-8">
//                     <input
//                         type="text"
//                         id="skills"
//                         value={skills}
//                         onChange={(e) => setSkills(e.target.value)}
//                         placeholder=" "
//                         className="peer w-full px-5 py-4 bg-gray-100 border border-gray-300 text-gray-800 text-base rounded-xl placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                     />
//                     <label
//                         htmlFor="skills"
//                         className="absolute left-5 top-4 text-gray-500 text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200"
//                     >
//                         Enter your skills (comma-separated)
//                     </label>
//                 </div>

//                 <button
//                     onClick={handleRecommend}
//                     disabled={loading}
//                     className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {loading ? (
//                         <>
//                             <Loader2 className="animate-spin" size={20} />
//                             Generating...
//                         </>
//                     ) : (
//                         'Get Recommendations'
//                     )}
//                 </button>

//                 {recommendations && (
//                     <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-md text-left">
//                         <h3 className="text-xl font-semibold text-indigo-700 mb-4">Recommended Jobs:</h3>
//                         {recommendations.map((categoryItem) => (
//                             <div key={categoryItem.title} className="mb-6">
//                                 <h4 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-2">{categoryItem.title}</h4>
//                                 <ul className="list-none pl-0">
//                                     {categoryItem.jobs.map((job, index) => (
//                                         <li key={`${job.title}-${index}`} className="mb-3">
//                                             <div className="flex items-start">
//                                                 <strong className="text-indigo-500 mr-2">•</strong>
//                                                 <div>
//                                                     <strong className="text-lg text-gray-800">{job.title}</strong>
//                                                     {job.description && <p className="text-gray-600 ml-4 mt-1 leading-relaxed">{job.description}</p>}
//                                                 </div>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RecommendJobs;