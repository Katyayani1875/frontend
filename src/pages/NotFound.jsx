import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Ghost } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900">
      <Ghost className="w-16 h-16 text-blue-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
