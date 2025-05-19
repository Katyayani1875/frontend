import React from 'react';

const Input = ({ type = "text", ...props }) => {
  return (
    <input
      type={type}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  );
};

export { Input };
export default Input;
