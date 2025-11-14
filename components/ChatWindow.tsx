import type { Message as MessageType } from '../types';
import React from 'react';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  isTyping: boolean;
  onIgnore: (messageId: string) => void;
  onPretendToCare: (messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, isTyping, onIgnore, onPretendToCare }) => {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onIgnore={onIgnore} onPretendToCare={onPretendToCare} />
      ))}
      {isLoading && <LoadingIndicator />}
      {isTyping && <TypingIndicator />}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;