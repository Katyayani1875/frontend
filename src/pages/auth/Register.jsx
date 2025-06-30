// src/pages/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen flex font-['Inter'] bg-white text-gray-800 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Left Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white p-13">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md space-y-6"
        >
          <img src="/logos/register.jpg" alt="Logo" className="w-700 h-700 rounded-lg object-cover shadow-xl mb-6" />
          <h1 className="text-4xl font-bold leading-tight font-['Playfair_Display']">
            Join a Premium Network of Professionals
          </h1>
          <p className="text-lg opacity-90">
            Discover jobs, build your profile, and connect with top companies using AI.
          </p>
        </motion.div>
      </div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex items-center justify-center px-6 py-12 z-10"
      >
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-6 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900">Create Your Account</h2>

          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={formData.showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-3 pr-12 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength="6"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              {formData.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91"
              className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <div className="flex flex-wrap gap-2">
              {['Male', 'Female'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: label })}
                  className={`flex items-center gap-1 border rounded-full px-4 py-2 text-sm ${
                    formData.gender === label ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {label === 'Male' ? '♂️' : '♀️'} {label}
                </button>
              ))}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMoreGenders(!showMoreGenders)}
                  className={`flex items-center gap-1 border rounded-full px-4 py-2 text-sm ${
                    ['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].includes(formData.gender)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  ❓ More Options
                </button>

                {showMoreGenders && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border rounded-lg shadow-lg text-sm">
                    {['Transgender', 'Intersex', 'Non Binary', 'Prefer not to say', 'Others'].map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, gender: option });
                          setShowMoreGenders(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Terms */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2 form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-600">
              All your information is collected, stored and processed as per our guidelines. By signing up, you agree to our{' '}
              <Link to="/privacy" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="text-blue-500 hover:underline">
                Terms of Use
              </Link>.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:brightness-110 transition shadow-md font-semibold disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin w-5 h-5 mr-2" /> Creating...
              </span>
            ) : (
              'Register'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;