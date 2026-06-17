import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

/**
 * Reusable input bar for typing searches and selecting real-time autocompletion suggestions.
 */
const TutorSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  suggestions = [], 
  setSuggestions, 
  onSelectSuggestion 
}) => {
  return (
    <div className="flex-1 flex flex-col relative w-full">
      <div className="flex items-center border border-gray-250 hover:border-primary-400 focus-within:border-primary-500 rounded-xl px-3.5 bg-gray-50/50 transition-colors">
        <MagnifyingGlassIcon className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search name or keywords..."
          className="w-full py-3 bg-transparent focus:outline-none text-gray-800 text-sm placeholder-gray-400 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Trie Autocomplete Suggestions box */}
      {suggestions && suggestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-150 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto text-left text-gray-750 divide-y divide-gray-50"
        >
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="px-4 py-3 hover:bg-primary-50 hover:text-primary-950 cursor-pointer text-sm font-medium transition-colors"
              onClick={() => {
                onSelectSuggestion(sug);
                setSuggestions([]);
              }}
            >
              {sug.charAt(0).toUpperCase() + sug.slice(1)}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TutorSearch;
