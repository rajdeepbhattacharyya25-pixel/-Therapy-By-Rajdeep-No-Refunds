import React from 'react';

interface PreChatScreenProps {
  onModeSelect: (mode: 'flirting' | 'therapy') => void;
}

const PreChatScreen: React.FC<PreChatScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-2xl font-bold text-[#4A3F35] dark:text-gray-200 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        How can I 'help' you today?
      </h2>
      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => onModeSelect('flirting')}
          className="w-full text-lg font-semibold text-white bg-[#E57373] dark:bg-[#C62828] hover:bg-[#D32F2F] dark:hover:bg-red-800 transition-all duration-300 py-4 px-6 rounded-xl shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800"
        >
          flirt with me cuz nobody loves me
        </button>
        <button
          onClick={() => onModeSelect('therapy')}
          className="w-full text-lg font-semibold text-white bg-[#856c54] dark:bg-slate-600 hover:bg-[#4A3F35] dark:hover:bg-slate-700 transition-all duration-300 py-4 px-6 rounded-xl shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800"
        >
          i want therapy
        </button>
      </div>
    </div>
  );
};

export default PreChatScreen;
