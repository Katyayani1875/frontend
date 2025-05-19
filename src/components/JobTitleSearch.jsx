// src/components/JobTitleSearch.jsx
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";

export default function JobTitleSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Debounced fetch 
  const fetchSuggestions = debounce(async (searchText) => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`/api/jobs/search/suggestions?query=${searchText}`);
      setSuggestions(res.data.suggestions || []); 
    } catch (err) {
      console.error("Error fetching job title suggestions:", err);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (title) => {
    setQuery(title);
    setShowDropdown(false);
    onSelect?.(title);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <Search size={18} className="text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Job title or keyword"
          className="bg-transparent w-full outline-none text-sm text-gray-800 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((title, i) => (
            <li
              key={i}
              onClick={() => handleSelect(title)}
              className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
