import React from 'react';
import { Ban } from 'lucide-react'; 

const EmptyState = ({ title = "No Data Found", message = "Looks like there's nothing here yet." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-[#0C1A2B] text-white transition-all duration-500 rounded-2xl shadow-inner">
      
      {/* Icon */}
      <div className="bg-[#1A2E45] p-6 rounded-full shadow-md mb-6 animate-bounce-slow">
        <Ban className="w-10 h-10 text-blue-500" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      
      {/* Message */}
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
};

export default EmptyState;
