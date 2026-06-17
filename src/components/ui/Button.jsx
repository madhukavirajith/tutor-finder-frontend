import React from 'react';

/**
 * Reusable premium button component supporting multiple color styles and loading spinners.
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  loading = false, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 py-2.5 px-4 text-sm',
    secondary: 'bg-white border border-gray-250 text-gray-700 hover:bg-gray-50/80 py-2.5 px-4 text-sm',
    danger: 'bg-rose-650 hover:bg-rose-700 text-white shadow-md shadow-rose-500/10 hover:shadow-lg py-2.5 px-4 text-sm'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
