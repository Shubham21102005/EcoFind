import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';
  
  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : 'border-secondary-300';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <input 
        type={type}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;