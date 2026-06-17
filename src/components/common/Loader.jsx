import React from 'react';

/**
 * Premium Loading Spinner component.
 */
const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 opacity-35"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary-600 animate-spin"></div>
      </div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">
        Loading Details...
      </p>
    </div>
  );
};

export default Loader;