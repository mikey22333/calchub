import React from 'react';

const AdBanner = ({ position }) => {
  return (
    <div className={`ad-container ${position === 'middle' ? 'my-8' : 'mb-6'}`}>
      <div className="flex items-center justify-center h-20 sm:h-24 md:h-28">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Advertisement - Google AdSense Placeholder ({position})
        </p>
      </div>
    </div>
  );
};

export default AdBanner;
