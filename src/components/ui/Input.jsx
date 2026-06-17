import React, { forwardRef } from 'react';

/**
 * Reusable input field component supporting optional icons and validation error states.
 */
const Input = forwardRef(({ label, icon, error, type = 'text', className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 outline-none transition-all ${icon ? 'pl-10' : ''} ${
            error ? 'border-rose-300 bg-rose-50/5' : 'border-gray-250 focus:bg-white bg-gray-50/30'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;