import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Job Hunt</h1>
        <p>Your journey to the perfect job starts here.</p>
        <button onClick={() => navigate('/home')}>Enter Site</button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
