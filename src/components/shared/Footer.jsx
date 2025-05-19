import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600 dark:text-gray-300">
        
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">JobHunt</h2>
          <p className="mb-4">
            Your intelligent career partner. Discover, apply, and grow with AI-powered features.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-blue-500"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-blue-500"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-blue-500"><FaGithub size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Jobs</h3>
          <ul className="space-y-2">
            <li><Link to="/jobs" className="hover:text-blue-500">Browse Jobs</Link></li>
            <li><Link to="/ai/recommend-jobs" className="hover:text-blue-500">Recommended Jobs</Link></li>
            <li><Link to="/bookmarks" className="hover:text-blue-500">Bookmarked</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">AI Tools</h3>
          <ul className="space-y-2">
            <li><Link to="/ai/cover-letter" className="hover:text-blue-500">Cover Letter Generator</Link></li>
            <li><Link to="/ai/analyze-resume" className="hover:text-blue-500">Resume Analyzer</Link></li>
            <li><Link to="/ai/chat" className="hover:text-blue-500">Chat Assistant</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/login" className="hover:text-blue-500">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-500">Register</Link></li>
            <li><a href="#" className="hover:text-blue-500">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} JobHunt. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
