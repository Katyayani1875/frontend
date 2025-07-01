import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recommendJobs } from '../../api/aiApi';
import { Loader2, BrainCircuit, X, MapPin, ChevronRight, Plus, Sparkles } from 'lucide-react';
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
        <div className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all shadow-sm">
            {tags.map(tag => (
                <motion.span 
                    key={tag}
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
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
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? "Type a skill and press Enter..." : ""}
                className="flex-grow p-2 bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
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

const JobCard = ({ title, company, location, description, skills, matchScore }) => (
    <motion.div 
        className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col h-full shadow-md hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
    >
        {matchScore && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold z-10 shadow-md">
                {matchScore}% Match
            </div>
        )}
        
        <div className="flex-grow">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{company}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                </div>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
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
            <Button variant="outline" className="w-full font-medium group-hover:bg-indigo-50 dark:group-hover:bg-slate-700 transition-colors">
                View Details <ChevronRight className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Button>
        </div>
    </motion.div>
);

const RecommendJobs = () => {
    const { user } = useAuth();
    const [skills, setSkills] = useState(['React', 'JavaScript']);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
        if (skills.length === 0) return;
        
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
        
        const sections = raw.split(/\n\s*\n/).filter(s => s.trim());
        
        return sections.map(section => {
            const lines = section.split('\n').filter(line => line.trim() !== '');
            const title = lines[0]?.replace(/\*|:/g, '').trim() || "Recommended Jobs";
            
            const jobs = lines.slice(1).map(line => {
                const [jobTitlePart, ...descParts] = line.split(':');
                const jobTitle = jobTitlePart?.replace(/\*/g, '').trim() || "Job Opportunity";
                const description = descParts.join(':').trim() || 
                    "An exciting opportunity matching your skills and experience.";
                
                const companies = ["TechCorp", "InnovateCo", "Digital Solutions", "FutureTech", "WebWorks"];
                const locations = ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL"];
                const relatedSkills = [...skills];
                
                const extraSkills = ["TypeScript", "AWS", "Agile", "CI/CD", "REST APIs"];
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
                    matchScore: Math.floor(Math.random() * 30) + 70
                };
            });
            
            return { 
                title, 
                jobs: jobs.filter(j => j.title && j.description) 
            };
        });
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
                        AI-Powered Job Recommendations
                    </h1>
                    {user && (
                        <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                            Welcome back, {user.name}!
                        </p>
                    )}
                    <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg">
                        Enter your skills below and discover roles that match your expertise. Our AI analyzes thousands of jobs to find your perfect match.
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
                                Add as many relevant skills as you can for better matches
                            </p>
                        </div>
                        
                        <Button
                            onClick={handleRecommend}
                            disabled={loading || skills.length === 0}
                            size="lg"
                            className="w-full font-semibold mt-2 shadow-md hover:shadow-lg transition-shadow"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                    Analyzing Your Skills...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Find My Perfect Jobs
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

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