import React, { forwardRef } from 'react';

/**
 * Reusable dropdown select field component supporting custom icons and validation error states.
 */
const Select = forwardRef(({ label, icon, error, children, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 outline-none appearance-none transition-all ${icon ? 'pl-10' : ''} ${
            error ? 'border-rose-300 bg-rose-50/5' : 'border-gray-250 focus:bg-white bg-gray-50/30'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;