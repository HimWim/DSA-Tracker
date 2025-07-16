// src/components/common/Spinner.jsx

import React from 'react';

/**
 * A simple, centered loading spinner component.
 */
const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );
};

export default Spinner;
