// src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    role: 'candidate',
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [showMoreGenders, setShowMoreGenders] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // All existing logic remains exactly the same
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, role, phone, gender } = formData;

    if (!name || !email || !password || !role || !phone || !gender) {
      toast.error('All fields are required');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/users/register', {
        name,
        email,
        password,
        role,
        phone,
        gender
      });

      if (data.token) {
        login(data.user, data.token);
        toast.success('Registration successful. Logged in!');
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Left Section - Visual */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-95"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-white/15 backdrop-blur-sm"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md px-12 space-y-8 text-center"
        >
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-white mb-6 leading-tight"
            >
              Join a Premium Network of Professionals
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90"
            >
              Discover jobs, build your profile, and connect with top companies using AI.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
          >
            <p className="text-white/80 text-sm">
              All your information is collected, stored and processed as per our guidelines. By signing up, you agree to our{' '}
              <Link to="/privacy" className="text-white underline hover:no-underline">Privacy Policy</Link> and{' '}
              <Link to="/terms" className="text-white underline hover:no-underline">Terms of Use</Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section - Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="mb-10 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Create Your Account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500 dark:text-gray-400"
            >
              Join our community of professionals and employers
            </motion.p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={formData.showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (___) ___-____"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </motion.div>

            {/* Gender */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <div className="flex flex-wrap gap-2">
                {['Male', 'Female'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: label })}
                    className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm transition-all ${
                      formData.gender === label 
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {label === 'Male' ? '♂' : '♀'} {label}
                  </button>
                ))}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoreGenders(!showMoreGenders)}
                    className={`flex items-center gap-2 border rounded-full px-4 py-2 text-sm transition-all ${
                      ['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].includes(formData.gender)
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                        : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    ❓ More Options
                  </button>

                  {showMoreGenders && (
                    <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                      {['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            setFormData({ ...formData, gender: option });
                            setShowMoreGenders(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I'm joining as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                required
              >
                <option value="candidate">Candidate (Looking for jobs)</option>
                <option value="employer">Employer (Hiring talent)</option>
              </select>
            </motion.div>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start"
            >
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:shadow-none group"
              >
                <span className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </>
                  )}
                </span>
              </button>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2"
            >
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                Sign in
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
// // src/pages/auth/Register.jsx
// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { motion } from 'framer-motion';
// import { Loader2, Eye, EyeOff } from 'lucide-react';
// import axiosInstance from '../../utils/axiosInstance';
// import { useAuth } from '../../context/AuthContext';

// const Register = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     gender: '',
//     role: 'candidate',
//     showPassword: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [showMoreGenders, setShowMoreGenders] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? e.target.checked : value,
//     }));
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const { name, email, password, role, phone, gender } = formData;

//     if (!name || !email || !password || !role || !phone || !gender) {
//       toast.error('All fields are required');
//       return;
//     }

//     if (!termsAccepted) {
//       toast.error('Please accept the terms and conditions');
//       return;
//     }

//     if (password.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.post('/users/register', {
//         name,
//         email,
//         password,
//         role,
//         phone,
//         gender
//       });

//       if (data.token) {
//         login(data.user, data.token);
//         toast.success('Registration successful. Logged in!');
//         navigate('/dashboard');
//       } else {
//         toast.error(data.message || 'Registration failed');
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       toast.error(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex font-['Inter'] bg-white text-gray-800 relative overflow-hidden">
//       {/* Decorative Blobs */}
//       <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
//       <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

//       {/* Left Section */}
//       <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white p-13">
//         <motion.div
//           initial={{ x: -50, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="max-w-md space-y-6"
//         >
//           <img src="/logos/register.jpg" alt="Logo" className="w-700 h-700 rounded-lg object-cover shadow-xl mb-6" />
//           <h1 className="text-4xl font-bold leading-tight font-['Playfair_Display']">
//             Join a Premium Network of Professionals
//           </h1>
//           <p className="text-lg opacity-90">
//             Discover jobs, build your profile, and connect with top companies using AI.
//           </p>
//         </motion.div>
//       </div>

//       {/* Right Section */}
//       <motion.div
//         initial={{ x: 50, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 z-10"
//       >
//         <form
//           onSubmit={handleRegister}
//           className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-6 backdrop-blur-sm"
//         >
//           <h2 className="text-3xl font-bold text-center text-gray-900">Create Your Account</h2>

//           {/* Name */}
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           {/* Email */}
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={formData.showPassword ? 'text' : 'password'}
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password (min 6 characters)"
//               className="w-full px-4 py-3 pr-12 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               minLength="6"
//             />
//             <button
//               type="button"
//               onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
//               className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-800"
//             >
//               {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="+91"
//               className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Gender</label>
//             <div className="flex flex-wrap gap-2">
//               {['Male', 'Female'].map((label) => (
//                 <button
//                   key={label}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, gender: label })}
//                   className={`flex items-center gap-1 border rounded-full px-4 py-2 text-sm ${
//                     formData.gender === label ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-700'
//                   }`}
//                 >
//                   {label === 'Male' ? '♂️' : '♀️'} {label}
//                 </button>
//               ))}
//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() => setShowMoreGenders(!showMoreGenders)}
//                   className={`flex items-center gap-1 border rounded-full px-4 py-2 text-sm ${
//                     ['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].includes(formData.gender)
//                       ? 'bg-blue-500 text-white border-blue-500'
//                       : 'border-gray-300 text-gray-700'
//                   }`}
//                 >
//                   ❓ More Options
//                 </button>

//                 {showMoreGenders && (
//                   <div className="absolute z-10 mt-2 w-48 bg-white border rounded-lg shadow-lg text-sm">
//                     {['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].map((option) => (
//                       <div
//                         key={option}
//                         onClick={() => {
//                           setFormData({ ...formData, gender: option });
//                           setShowMoreGenders(false);
//                         }}
//                         className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       >
//                         {option}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Role</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="candidate">Candidate</option>
//               <option value="employer">Employer</option>
//             </select>
//           </div>

//           {/* Terms */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="termsAccepted"
//               name="termsAccepted"
//               checked={termsAccepted}
//               onChange={(e) => setTermsAccepted(e.target.checked)}
//               className="mr-2 form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
//               required
//             />
//             <label htmlFor="termsAccepted" className="text-sm text-gray-600">
//               All your information is collected, stored and processed as per our guidelines. By signing up, you agree to our{' '}
//               <Link to="/privacy" className="text-blue-500 hover:underline">
//                 Privacy Policy
//               </Link>{' '}
//               and{' '}
//               <Link to="/terms" className="text-blue-500 hover:underline">
//                 Terms of Use
//               </Link>.
//             </label>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:brightness-110 transition shadow-md font-semibold disabled:opacity-70"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <Loader2 className="animate-spin w-5 h-5 mr-2" /> Creating...
//               </span>
//             ) : (
//               'Register'
//             )}
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-blue-500 hover:underline">
//               Login here
//             </Link>
//           </p>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default Register;