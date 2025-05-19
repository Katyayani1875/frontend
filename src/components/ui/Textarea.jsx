import React from 'react';

const Textarea = ({ ...props }) => {
  return (
    <textarea
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows="4"
      {...props}
    />
  );
};

export { Textarea };
export default Textarea;
