import React from "react";

export const ResumeUploader = ({ onUpload }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
};
