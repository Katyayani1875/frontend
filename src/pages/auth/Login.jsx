// src/pages/auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosInstance';
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
      const { data } = await axiosInstance.post('/users/login', { email, password });
      const token = data?.token;

      if (token) {
        localStorage.setItem('token', token);
        
        // Fetch user data and update auth context
        const res = await axiosInstance.get('/users/me');
        login(res.data, token);

        toast.success("Login successful");
        navigate('/dashboard');
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-800">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
            Sign in to access your personalized dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                className="w-full px-5 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                className="w-full px-5 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none group"
            >
              <span className="relative">
                {loading ? (
                  <>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span className="invisible">Login Now</span>
                  </>
                ) : (
                  <>
                    Login Now
                    <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:ml-3 transition-all duration-200">
                      &rarr;
                    </span>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-700 dark:text-white">Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium transition-colors duration-200">
              Create one now
            </Link>
          </p>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 w-1/2 p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#FFFFFF" d="M45.8,-45.8C59.4,-32.1,70.8,-16,70.5,0.2C70.2,16.4,58.2,32.8,44.6,45.8C31,58.8,15.5,68.4,-1.1,69.5C-17.7,70.6,-35.4,63.2,-48.4,50.2C-61.4,37.2,-69.7,18.6,-69.6,0.1C-69.5,-18.4,-61.1,-36.8,-48.1,-50.5C-35.1,-64.1,-17.6,-72.9,-0.3,-72.6C17,-72.3,34,-62.8,45.8,-45.8Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Secure Access</h3>
            <p className="text-blue-100 max-w-md mx-auto">
              Your data is protected with industry-leading encryption and security protocols.
            </p>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-white bg-opacity-30"></div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
// // src/pages/auth/Login.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import axiosInstance from '../../utils/axiosInstance';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error("All fields are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.post('/users/login', { email, password });
//       const token = data?.token;

//       if (token) {
//         localStorage.setItem('token', token);
        
//         // Fetch user data and update auth context
//         const res = await axiosInstance.get('/users/me');
//         login(res.data, token);

//         toast.success("Login successful");
//         navigate('/dashboard');
//       } else {
//         toast.error("Login failed: No token received");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       toast.error(err.response?.data?.message || "An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-blue-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="w-full max-w-5xl bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
//         {/* Left: Login Form */}
//         <div className="w-full md:w-1/2 p-10">
//           <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">LOGIN</h2>
//           <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
//             How to get started lorem ipsum dolor at?
//           </p>

//           <form onSubmit={handleLogin} className="space-y-5">
//             <div>
//               <input
//                 type="email"
//                 className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Email"
//                 required
//               />
//             </div>

//             <div>
//               <input
//                 type="password"
//                 className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-70"
//             >
//               {loading ? 'Logging in...' : 'Login Now'}
//             </button>
//           </form>

//           <div className="my-6 flex items-center gap-2">
//             <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
//             <span className="text-sm text-gray-500 dark:text-gray-400">Login with Others</span>
//             <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
//           </div>

//           <div className="space-y-4">
//             <button 
//               type="button"
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
//               <span className="text-sm font-medium text-gray-700 dark:text-white">Login with <b>Google</b></span>
//             </button>
//             <button 
//               type="button"
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               <img src="https://www.svgrepo.com/show/452196/facebook-1.svg" alt="Facebook" className="w-5 h-5" />
//               <span className="text-sm font-medium text-gray-700 dark:text-white">Login with <b>Facebook</b></span>
//             </button>
//           </div>

//           <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-blue-600 hover:underline font-medium">
//               Register
//             </Link>
//           </p>
//         </div>

//         {/* Right: Illustration */}
//         <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 w-1/2 p-10 relative">
//           <div className="bg-white p-4 rounded-2xl shadow-xl">
//             <img
//               src="/logos/login.png" 
//               alt="Login Visual"
//               className="rounded-2xl object-cover w-72 h-72"
//             />
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Login;