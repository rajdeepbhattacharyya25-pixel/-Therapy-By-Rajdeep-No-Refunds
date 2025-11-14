import type { Message as MessageType } from '../types';
import React from 'react';

const RAJDEEP_IMAGE_URL = 'https://storage.googleapis.com/generative-ai-story/user-_1721543166/image-1.png';

interface MessageProps {
  message: MessageType;
  onIgnore: (messageId: string) => void;
  onPretendToCare: (messageId: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onIgnore, onPretendToCare }) => {
  const isUser = message.sender === 'user';
  const showIgnoreButton = !isUser && !message.isIgnored;
  const showPretendCareButton = !isUser && !message.isCarePretended;

  return (
    <div className={`flex items-end gap-2 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <img
            src={RAJDEEP_IMAGE_URL}
            alt="Dr. Rajdeep"
            className="w-8 h-8 rounded-full self-start flex-shrink-0"
          />
        )}
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow ${
            isUser
              ? 'bg-[#E57373] dark:bg-[#C62828] text-white rounded-br-none'
              : 'bg-white dark:bg-[#39465D] text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-sky-400'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
      <div className="flex flex-col items-start self-center space-y-1">
        {showPretendCareButton && (
          <button
            onClick={() => onPretendToCare(message.id)}
            aria-label="Make AI pretend to care"
            title="Make AI pretend to care"
            className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-slate-800"
          >
            Pretend to Care
          </button>
        )}
        {showIgnoreButton && (
          <button
            onClick={() => onIgnore(message.id)}
            aria-label="Ignore this message"
            title="Ignore this advice"
            className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-slate-800"
          >
            ignore
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;