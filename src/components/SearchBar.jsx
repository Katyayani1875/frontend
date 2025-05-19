// src/components/SearchBar.jsx
import { useEffect, useState, useCallback } from "react";
import { MapPin, SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import debounce from "lodash.debounce";

const SearchBar = ({ onSearch }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // Debounced function to trigger search
  const debouncedSearch = useCallback(
    debounce((title, location, category) => {
      if (onSearch) {
        onSearch({ title, location, category });
      }
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(title, location, category);
    // Cancel debounce on unmount
    return () => debouncedSearch.cancel();
  }, [title, location, category, debouncedSearch]);

  const handleManualSearch = () => {
    if (onSearch) onSearch({ title, location, category });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-5xl mx-auto -mt-12 z-10 relative">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Job title */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg w-full">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title or keyword"
            className="bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg w-full">
          <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="bg-transparent border-none focus:ring-0 focus:outline-none dark:text-white"
          />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg w-full">
          <FilterIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-sm dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="it">IT</option>
            <option value="finance">Finance</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Search Button */}
        <Button
          size="lg"
          className="w-full lg:w-auto"
          onClick={handleManualSearch}
        >
          Search Jobs
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
