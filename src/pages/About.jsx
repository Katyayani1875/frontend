// src/pages/About.jsx

import { motion } from 'framer-motion';
import { Rocket, Search, Bot, Briefcase, Users, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button'; // Assuming you have a custom Button component
import CountUp from 'react-countup'; // You'll need to install this: npm install react-countup

const features = [
  { icon: <Search className="w-8 h-8" />, title: 'Smart Job Search', description: 'AI recommendations tailored to your unique skills and career goals.' },
  { icon: <Briefcase className="w-8 h-8" />, title: 'Resume Analyzer', description: 'Instant, data-driven feedback to optimize your resume for ATS and recruiters.' },
  { icon: <Bot className="w-8 h-8" />, title: 'Career Co-pilot', description: 'Your 24/7 AI assistant for interview prep, career advice, and more.' },
  { icon: <Users className="w-8 h-8" />, title: 'Employer Toolkit', description: 'AI-powered tools for creating job posts and reaching the right talent efficiently.' },
];

const stats = [
    { value: 50000, label: 'Jobs Matched', suffix: '+' },
    { value: 98, label: 'User Satisfaction', suffix: '%' },
    { value: 500, label: 'Partner Companies', suffix: '+' },
    { value: 12, label: 'Seconds to First Match', suffix: 's' }
];

const About = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      <motion.section 
        className="relative py-24 md:py-32 text-center overflow-hidden bg-slate-50 dark:bg-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:to-slate-800 opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          >
            Empowering Careers.
          </motion.h1>
          <motion.h2 
            className="text-4xl md:text-6xl font-extrabold tracking-tighter text-slate-800 dark:text-white"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
          >
            Connecting Talent with Opportunity.
          </motion.h2>
          <motion.p 
            className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
          >
            Your trusted platform for smarter job searches and smarter hiring, powered by intelligent AI.
          </motion.p>
        </div>
      </motion.section> {/* <-- THIS IS THE MISSING CLOSING TAG */}

      {/* Our Mission Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 inline-block rounded-xl mb-4 text-indigo-600 dark:text-indigo-400">
                        <Target size={32}/>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        At JobHunt, our mission is to revolutionize the hiring process by using AI-driven tools that empower job seekers and employers alike. Whether you're seeking your first job, a career change, or top talent — JobHunt helps you succeed faster and smarter.
                    </p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                    <ul className="space-y-4">
                        <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0"/><span><strong className="text-slate-900 dark:text-white">For Job Seekers:</strong> We provide personalized recommendations, resume feedback, and interview prep to help you land your dream job.</span></li>
                        <li className="flex items-start"><CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0"/><span><strong className="text-slate-900 dark:text-white">For Employers:</strong> We offer intelligent tools to craft better job descriptions, identify top candidates, and streamline the hiring workflow.</span></li>
                    </ul>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">The JobHunt Advantage</h2>
            <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
              {features.map((feature) => (
                <motion.div key={feature.title} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-transparent hover:border-indigo-500/50 transition-all text-left" variants={itemVariants}>
                    <div className="mb-4 text-indigo-500">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>
      
      {/* Our Impact Section (Stats) */}
       <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-12">Our Impact in Numbers</h2>
             <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={containerVariants}
             >
                {stats.map(stat => (
                    <motion.div key={stat.label} className="text-center" variants={itemVariants}>
                        <p className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-2">
                           <CountUp end={stat.value} duration={3} enableScrollSpy scrollSpyOnce/>
                           {stat.suffix}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    </motion.div>
                ))}
             </motion.div>
        </div>
       </section>

      {/* Call to Action */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-6 text-center">
             <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.8 }}
                variants={itemVariants}
             >
                <Rocket className="mx-auto h-12 w-12 text-indigo-500 mb-4"/>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to Take the Next Step?</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                  Whether you’re a job seeker or an employer, JobHunt has the tools you need to succeed.
                </p>
                <div className="flex justify-center flex-wrap gap-4">
                  <Button asChild size="lg" className="font-semibold">
                    <Link to="/register">Join Now <ArrowRight className="ml-2 w-5 h-5"/></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="font-semibold">
                    <Link to="/jobs">Explore Jobs</Link>
                  </Button>
                </div>
             </motion.div>
          </div>
      </section>
    </div>
  );
};

export default About;
// import { motion } from 'framer-motion';
// import { RocketIcon, SearchIcon, BotIcon, BriefcaseIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const features = [
//   {
//     icon: <SearchIcon className="w-6 h-6" />,
//     title: 'Smart Job Search',
//     description: 'Find your dream job using AI recommendations based on your resume and interests.',
//   },
//   {
//     icon: <BriefcaseIcon className="w-6 h-6" />,
//     title: 'AI-Powered Resume Analysis',
//     description: 'Instant feedback on your resume to help you stand out from the crowd.',
//   },
//   {
//     icon: <BotIcon className="w-6 h-6" />,
//     title: '24/7 AI Chat Assistant',
//     description: 'Ask career questions, get interview help, or explore new opportunities — instantly.',
//   },
//   {
//     icon: <RocketIcon className="w-6 h-6" />,
//     title: 'Boost Employer Reach',
//     description: 'Employers can create compelling job posts using AI, reach more talent efficiently.',
//   },
// ];

// const About = () => {
//   const navigate = useNavigate();

//   return (
//     <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-100 dark:bg-gray-800">
//       {/* Hero Section */}
//       <div className="text-center mb-16">
//         <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
//           Empowering Careers. Connecting Talent with Opportunity.
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-400">
//           Your trusted platform for smarter job searches and smarter hiring.
//         </p>
//       </div>

//       {/* Our Mission */}
//       <div className="max-w-4xl mx-auto text-center mb-16 ">
//         <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Why We Exist?</h2>
//         <p className="text-lg text-gray-600 dark:text-gray-400">
//           At Job Hunt, our mission is to revolutionize the hiring process by using AI-driven tools that empower job seekers and employers alike. Whether you're seeking your first job, a career change, or top talent — Job Hunt helps you succeed faster and smarter.
//         </p>
//       </div>

//       {/* Key Features Highlight */}
//       <div className="max-w-6xl mx-auto px-6 mb-16">
//         <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, i) => (
//             <motion.div
//               key={i}
//               className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition"
//               whileHover={{ scale: 1.03 }}
//             >
//               <div className="mb-4 text-blue-600">{feature.icon}</div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
//                 {feature.title}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Our Journey */}
//       <div className="max-w-6xl mx-auto text-center mb-16">
//         <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Our Journey</h2>
//         <div className="flex flex-wrap justify-center gap-8">
//           <div className="p-4">
//             <h3 className="text-4xl font-bold text-blue-600">2022</h3>
//             <p className="text-gray-600 dark:text-gray-400">Launched</p>
//           </div>
//           <div className="p-4">
//             <h3 className="text-4xl font-bold text-blue-600">50,000+</h3>
//             <p className="text-gray-600 dark:text-gray-400">Jobs Posted</p>
//           </div>
//           <div className="p-4">
//             <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
//             <p className="text-gray-600 dark:text-gray-400">Successful Hires</p>
//           </div>
//           <div className="p-4">
//             <h3 className="text-4xl font-bold text-blue-600">500+</h3>
//             <p className="text-gray-600 dark:text-gray-400">Companies Onboard</p>
//           </div>
//         </div>
//       </div>

//       {/* Call to Action */}
//       <div className="text-center">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
//           Ready to Take the Next Step?
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
//           Whether you’re a job seeker or an employer, Job Hunt has the tools you need to succeed.
//         </p>
//         <div className="flex justify-center gap-4">
//           <button
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//             onClick={() => navigate('/register')}
//           >
//             Join Now
//           </button>
//           <button
//             className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
//             onClick={() => navigate('/jobs')}
//           >
//             Explore Jobs
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default About;
