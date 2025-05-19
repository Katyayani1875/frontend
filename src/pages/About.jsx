import { motion } from 'framer-motion';
import { RocketIcon, SearchIcon, BotIcon, BriefcaseIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: <SearchIcon className="w-6 h-6" />,
    title: 'Smart Job Search',
    description: 'Find your dream job using AI recommendations based on your resume and interests.',
  },
  {
    icon: <BriefcaseIcon className="w-6 h-6" />,
    title: 'AI-Powered Resume Analysis',
    description: 'Instant feedback on your resume to help you stand out from the crowd.',
  },
  {
    icon: <BotIcon className="w-6 h-6" />,
    title: '24/7 AI Chat Assistant',
    description: 'Ask career questions, get interview help, or explore new opportunities — instantly.',
  },
  {
    icon: <RocketIcon className="w-6 h-6" />,
    title: 'Boost Employer Reach',
    description: 'Employers can create compelling job posts using AI, reach more talent efficiently.',
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-100 dark:bg-gray-800">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Empowering Careers. Connecting Talent with Opportunity.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your trusted platform for smarter job searches and smarter hiring.
        </p>
      </div>

      {/* Our Mission */}
      <div className="max-w-4xl mx-auto text-center mb-16 ">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Why We Exist?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          At Job Hunt, our mission is to revolutionize the hiring process by using AI-driven tools that empower job seekers and employers alike. Whether you're seeking your first job, a career change, or top talent — Job Hunt helps you succeed faster and smarter.
        </p>
      </div>

      {/* Key Features Highlight */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-4 text-blue-600">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Journey */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Our Journey</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="p-4">
            <h3 className="text-4xl font-bold text-blue-600">2022</h3>
            <p className="text-gray-600 dark:text-gray-400">Launched</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-blue-600">50,000+</h3>
            <p className="text-gray-600 dark:text-gray-400">Jobs Posted</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
            <p className="text-gray-600 dark:text-gray-400">Successful Hires</p>
          </div>
          <div className="p-4">
            <h3 className="text-4xl font-bold text-blue-600">500+</h3>
            <p className="text-gray-600 dark:text-gray-400">Companies Onboard</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Ready to Take the Next Step?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Whether you’re a job seeker or an employer, Job Hunt has the tools you need to succeed.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => navigate('/register')}
          >
            Join Now
          </button>
          <button
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            onClick={() => navigate('/jobs')}
          >
            Explore Jobs
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
