import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, Search, Briefcase, Bot, Users, Cpu, MessageSquare, Bookmark, BookmarkCheck, FileText, CheckCircle, Star, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import JobService from "@/api/jobApi";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

// --- Framer Motion Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 1.5, delay: i * 0.1 },
  }),
};

// ---SECTION 1: HERO ---
const HeroSection = ({ onSearch }) => {
  const [jobTitle, setJobTitle] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (jobTitle.trim()) {
      onSearch(jobTitle.trim());
    }
  };

  // --- Animation Variants ---
  const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 }},
  };

  // --- Hooks for Interactive Background ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const backgroundX = useTransform(mouseX, [-1, 1], ["15%", "-15%"]);
  const backgroundY = useTransform(mouseY, [-1, 1], ["15%", "-15%"]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.section 
      className="relative flex flex-col justify-center min-h-[calc(100vh-20rem)] text-center overflow-hidden bg-slate-50 dark:bg-slate-900"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ x: backgroundX, y: backgroundY }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-gradient"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 blur-[100px]"></div>
      </motion.div>

      <div className="flex-grow flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div variants={itemVariants} className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find Your
            <span className="block mt-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
              Dream Career
            </span>
          </h1>
          <p className="mt-6 text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Powered by AI that understands your <span className="font-semibold text-indigo-600 dark:text-indigo-400">unique potential</span>, not just keywords.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          className="relative mt-12 w-full max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <div className="group relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative w-full rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg ring-1 ring-slate-900/10 dark:ring-white/10 p-3">
              <div className="flex items-center w-full">
                <Search className="text-slate-400 mx-3 pointer-events-none shrink-0" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Search by job title, skill, or company"
                  className="w-full h-12 px-4 py-2 bg-transparent border border-slate-300/70 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  className="ml-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-semibold text-base hover:bg-slate-800 transition-colors transform hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>
      <motion.div className="w-full pb-11 px-4 p-10" variants={itemVariants}>
          <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                {['men/32', 'women/44', 'men/45'].map((id, i) => (
                    <img 
                    key={i}
                    src={`https://randomuser.me/api/portraits/thumb/${id}.jpg`}
                    alt="User"
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900"
                    />
                ))}
                </div>
                <span className="font-medium">Trusted by <span className="text-slate-700 dark:text-slate-200">50,000+</span> professionals</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium"><span className="text-slate-700 dark:text-slate-200">4.9/5</span> (2,500+ reviews)</span>
            </div>
          </div>
      </motion.div>
    </motion.section>
  );
};

// ---SECTION 2: TRUSTED BY COMPANIES (LOGO SCROLLER)---
const InfiniteLogoScroller = () => {
  const logos = [
    { name: "Google", src: "/logos/google.png" }, { name: "Microsoft", src: "/logos/microsoft.png" },
    { name: "Amazon", src: "/logos/amazon.png" }, { name: "L'Oréal", src: "/logos/Loreal.png" },
    { name: "Deloitte", src: "/logos/deloitte.png" }, { name: "Myntra", src: "/logos/myntra.png" },
    { name: "Tata", src: "/logos/tata.png" }, { name: "Wipro", src: "/logos/wipro.png" }
  ];
  return (
    <motion.div 
      className="py-12" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 mb-8">
        TRUSTED BY THE WORLD'S MOST INNOVATIVE COMPANIES
      </p>
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <Marquee gradient={false} speed={40} pauseOnHover>
          <div className="flex items-center justify-center md:justify-start [&_img]:max-w-none animate-infinite-scroll gap-16 px-8">
             {logos.map((logo) => (
                <img key={logo.name} src={logo.src} alt={logo.name} className="h-8 object-contain" />
             ))}
          </div>
        </Marquee>
      </div>
    </motion.div>
  );
};

// ---SECTION 3: WHY CHOOSE US ---
const WhyJobHuntSection = () => {
  const features = [
    { 
      icon: <Cpu size={24} className="text-indigo-300" />, 
      title: "AI-Powered Matching", 
      description: "Our intelligent algorithms go beyond keywords to match your unique skills with the perfect role.",
      glowColor: "from-indigo-500/50"
    },
    { 
      icon: <Bot size={24} className="text-purple-300" />, 
      title: "Career Co-pilot", 
      description: "From resume analysis to interview prep, get personalized AI assistance at every step.",
      glowColor: "from-purple-500/50"
    },
    { 
      icon: <Users size={24} className="text-sky-300" />, 
      title: "Direct to Recruiters", 
      description: "Connect with decision-makers at top companies actively searching for talent like you.",
      glowColor: "from-sky-500/50"
    }
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-gradient"></div>
        <motion.div 
            className="absolute inset-x-0 top-[-200px] h-[500px] bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-sky-500/20 blur-[150px]"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Don't Just Find a Job. Build a Career.
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            JobHunt is more than a job board. We're your strategic partner in career growth.
          </p>
        </motion.div>

        <motion.div 
          className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard feature={feature} key={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- INTERACTIVE FEATURE CARD COMPONENT ---
const FeatureCard = ({ feature }) => {
    const cardRef = useRef(null);
    
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const iconX = useMotionValue(0);
    const iconY = useMotionValue(0);
    const iconXSpring = useSpring(iconX, { stiffness: 400, damping: 20 });
    const iconYSpring = useSpring(iconY, { stiffness: 400, damping: 20 });

    const handleMouseMove = (e) => {
      const rect = cardRef.current.getBoundingClientRect();
      const { width, height } = rect;
      
      const mouseXNorm = (e.clientX - rect.left) / width - 0.5;
      const mouseYNorm = (e.clientY - rect.top) / height - 0.5;
      x.set(mouseXNorm);
      y.set(mouseYNorm);

      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);

      const iconCenterX = 32 + 32;
      const iconCenterY = 32 + 32;
      const distanceX = e.clientX - rect.left - iconCenterX;
      const distanceY = e.clientY - rect.top - iconCenterY;
      const maxPull = 4;
      iconX.set(Math.max(-maxPull, Math.min(maxPull, -distanceX * 0.1)));
      iconY.set(Math.max(-maxPull, Math.min(maxPull, -distanceY * 0.1)));
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      iconX.set(0);
      iconY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            key={feature.title}
            className="group relative p-px bg-gradient-to-br from-white/20 to-white/0 rounded-3xl"
            style={{ 
                transformStyle: "preserve-3d",
                transform: "perspective(1000px)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } }
            }}
        >
            <motion.div
              className="relative h-full p-8 bg-slate-100/60 dark:bg-slate-900/60 rounded-[23px] overflow-hidden"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: useTransform(
                            [mouseX, mouseY],
                            ([latestX, latestY]) => `radial-gradient(circle at ${latestX}px ${latestY}px, rgba(168, 85, 247, 0.15), transparent 80%)`
                        ),
                        opacity: useTransform(x, [-0.5, 0, 0.5], [0, 1, 0])
                    }}
                />

                <div style={{ transform: "translateZ(20px)" }}>
                    <motion.div 
                        className="relative w-16 h-16 flex items-center justify-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-lg mb-6"
                        style={{ x: iconXSpring, y: iconYSpring, transformStyle: "preserve-3d" }}
                    >
                        <div style={{ transform: "translateZ(20px)" }}>
                           {feature.icon}
                        </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-6 flex items-center gap-2 font-semibold text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn More <ArrowRight size={16} />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ---SECTION 4: INTERACTIVE FEATURE SHOWCASE ---
const FeatureShowcase = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabVisuals = [
      {
        background: "from-blue-500/80 to-indigo-600/80",
        visual: (
          <div className="w-full h-full relative flex items-center justify-center p-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 100 }}
                className="absolute w-full h-px bg-white/20"
                style={{ top: `${20 + i * 15}%` }}
              >
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.random() * 50 + 20}%` }}
                  transition={{ delay: i * 0.15 + 0.5, duration: 1, ease: 'easeInOut' }}
                  style={{ marginLeft: `${Math.random() * 30}%` }}
                />
              </motion.div>
            ))}
            <Search className="relative z-10 text-white/50" size={64} strokeWidth={1} />
          </div>
        )
      },
      {
        background: "from-purple-500/80 to-violet-600/80",
        visual: (
           <div className="w-full h-full relative flex items-center justify-center scale-90">
            <motion.div 
              className="relative w-4/5 h-5/6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-6 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-white/80 shadow-[0_0_15px_2px_#ffffffaa]"
                initial={{ y: -10 }}
                animate={{ y: '110%' }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatType: 'loop' }}
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2"><FileText size={18} className="text-white/40"/><div className="h-4 w-3/5 rounded-sm bg-white/20" /></div>
                {[0.8, 0.9, 0.7, 0.85].map((w, i) => (<div key={i} className="h-3 rounded-sm bg-white/20" style={{ width: `${w * 100}%`}} />))}
              </div>
            </motion.div>
             {['Team Player', 'React', 'TypeScript'].map((skill, i) => (
                <motion.div key={skill} className="absolute px-3 py-1 text-xs text-white bg-white/20 backdrop-blur-md rounded-full border border-white/20"
                    style={{ top: `${20 + i * 30}%`, left: i % 2 === 0 ? '-10%' : undefined, right: i % 2 !== 0 ? '-10%' : undefined, }}
                    initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i*0.2, type: 'spring', stiffness: 120 }}>
                    {skill}
                </motion.div>
             ))}
          </div>
        )
      },
      {
        background: "from-rose-500/80 to-pink-600/80",
        visual: (
          <div className="w-full h-full relative flex items-center justify-center scale-90">
             <motion.div 
              className="relative w-4/5 h-5/6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl p-6 overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Bot size={18} className="text-white/40" />
                <div className="h-4 w-2/5 rounded-sm bg-white/20" />
              </div>
              <div className="space-y-2">
                {[0.8, 0.9, 0.5, 0.7].map((w, i) => (
                  <motion.div 
                    key={i}
                    className="h-3 bg-white/70 rounded-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${w * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5, ease: 'easeOut' }}
                  />
                ))}
              </div>
              <motion.div
                className="mt-auto self-end px-3 py-1 text-xs text-white bg-white/20 backdrop-blur-sm rounded-full border border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, type: 'spring' }}
              >
                Generated ✨
              </motion.div>
            </motion.div>
          </div>
        )
      },
      {
        background: "from-sky-500/80 to-cyan-600/80",
        visual: (
          <div className="w-full h-full relative p-6 flex flex-col justify-end gap-3">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100 }} className="w-3/4 p-3 rounded-lg bg-white/20 backdrop-blur-sm self-start text-white/80 text-sm"> Tell me about my career options... </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, type: 'spring', stiffness: 100 }} className="w-3/4 p-3 rounded-lg bg-white/90 backdrop-blur-sm self-end text-slate-700 text-sm"> Of course! Based on your profile... </motion.div>
          </div>
        )
      }
    ];

    const tabs = [
        { name: "Smart Search", icon: <Search />},
        { name: "Resume Scan", icon: <FileText />},
        { name: "Cover Letter", icon: <Bot />},
        { name: "AI Chat", icon: <MessageSquare />}
    ];

    const tabContent = [
        { title: "Pinpoint Precision Search", description: "Find roles that value your unique experience, not just buzzwords. Our semantic search understands the nuances of your skills.", link: "/jobs" },
        { title: "Instant Resume Feedback", description: "Get real-time, AI-driven suggestions to optimize your resume for any job, beating the ATS and impressing recruiters.", link: "/ai/analyze-resume" },
        { title: "Craft a Perfect Cover Letter", description: "Generate a compelling, tailored cover letter in seconds. Just provide the job description and let our AI do the rest.", link: "/ai/cover-letter" },
        { title: "24/7 Career Advisor", description: "Practice interviews, ask for career advice, or get help writing a cover letter. Your AI co-pilot is always ready.", link: "/ai/chat" }
    ];

    return (
        <section className="py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">An Unfair Advantage</h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Our suite of AI tools is designed to put you ahead of the competition.</p>
            </div>
            <div className="max-w-6xl mx-auto mt-16 px-4">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full shadow-inner-md border border-slate-200/50 dark:border-slate-700/50">
                    {tabs.map((tab, i) => (
                        <button 
                            key={tab.name} 
                            onClick={() => setActiveTab(i)} 
                            className={`relative px-3 sm:px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${activeTab === i ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {activeTab === i && <motion.div layoutId="activePill" className="absolute inset-0 bg-white dark:bg-slate-700 rounded-full z-0" style={{borderRadius: 9999}} />}
                            <span className="relative z-10 flex items-center gap-2">{tab.icon} <span className="hidden sm:inline">{tab.name}</span></span>
                        </button>
                    ))}
                </div>

                <div className="mt-8 relative h-[32rem] sm:h-[28rem] overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`absolute inset-0 bg-gradient-to-br ${tabVisuals[activeTab].background}`}
                        >
                            <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20"></div>
                        </motion.div>
                    </AnimatePresence>
                    
                    <div className="relative h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-12">
                        <motion.div 
                            className="md:w-1/2 text-white z-10 text-center md:text-left"
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h3 className="text-3xl font-bold">{tabContent[activeTab].title}</h3>
                            <p className="mt-4 opacity-80 max-w-md mx-auto md:mx-0">{tabContent[activeTab].description}</p>
                            <Link to={tabContent[activeTab].link} className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold hover:bg-white/30 transition-colors">
                                Try it Now <ArrowRight size={16} />
                            </Link>
                        </motion.div>
                        
                        <div className="relative md:w-1/2 h-48 md:h-full w-full mt-8 md:mt-0 z-10">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                                    className="absolute inset-0"
                                >
                                    {tabVisuals[activeTab].visual}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ---SECTION 5: HOW IT WORKS---
const HowItWorksSection = () => {
    const steps = [
        { number: '1', title: 'Create Your Profile', description: 'Sign up in seconds and tell us about your skills and career goals.' },
        { number: '2', title: 'Upload Your Resume', description: 'Our AI analyzes your resume to find the best-fit opportunities.' },
        { number: '3', title: 'Get Matched', description: 'Receive personalized job recommendations directly to your dashboard.' },
        { number: '4', title: 'Apply with Confidence', description: 'Use our tools to tailor your application and ace the interview.' },
    ];
    return (
        <motion.section 
            className="py-20 md:py-28"
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
        >
             <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Your Path to Success is Simple</h2>
            </div>
            <div className="relative mt-16 max-w-5xl mx-auto">
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block" />
                {steps.map((step, i) => (
                    <motion.div 
                        key={step.number} 
                        className={`relative md:w-1/2 flex items-center gap-8 mb-12 ${i % 2 === 0 ? 'md:ml-auto md:pl-16' : 'md:mr-auto md:pr-16 md:flex-row-reverse'}`}
                        initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center text-2xl font-bold bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-white rounded-full shadow-lg">
                            {step.number}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

// --- MAIN HOME COMPONENT ---
export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsLoading(true);
    setHasSearched(true);
    setSearchQuery(query);
    try {
      const response = await axiosInstance.get("/jobs", { 
        params: { 
          search: query,
          page: 1, 
          limit: 10 
        } 
      });
      setSearchResults(response.data.jobs || []);
    } catch (error) {
      toast.error("Failed to load jobs");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setHasSearched(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarkedJobs = await JobService.bookmarks.fetchAll();
        setBookmarks(bookmarkedJobs.map(job => job._id));
      } catch (error) {
        console.log("Bookmarks not loaded - user may not be authenticated");
      }
    };
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (jobId) => {
    try {
      if (bookmarks.includes(jobId)) {
        await JobService.bookmarks.remove(jobId);
        setBookmarks(prev => prev.filter(id => id !== jobId));
        toast.success("Bookmark removed");
      } else {
        await JobService.bookmarks.add(jobId);
        setBookmarks(prev => [...prev, jobId]);
        toast.success("Bookmark added");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login to bookmark jobs");
    }
  };

  return (
    <div className="bg-white dark:bg-[#070912] text-slate-800 dark:text-slate-200">
      <div className="container mx-auto px-4 sm:px-6">
        <HeroSection onSearch={handleSearch} />
        
        {/* Search Results Section */}
        {hasSearched && (
          <div className="relative z-10 -mt-16 mb-20 max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isLoading ? "Searching..." : searchResults.length > 0 
                  ? `Results for "${searchQuery}"` 
                  : "No jobs found"}
              </h2>
              <button 
                onClick={clearSearch}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear search
              </button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200/80 dark:bg-gray-800/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((job) => (
                  <motion.div 
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{job.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {job.company?.name} • {job.location}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.skills?.slice(0, 3).map(skill => (
                            <span key={skill} className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleBookmark(job._id)} 
                        className="text-indigo-500 hover:scale-110 transition"
                        aria-label={bookmarks.includes(job._id) ? "Remove bookmark" : "Add bookmark"}
                      >
                        {bookmarks.includes(job._id) ? 
                          <BookmarkCheck className="w-5 h-5 fill-current" /> : 
                          <Bookmark className="w-5 h-5" />
                        }
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full">
                        {job.employmentType}
                      </span>
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="text-sm flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        View Details <ChevronRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  No jobs found matching "{searchQuery}". Try different keywords.
                </p>
                <Button 
                  onClick={clearSearch} 
                  variant="outline" 
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Only show these sections if no search has been performed */}
        {!hasSearched && (
          <>
            <InfiniteLogoScroller />
            <WhyJobHuntSection />
            <FeatureShowcase />
            <HowItWorksSection />
          </>
        )}
      </div>
    </div>
  );
}