
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendJobs } from '../../api/aiApi';
import { Loader2, BrainCircuit, X, MapPin, ChevronRight, Plus, Sparkles, Zap, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// TagInput component remains largely the same, no changes needed for this fix.
const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (['Enter', ','].includes(e.key) && inputValue.trim() !== '') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
            <AnimatePresence>
                {tags.map(tag => (
                    <motion.span
                        key={tag}
                        layout
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-lg shadow-xs"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="text-indigo-500 hover:text-indigo-800 dark:hover:text-white transition-colors"
                            aria-label={`Remove ${tag} skill`}
                        >
                            <X size={14} />
                        </button>
                    </motion.span>
                ))}
            </AnimatePresence>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Type a skill and press Enter..." : ""}
                className="flex-grow p-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 min-w-[150px]"
                aria-label="Add skills"
            />
            {tags.length === 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Plus size={18} />
                </div>
            )}
        </div>
    );
};

// JobCard component adapted for Job Roles
const JobCard = ({ title, description, keySkills, industries }) => (
    <motion.div
        className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex-grow">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                {industries && industries.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-2">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                            Common Industries: {industries.join(', ')}
                        </span>
                    </div>
                )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4 min-h-[4rem]">
                {description}
            </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            {keySkills && keySkills.length > 0 && (
                <>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                        <Lightbulb size={16} className="text-amber-500" /> Key Skills for this Role:
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {keySkills.map(skill => (
                            <span
                                key={skill}
                                className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </>
            )}
            <Button variant="outline" className="w-full font-medium group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition-colors">
                Learn More About This Role <ChevronRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
        </div>
    </motion.div>
);


// Skeleton loader for JobCard
const JobCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md animate-pulse">
        <div className="flex-grow">
            <div className="mb-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>

            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                ))}
            </div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
        </div>
    </div>
);


const RecommendJobs = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState(['React', 'JavaScript', 'Node.js', 'AWS']); // Pre-fill with some common skills
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRecommend = async () => {
        if (skills.length === 0) {
            setError("Please enter at least one skill to get recommendations.");
            return;
        }

        setLoading(true);
        setRecommendations(null); // Clear previous recommendations
        setError(null); // Clear previous errors

        try {
            const response = await recommendJobs({ skills: skills.join(', ') });
            const parsedRecommendations = parseRecommendations(response.data.recommendations);
            if (parsedRecommendations.length === 0) {
                setError("No specific job roles could be identified for the given skills. Please try different or more detailed skills.");
            }
            setRecommendations([{ title: "Recommended Job Roles", jobs: parsedRecommendations }]);
        } catch (err) {
            console.error("Recommendation error:", err);
            setError(err.response?.data?.message || 'Error recommending job roles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const parseRecommendations = (raw) => {
        if (!raw) return [];

        const roles = [];
        const roleBlocks = raw.split('ROLE_START').filter(block => block.trim() !== '');

        roleBlocks.forEach(block => {
            const trimmedBlock = block.split('ROLE_END')[0].trim(); // Get content between start and end

            const titleMatch = trimmedBlock.match(/Title:\s*(.*)/i);
            const descriptionMatch = trimmedBlock.match(/Description:\s*(.*)/i);
            const keySkillsMatch = trimmedBlock.match(/Key Skills:\s*(.*)/i);
            const industriesMatch = trimmedBlock.match(/Industries:\s*(.*)/i);

            const title = titleMatch ? titleMatch[1].trim() : "Untitled Role";
            const description = descriptionMatch ? descriptionMatch[1].trim() : "A suitable job role matching your skills.";
            const keySkills = keySkillsMatch ? keySkillsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
            const industries = industriesMatch ? industriesMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

            // Only add if a title is found to ensure valid parsing
            if (title !== "Untitled Role") {
                roles.push({
                    title,
                    description,
                    keySkills,
                    industries,
                });
            }
        });

        return roles;
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full text-white">
                            <Sparkles size={24} />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        AI-Powered Career Path Finder
                    </h1>
                    {user && (
                        <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                            Welcome back, {user.name}!
                        </p>
                    )}
                    <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
                        Tell our AI about your skills and discover job roles that perfectly match your expertise and career aspirations.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-3xl mx-auto mb-16 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                >
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="skills-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Your Skills
                            </label>
                            <div className="relative">
                                <TagInput tags={skills} setTags={setSkills} />
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Add as many relevant skills as you can for better role suggestions
                            </p>
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <X size={16} /> {error}
                                </p>
                            )}
                        </div>

                        <Button
                            onClick={handleRecommend}
                            disabled={loading || skills.length === 0}
                            size="lg"
                            className="w-full font-semibold mt-2 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Analyzing Your Skills...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-5 w-5" />
                                    Find My Ideal Job Roles
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <BrainCircuit className="text-indigo-500" /> Identifying Roles...
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <JobCardSkeleton key={i} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!loading && recommendations && recommendations.length > 0 && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-12"
                        >
                            {recommendations.map((category, index) => (
                                <section key={index} className="space-y-6">
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                        <Sparkles className="text-indigo-500" /> {category.title}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <AnimatePresence>
                                            {category.jobs.map((job, jobIndex) => (
                                                <JobCard key={jobIndex} {...job} />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            ))}
                        </motion.div>
                    )}

                    {!loading && !recommendations && !error && (
                        <motion.div
                            key="initial-prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-slate-500 dark:text-slate-400 py-16"
                        >
                            <BrainCircuit size={48} className="mx-auto mb-4 text-indigo-400" />
                            <p className="text-lg">Enter your skills above to get personalized job role recommendations!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RecommendJobs;
// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { recommendJobs } from '../../api/aiApi';
// import { Loader2, BrainCircuit, X, MapPin, ChevronRight, Plus, Sparkles } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/Button';

// const TagInput = ({ tags, setTags }) => {
//     const [inputValue, setInputValue] = useState('');

//     const handleKeyDown = (e) => {
//         if (['Enter', ','].includes(e.key) && inputValue.trim() !== '') {
//             e.preventDefault();
//             if (!tags.includes(inputValue.trim())) {
//                 setTags([...tags, inputValue.trim()]);
//             }
//             setInputValue('');
//         }
//     };

//     const removeTag = (tagToRemove) => {
//         setTags(tags.filter(tag => tag !== tagToRemove));
//     };

//     return (
//         <div className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
//             {tags.map(tag => (
//                 <motion.span 
//                     key={tag}
//                     layout
//                     initial={{ scale: 0.5, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.5, opacity: 0 }}
//                     className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-lg shadow-xs"
//                 >
//                     {tag}
//                     <button 
//                         onClick={() => removeTag(tag)} 
//                         className="text-indigo-500 hover:text-indigo-800 dark:hover:text-white transition-colors"
//                         aria-label={`Remove ${tag} skill`}
//                     >
//                         <X size={14} />
//                     </button>
//                 </motion.span>
//             ))}
//             <input
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder={tags.length === 0 ? "Type a skill and press Enter..." : ""}
//                 className="flex-grow p-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
//                 aria-label="Add skills"
//             />
//             {tags.length === 0 && (
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
//                     <Plus size={18} />
//                 </div>
//             )}
//         </div>
//     );
// };

// const JobCard = ({ title, company, location, description, skills, matchScore }) => (
//     <motion.div 
//         className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group relative overflow-hidden"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         whileHover={{ scale: 1.02 }}
//     >
//         {matchScore && (
//             <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold z-10 shadow-md">
//                 {matchScore}% Match
//             </div>
//         )}
        
//         <div className="flex-grow">
//             <div className="mb-4">
//                 <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
//                     {title}
//                 </h3>
//                 <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
//                     <span className="font-medium text-slate-600 dark:text-slate-300">{company}</span>
//                     <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
//                 </div>
//             </div>
            
//             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
//                 {description}
//             </p>
//         </div>
        
//         <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
//             <div className="flex flex-wrap gap-2 mb-4">
//                 {skills?.map(skill => (
//                     <span 
//                         key={skill} 
//                         className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full"
//                     >
//                         {skill}
//                     </span>
//                 ))}
//             </div>
//             <Button variant="outline" className="w-full font-medium group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition-colors">
//                 View Details <ChevronRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
//             </Button>
//         </div>
//     </motion.div>
// );

// const RecommendJobs = () => {
//     const { user } = useAuth();
//     const [skills, setSkills] = useState(['React', 'JavaScript']);
//     const [recommendations, setRecommendations] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleRecommend = async () => {
//         if (skills.length === 0) return;
        
//         setLoading(true);
//         setRecommendations(null);
        
//         try {
//             const response = await recommendJobs({ skills: skills.join(', ') });
//             const parsedRecommendations = parseRecommendations(response.data.recommendations);
//             setRecommendations(parsedRecommendations);
//         } catch (err) {
//             console.error("Recommendation error:", err);
//             alert(err.response?.data?.message || 'Error recommending jobs. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const parseRecommendations = (raw) => {
//         if (!raw) return [];
        
//         const sections = raw.split(/\n\s*\n/).filter(s => s.trim());
        
//         return sections.map(section => {
//             const lines = section.split('\n').filter(line => line.trim() !== '');
//             const title = lines[0]?.replace(/\*|:/g, '').trim() || "Recommended Jobs";
            
//             const jobs = lines.slice(1).map(line => {
//                 const [jobTitlePart, ...descParts] = line.split(':');
//                 const jobTitle = jobTitlePart?.replace(/\*/g, '').trim() || "Job Opportunity";
//                 const description = descParts.join(':').trim() || 
//                     "An exciting opportunity matching your skills and experience.";
                
//                 const companies = ["TechCorp", "InnovateCo", "Digital Solutions", "FutureTech", "WebWorks"];
//                 const locations = ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL"];
//                 const relatedSkills = [...skills];
                
//                 const extraSkills = ["TypeScript", "AWS", "Agile", "CI/CD", "REST APIs"];
//                 while (relatedSkills.length < 5 && extraSkills.length > 0) {
//                     const randomSkill = extraSkills.splice(Math.floor(Math.random() * extraSkills.length), 1)[0];
//                     if (!relatedSkills.includes(randomSkill)) {
//                         relatedSkills.push(randomSkill);
//                     }
//                 }
                
//                 return { 
//                     title: jobTitle,
//                     company: companies[Math.floor(Math.random() * companies.length)],
//                     location: locations[Math.floor(Math.random() * locations.length)],
//                     description,
//                     skills: relatedSkills,
//                     matchScore: Math.floor(Math.random() * 30) + 70
//                 };
//             });
            
//             return { 
//                 title, 
//                 jobs: jobs.filter(j => j.title && j.description) 
//             };
//         });
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-5xl mx-auto">
//                 <motion.div 
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="text-center mb-12"
//                 >
//                     <div className="inline-flex items-center justify-center bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg mb-6 border border-slate-200 dark:border-slate-700">
//                         <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full text-white">
//                             <Sparkles size={24} />
//                         </div>
//                     </div>
//                     <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
//                         AI-Powered Job Recommendations
//                     </h1>
//                     {user && (
//                         <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-6">
//                             Welcome back, {user.name}!
//                         </p>
//                     )}
//                     <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
//                         Enter your skills below and discover roles that match your expertise. Our AI analyzes thousands of jobs to find your perfect match.
//                     </p>
//                 </motion.div>

//                 <motion.div 
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: 0.1 }}
//                     className="max-w-3xl mx-auto mb-16 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
//                 >
//                     <div className="space-y-6">
//                         <div>
//                             <label htmlFor="skills-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                 Your Skills
//                             </label>
//                             <div className="relative">
//                                 <TagInput tags={skills} setTags={setSkills} />
//                             </div>
//                             <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//                                 Add as many relevant skills as you can for better matches
//                             </p>
//                         </div>
                        
//                         <Button
//                             onClick={handleRecommend}
//                             disabled={loading || skills.length === 0}
//                             size="lg"
//                             className="w-full font-semibold mt-2 shadow-md hover:shadow-lg transition-shadow"
//                         >
//                             {loading ? (
//                                 <>
//                                     <Loader2 className="animate-spin mr-2 h-5 w-5" />
//                                     Analyzing Your Skills...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Sparkles className="mr-2 h-5 w-5" />
//                                     Find My Perfect Jobs
//                                 </>
//                             )}
//                         </Button>
//                     </div>
//                 </motion.div>

//                 {recommendations && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="space-y-12"
//                     >
//                         {recommendations.map((category, index) => (
//                             <section key={index} className="space-y-6">
//                                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
//                                     {category.title}
//                                 </h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     {category.jobs.map((job, jobIndex) => (
//                                         <JobCard key={jobIndex} {...job} />
//                                     ))}
//                                 </div>
//                             </section>
//                         ))}
//                     </motion.div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RecommendJobs;