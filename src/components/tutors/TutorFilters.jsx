import React from 'react';
import { AdjustmentsHorizontalIcon, MapPinIcon, BookOpenIcon } from '@heroicons/react/24/outline';

/**
 * Reusable sidebar filter component for selecting subjects, locations, and recommendation engines.
 */
const TutorFilters = ({ 
  location, 
  setLocation, 
  subject, 
  setSubject, 
  subjects = [], 
  sortMode, 
  setSortMode 
}) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center space-x-2 border-b pb-4">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600" />
        <h3 className="font-bold text-gray-900 text-base">Filter Directory</h3>
      </div>

      <div className="space-y-5">
        {/* Location Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
          <div className="flex items-center border border-gray-250 hover:border-primary-400 focus-within:border-primary-500 rounded-xl px-3 bg-gray-50/50 transition-colors">
            <MapPinIcon className="h-4.5 w-4.5 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="e.g. Colombo, Remote"
              className="w-full py-2.5 bg-transparent focus:outline-none text-sm text-gray-800 font-medium"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
          <div className="relative">
            <select
              className="w-full py-2.5 pl-3 pr-8 border border-gray-250 rounded-xl bg-gray-50/50 text-gray-700 text-sm font-medium focus:outline-none cursor-pointer focus:border-primary-500 transition-colors appearance-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Sort Recommendation Filter */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort Engine</label>
          <div className="relative">
            <select
              className="w-full py-2.5 pl-3 pr-8 border border-gray-250 rounded-xl bg-gray-50/50 text-gray-700 text-sm font-medium focus:outline-none cursor-pointer focus:border-primary-500 transition-colors appearance-none"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
            >
              <option value="DEFAULT">Default List</option>
              <option value="LOCATION">Sort: Location match</option>
              <option value="BIO">Sort: Bio relevance</option>
              <option value="HYBRID">Sort: Smart recommendation</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorFilters;
