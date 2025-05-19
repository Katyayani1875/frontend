import React from "react";

export const FloatingLabelInput = ({ label, ...props }) => {
  return (
    <div className="relative w-full">
      <input
        {...props}
        className="peer w-full p-2 border border-white/20 rounded-md bg-transparent text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={label}
      />
      <label className="absolute left-2 top-2 text-sm text-white transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-400">
        {label}
      </label>
    </div>
  );
};
