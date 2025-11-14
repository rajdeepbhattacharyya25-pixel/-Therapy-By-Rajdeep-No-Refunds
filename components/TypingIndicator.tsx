import React from 'react';

const RAJDEEP_IMAGE_URL = 'https://storage.googleapis.com/generative-ai-story/user-_1721543166/image-1.png';

const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-3 my-4 justify-start">
    <img
      src={RAJDEEP_IMAGE_URL}
      alt="Dr. Rajdeep"
      className="w-8 h-8 rounded-full self-start flex-shrink-0"
    />
    <div className="flex items-center space-x-3 bg-white dark:bg-[#39465D] px-4 py-3 rounded-2xl rounded-bl-none shadow border border-gray-200 dark:border-sky-400">
      <span className="text-sm text-gray-500 dark:text-gray-400 italic">Dr. Rajdeep is typing...</span>
      <div className="morph-animation w-3 h-3 bg-gray-500 dark:bg-gray-400"></div>
    </div>
  </div>
);

export default TypingIndicator;