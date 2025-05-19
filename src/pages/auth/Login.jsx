import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/users/login', { email, password });
      const token = data?.token;

      if (token) {
        localStorage.setItem('token', token);

      
        const res = await api.get('/users/me');
        login(res.data, token); 

        toast.success("Login successful");
        navigate('/home');
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">LOGIN</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
            How to get started lorem ipsum dolor at?
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <div>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-2">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Login with Others</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 dark:text-white">Login with <b>Google</b></span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 dark:text-white">Login with <b>Facebook</b></span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 w-1/2 p-10 relative">
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            <img
              src="/logos/login.png" 
              alt="Login Visual"
              className="rounded-2xl object-cover w-72 h-72"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
