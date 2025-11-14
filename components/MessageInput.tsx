import React from 'react';

interface MessageInputProps {
  userInput: string;
  setUserInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isTyping: boolean;
  isListening: boolean;
  onListenClick: () => void;
  isSpeechSupported: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  userInput,
  setUserInput,
  onSubmit,
  isLoading,
  isTyping,
  isListening,
  onListenClick,
  isSpeechSupported,
}) => {
  const isBusy = isLoading || isTyping;
  const isDisabled = isBusy || isListening;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onSubmit(e);
      }
    }
  };

  const getPlaceholder = () => {
    if (isLoading) {
      return "Dr. Rajdeep is 'thinking'...";
    }
    if (isTyping) {
      return "Dr. Rajdeep is typing...";
    }
    if (isListening) {
      return "Listening...";
    }
    return "Tell me your 'problems'...";
  };

  return (
    <form
      onSubmit={onSubmit}
      className="p-4 bg-white dark:bg-[#2A3951] border-t-2 border-[#D8C4A9] dark:border-slate-700 rounded-b-2xl sticky bottom-4 z-10 w-full max-w-3xl mx-auto"
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={isDisabled}
          className={`w-full pl-4 ${isSpeechSupported ? 'pr-24' : 'pr-12'} py-3 rounded-full border-2 border-transparent bg-white dark:bg-[#1A2335] dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition duration-300 shadow-inner`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {isSpeechSupported && (
            <button
              type="button"
              onClick={onListenClick}
              disabled={isBusy}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
              className={`p-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 ${
                isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              } ${isBusy ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a4.5 4.5 0 0 0 9 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6 6 0 1 1-12 0v-1.5a.75.75 0 0 1 .75-.75Z" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={isDisabled || !userInput.trim()}
            className="p-2 rounded-full bg-[#E57373] dark:bg-[#39465D] text-white hover:bg-[#D32F2F] dark:hover:bg-[#4A5A74] disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;