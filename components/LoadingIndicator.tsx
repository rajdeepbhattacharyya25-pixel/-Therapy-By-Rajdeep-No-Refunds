import React from 'react';

const RAJDEEP_IMAGE_URL = 'https://storage.googleapis.com/generative-ai-story/user-_1721543166/image-1.png';

const LoadingIndicator: React.FC = () => (
  <div className="flex items-end gap-3 my-4 justify-start">
    <img
      src={RAJDEEP_IMAGE_URL}
      alt="Dr. Rajdeep"
      className="w-8 h-8 rounded-full self-start flex-shrink-0"
    />
    <div className="flex items-center space-x-1 bg-white dark:bg-[#39465D] px-4 py-3 rounded-2xl rounded-bl-none shadow border border-gray-200 dark:border-sky-400">
      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

export default LoadingIndicator;