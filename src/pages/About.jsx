import { motion } from 'framer-motion';
import { Rocket, Search, Bot, Briefcase, Users, Target, CheckCircle, ArrowRight, Sparkles, BarChart2, Clock, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import CountUp from 'react-countup';

const features = [
  { 
    icon: <Search className="w-8 h-8" />, 
    title: 'Smart Job Search', 
    description: 'AI recommendations tailored to your unique skills and career goals.',
    gradient: 'from-blue-500 to-indigo-600'
  },
  { 
    icon: <Briefcase className="w-8 h-8" />, 
    title: 'Resume Analyzer', 
    description: 'Instant, data-driven feedback to optimize your resume for ATS and recruiters.',
    gradient: 'from-purple-500 to-fuchsia-600'
  },
  { 
    icon: <Bot className="w-8 h-8" />, 
    title: 'Career Co-pilot', 
    description: 'Your 24/7 AI assistant for interview prep, career advice, and more.',
    gradient: 'from-amber-500 to-orange-600'
  },
  { 
    icon: <Users className="w-8 h-8" />, 
    title: 'Employer Toolkit', 
    description: 'AI-powered tools for creating job posts and reaching the right talent efficiently.',
    gradient: 'from-emerald-500 to-teal-600'
  },
];

const stats = [
    { value: 50000, label: 'Jobs Matched', suffix: '+', icon: <BarChart2 className="w-8 h-8" /> },
    { value: 98, label: 'User Satisfaction', suffix: '%', icon: <UserCheck className="w-8 h-8" /> },
    { value: 500, label: 'Partner Companies', suffix: '+', icon: <Briefcase className="w-8 h-8" /> },
    { value: 12, label: 'Seconds to First Match', suffix: 's', icon: <Clock className="w-8 h-8" /> }
];

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 15
      } 
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-300/30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-300/30 blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              AI-Powered Career Platform
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Empowering</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Careers.</span>
          </motion.h1>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-gray-800 dark:text-gray-200"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Connecting Talent with Opportunity.
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            Your trusted platform for smarter job searches and smarter hiring, powered by intelligent AI.
          </motion.p>
          
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center gap-4"
          >
            <Button asChild size="xl" className="font-semibold">
              <Link to="/register">Get Started</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="font-semibold">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950/50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="grid lg:grid-cols-2 gap-16 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Our Purpose
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Revolutionizing the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Hiring Process</span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                At JobHunt, our mission is to transform career growth and talent acquisition through AI-driven innovation. We're building the future of work by connecting exceptional talent with visionary companies.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">For Job Seekers</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Personalized career guidance, resume optimization, and interview mastery.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">For Employers</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Intelligent hiring tools to attract and retain top industry talent.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl -z-10"></div>
              <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Commitment</h3>
                  </div>
                  
                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Personalized Matching</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          AI that understands your unique career aspirations and skills.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Transparent Process</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Clear insights into application status and recruiter feedback.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Continuous Support</h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Career guidance from application to offer acceptance.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-950/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm mb-6">
              The JobHunt Advantage
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              AI-Powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Career Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Cutting-edge technology designed to give you an edge in today's competitive job market.
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0" />
                <div className="relative z-10 h-full bg-white dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  <div className="mt-6">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:underline">
                      Learn more
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-95"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-white/20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Our Impact <span className="text-white/80">in Numbers</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Trusted by thousands of job seekers and employers worldwide
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white mx-auto mb-6">
                  {stat.icon}
                </div>
                <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                  <CountUp 
                    end={stat.value} 
                    duration={3} 
                    enableScrollSpy 
                    scrollSpyOnce
                    formattingFn={(value) => `${value}${stat.suffix}`}
                  />
                </p>
                <p className="text-white/80 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-16">
                <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-8">
                  <Rocket className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-white mb-6">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of professionals who found their dream jobs through JobHunt's AI-powered platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="xl" className="font-semibold bg-white text-gray-900 hover:bg-gray-100">
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button asChild size="xl" variant="outline" className="font-semibold text-white border-white/30 hover:bg-white/10">
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[size:200px] opacity-10"></div>
                <div className="h-full w-full bg-gray-800"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;