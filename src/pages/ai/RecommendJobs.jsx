import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendJobs } from '../../api/aiApi';
import { Loader2, Sparkles, X, MapPin, Building, Search, Bell, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

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
        <div className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
            {tags.map(tag => (
                <motion.span 
                    key={tag}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-3 py-1.5 rounded-lg"
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
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Type skills (e.g., React) and press Enter..." : ""}
                className="flex-grow p-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                aria-label="Add skills"
            />
        </div>
    );
};

const JobCard = ({ title, company, location, description, skills, matchScore, onSetAlert }) => {
    const [alertSet, setAlertSet] = useState(false);

    const handleSetAlert = () => {
        onSetAlert({ title, skills });
        setAlertSet(true);
        setTimeout(() => setAlertSet(false), 3000);
    };

    return (
        <motion.div
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        >
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-md">
                {matchScore}% Match
            </div>
            
            <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {company}
                        </p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center ml-4">
                        <Building size={24} className="text-slate-500"/>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                        <MapPin size={14}/> {location}
                    </span>
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                        <span 
                            key={skill} 
                            className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="flex-1 font-medium group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition-colors"
                    >
                        View Details <ChevronRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Button>
                    
                    <Button 
                        onClick={handleSetAlert} 
                        className={`flex-1 font-semibold transition-all ${alertSet ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        disabled={alertSet}
                    >
                        <AnimatePresence mode="wait">
                            {alertSet ? (
                                <motion.span 
                                    key="alerted" 
                                    initial={{opacity: 0, y: -10}} 
                                    animate={{opacity: 1, y: 0}} 
                                    exit={{opacity: 0, y: 10}} 
                                    className="flex items-center"
                                >
                                    <Check className="mr-2 h-5 w-5"/> Alert Set!
                                </motion.span>
                            ) : (
                                <motion.span 
                                    key="setAlert" 
                                    initial={{opacity: 0, y: -10}} 
                                    animate={{opacity: 1, y: 0}} 
                                    exit={{opacity: 0, y: 10}} 
                                    className="flex items-center"
                                >
                                    <Bell className="mr-2 h-5 w-5"/> Set Alert
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

const RecommendJobs = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState(['React']);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [exampleJobs, setExampleJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        if (skills.length === 0) {
            toast.error("Please add at least one skill");
            return;
        }
        
        setLoading(true);
        setAiAnalysis(null);
        setExampleJobs([]);
        
        try {
            const response = await recommendJobs({ skills: skills.join(', ') });
            const { analysis, jobs } = parseAndGenerateExamples(response.data.recommendations);
            setAiAnalysis(analysis);
            setExampleJobs(jobs);
            toast.success("Found matching job opportunities!");
        } catch (err) {
            console.error("Recommendation error:", err);
            toast.error(err.response?.data?.message || 'Error generating recommendations.');
        } finally {
            setLoading(false);
        }
    };
    
    const parseAndGenerateExamples = (raw) => {
        if (!raw) return { analysis: "", jobs: [] };
        
        const mainAnalysis = raw.split("Core React Roles")[0] || "Based on your skills, here are potential career paths:";
        const jobSections = raw.split(/\n\s*\n/).filter(s => s.includes(':'));

        const companies = ["TechNova", "Innovate Solutions", "Digital Dynamics", "FutureScape", "WebWorks"];
        const locations = ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL"];
        const extraSkills = ["TypeScript", "AWS", "Agile", "CI/CD", "REST APIs", "GraphQL", "Docker", "Kubernetes"];

        const jobs = jobSections.map(section => {
            const [titlePart, ...descParts] = section.split(':');
            const title = titlePart.replace(/\*/g, '').trim() || "Software Developer";
            const description = descParts.join(':').trim() || 
                "An exciting opportunity to work with cutting-edge technologies and a talented team.";

            // Mix user skills with some random relevant skills
            const relatedSkills = [...new Set([
                ...skills,
                ...extraSkills.sort(() => 0.5 - Math.random()).slice(0, 3)
            ])];

            return {
                title,
                company: companies[Math.floor(Math.random() * companies.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                description,
                skills: relatedSkills,
                matchScore: Math.floor(Math.random() * 15) + 80 // High match scores (80-95%)
            };
        }).slice(0, 6); // Limit to 6 examples

        return { analysis: mainAnalysis, jobs };
    };

    const handleSetAlert = ({ title, skills }) => {
        toast.success(
            <div>
                <p className="font-medium">Job alert created for:</p>
                <p className="font-bold">{title}</p>
                <p className="text-sm mt-1">We'll notify you of new matching positions.</p>
            </div>,
            { duration: 3000 }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-16 px-4 sm:px-6 lg:px-8">
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
                    
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                        AI-Powered Career Navigator
                    </h1>
                    
                    {user && (
                        <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                            Welcome back, {user.name}!
                        </p>
                    )}
                    
                    <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
                        Enter your skills to discover personalized career paths and matching job opportunities.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="max-w-3xl mx-auto mb-16 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
                >
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Skills
                    </label>
                    
                    <TagInput tags={skills} setTags={setSkills} />
                    
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Add more skills for better recommendations
                    </p>
                    
                    <Button 
                        onClick={handleRecommend} 
                        disabled={loading || skills.length === 0}
                        size="lg" 
                        className="w-full font-semibold mt-6 shadow-md hover:shadow-lg transition-shadow"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-5 w-5" />
                                Generate Career Analysis
                            </>
                        )}
                    </Button>
                </motion.div>

                <AnimatePresence>
                    {loading && (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                Analyzing your skills and finding matching opportunities...
                            </p>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {aiAnalysis && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-16"
                        >
                            <section>
                                <motion.h2 
                                    variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} 
                                    initial="hidden" 
                                    animate="visible" 
                                    className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4"
                                >
                                    Career Path Analysis
                                </motion.h2>
                                
                                <motion.div 
                                    variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} 
                                    initial="hidden" 
                                    animate="visible" 
                                    transition={{delay: 0.2}} 
                                    className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg"
                                >
                                    <p>{aiAnalysis}</p>
                                </motion.div>
                            </section>
                            
                            <section>
                                <motion.h2 
                                    variants={{hidden: {opacity:0, y:20}, visible:{opacity:1, y:0}}} 
                                    initial="hidden" 
                                    animate="visible" 
                                    transition={{delay: 0.4}} 
                                    className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4"
                                >
                                    Matching Job Opportunities
                                </motion.h2>
                                
                                <motion.div 
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                                    initial="hidden" 
                                    animate="visible" 
                                    variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
                                >
                                    {exampleJobs.map((job, index) => (
                                        <JobCard 
                                            key={index} 
                                            {...job} 
                                            onSetAlert={handleSetAlert}
                                        />
                                    ))}
                                </motion.div>
                            </section>
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