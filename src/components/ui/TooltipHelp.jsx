import React from "react";

export const TooltipHelp = ({ text }) => {
  return (
    <div className="relative group inline-block ml-2">
      <span className="cursor-pointer text-blue-400">?</span>
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded shadow-md mt-2 w-48 z-10">
        {text}
      </div>
    </div>
  );
};
