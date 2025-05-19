import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-12 bg-[#0C1A2B] transition-colors duration-500">
      <div className="relative">
        {/* Outer Ping Effect */}
        <div
          className="w-14 h-14 rounded-full 
          bg-blue-500 
          animate-ping 
          absolute 
          opacity-50"
        ></div>

        {/* Main Loader Circle */}
        <div
          className="w-14 h-14 rounded-full 
          bg-gradient-to-tr from-blue-500 to-blue-700 
          shadow-[0_0_25px_5px_rgba(59,130,246,0.6)] 
          border-[3px] border-[#0C1A2B]
        "></div>
      </div>
    </div>
  );
};

export default Loader;
