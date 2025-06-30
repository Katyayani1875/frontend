// src/components/ui/LoadingSpinner.jsx

import { Loader2 } from "lucide-react";

/**
 * A simple, reusable loading spinner component.
 */
const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    default: "h-8 w-8",
    lg: "h-12 w-12",
    sm: "h-4 w-4",
  };

  return (
    <div className="flex justify-center items-center w-full py-10">
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
    </div>
  );
};

export default LoadingSpinner;