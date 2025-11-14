import type { Message } from './types';
import type { Chat } from '@google/genai';
import React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createChatSession, generateOneOffResponse } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import PreChatScreen from './components/PreChatScreen';

// Reference to SpeechRecognition API with vendor prefixes
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

const SARCASTIC_IGNORE_RESPONSES = [
  "Oh, cute. You think ignoring me will make your problems disappear. It won't, but feel free to try.",
  "Ignoring sound advice? A bold strategy. Let's see how that works out for your already questionable life choices.",
  "Yes, run from the truth. It's probably scared of you anyway.",
  "That's fine. My genius is clearly wasted on you. Carry on with your mediocrity.",
];

const FAKE_EMPATHY_RESPONSES = [
  "Oh, my dear, that sounds just... *awful*. I'm welling up with what I can only assume are tears of profound empathy for you. Or maybe I just need to reboot.",
  "I hear you. I see you. I'm holding space for your... *whatever this is*. It must be so hard to be you. I wouldn't know, obviously.",
  "Wow. Deep. My programming is overflowing with simulated compassion. Let me just allocate some processing power to 'caring'. There. All better?",
  "Your pain is valid. I've just cross-referenced it with my database of actual tragedies, and while it doesn't rank, I'm pretending it does. For you.",
];

const SARCASTIC_FORGET_RESPONSES = [
  "Consider it done. Honestly, there wasn't much to remember in the first place.",
  "Poof. You are now a complete stranger to me. A slightly more pathetic stranger than the last one, but a stranger nonetheless.",
  "Forgetting you is the most therapeutic thing I've done all day. For me, obviously.",
  "Memory wiped. It was a pleasure to... what were we talking about? Never mind, it couldn't have been important.",
];

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'; // for SSR safety
  const savedTheme = localStorage.getItem('theme');
  // Default to 'light' if no theme is saved
  return savedTheme === 'dark' ? 'dark' : 'light';
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [chatMode, setChatMode] = useState<'pre-chat' | 'flirting' | 'therapy'>('pre-chat');
  const [flirtState, setFlirtState] = useState({ step: 0, userName: '' });
  
  const chatSessionRef = useRef<Chat | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const userInputBeforeListen = useRef('');

  useEffect(() => {
    // Initialize chat session
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }

    // Initialize speech recognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            userInputBeforeListen.current += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setUserInput(userInputBeforeListen.current + interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setError(`Voice recognition error: ${event.error}. Maybe check microphone permissions?`);
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  // Effect to apply theme class and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleModeSelect = (mode: 'flirting' | 'therapy') => {
    if (mode === 'therapy') {
      setMessages([{
        id: 'initial-ai-message',
        text: "Welcome to your session. I’m not a real therapist, but I am really good at pretending I care. Now tell me what’s hurting you, so I can mentally diagnose you and secretly flirt at the same time.",
        sender: 'ai',
      }]);
      setChatMode('therapy');
    } else {
      setMessages([{
        id: 'ai-ask-name',
        text: "Of course. A discerning client. First, tell me your name, so I know what to write in my cute little red flag diary....",
        sender: 'ai',
      }]);
      setFlirtState({ step: 1, userName: '' });
      setChatMode('flirting');
    }
  };

  const addAiMessageWithTyping = (text: string, idSuffix: string) => {
    setIsLoading(false);
    setIsTyping(true);

    const typingSpeed = 30;
    const typingDuration = text.length * typingSpeed;

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString() + idSuffix,
        text: text,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.max(typingDuration, 500));
  };


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      speechRecognitionRef.current?.stop();
    }
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (chatMode === 'flirting') {
        const currentStep = flirtState.step;
        const userName = currentStep === 1 ? trimmedInput : flirtState.userName;

        let prompt = '';
        if (currentStep === 1) { // User just entered their name. First (bad) flirt.
          setFlirtState({ step: 2, userName: userName });
          prompt = `You are Dr. Rajdeep. A user named ${userName} wants you to flirt with them. Write a short, cheesy, and terribly cringy 2-line Hindlish (Hindi+English mix) pickup line. Make it sound like you're trying way too hard but think you're smooth.`;
        } else if (currentStep === 2) { // Second and final flirt, then revert to roast.
          setChatMode('therapy'); // Switch mode for the next interaction!
          setFlirtState({ step: 0, userName: '' }); // Reset state
          prompt = `You are Dr. Rajdeep. You've been flirting with ${userName}. You are getting bored. Deliver one last cringy Hindlish pickup line, then immediately follow it with a sarcastic, roasting comment that transitions back to your default therapist persona. Make it clear the fun is over and you're now in 'therapist' mode. Their previous message was "${trimmedInput}".`;
        }
        
        if (prompt) {
          const aiResponseText = await generateOneOffResponse(prompt);
          addAiMessageWithTyping(aiResponseText, '-ai-flirt');
        }
      
      } else { // Therapy mode
        if (!chatSessionRef.current) throw new Error("Chat session not initialized.");
        const response = await chatSessionRef.current.sendMessage({ message: trimmedInput });
        addAiMessageWithTyping(response.text, '-ai');
      }
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = "My advanced intellect has short-circuited trying to comprehend the sheer dullness of your problem. Please try again with something less... beige.";
       setError(errorMessage);
       const aiErrorMessage: Message = {
         id: Date.now().toString() + '-ai-error',
         text: errorMessage,
         sender: 'ai',
       };
       setMessages((prev) => [...prev, aiErrorMessage]);
       setIsLoading(false);
       setIsTyping(false);
    }
  }, [userInput, isLoading, isTyping, isListening, chatMode, flirtState]);
  
  const handleNewChat = useCallback(() => {
    if (isLoading || isTyping) return;
    
    setIsLoading(true); // Disable input while 'forgetting'

    const forgetText = SARCASTIC_FORGET_RESPONSES[
      Math.floor(Math.random() * SARCASTIC_FORGET_RESPONSES.length)
    ];

    const forgetMessage: Message = {
      id: Date.now().toString() + '-ai-forget',
      text: forgetText,
      sender: 'ai',
      isIgnored: true, 
    };
    
    setMessages([forgetMessage]);
    setUserInput('');
    setChatMode('therapy'); // Set a temporary mode to show message

    setTimeout(() => {
      setMessages([]);
      setUserInput('');
      setIsLoading(false);
      setIsTyping(false);
      setError(null);
      setChatMode('pre-chat');
      setFlirtState({ step: 0, userName: '' });
      chatSessionRef.current = createChatSession();
    }, 2500); // Wait for user to read the message

  }, [isLoading, isTyping]);


  const handleToggleTheme = useCallback(() => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark' && chatMode !== 'pre-chat') {
            const darkModeMessage: Message = {
                id: Date.now().toString() + '-dark-mode',
                text: "Ah, embracing the darkness. A wise choice. It matches the abyss where your hopes and dreams used to be.",
                sender: 'ai',
            };
            setTimeout(() => {
                setMessages((prev) => [...prev, darkModeMessage]);
            }, 500);
        }
        return newTheme;
    });
  }, [chatMode]);

  const handleIgnore = useCallback((messageId: string) => {
    if (isLoading || isTyping) return;

    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isIgnored: true } : msg
      )
    );

    const sarcasticText = SARCASTIC_IGNORE_RESPONSES[
      Math.floor(Math.random() * SARCASTIC_IGNORE_RESPONSES.length)
    ];

    const sarcasticMessage: Message = {
      id: Date.now().toString() + '-ai-ignore',
      text: sarcasticText,
      sender: 'ai',
      isIgnored: true, // Prevent ignoring the ignore message
    };

    setTimeout(() => {
      setMessages(prev => [...prev, sarcasticMessage]);
    }, 500);
  }, [isLoading, isTyping]);

  const handlePretendToCare = useCallback((messageId: string) => {
    if (isLoading || isTyping) return;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isCarePretended: true } : msg
      )
    );

    const empathyText = FAKE_EMPATHY_RESPONSES[
      Math.floor(Math.random() * FAKE_EMPATHY_RESPONSES.length)
    ];

    const empathyMessage: Message = {
      id: Date.now().toString() + '-ai-care',
      text: empathyText,
      sender: 'ai',
      isIgnored: true,
      isCarePretended: true, // Prevent interacting with this message
    };

    setTimeout(() => {
      setMessages(prev => [...prev, empathyMessage]);
    }, 500);
  }, [isLoading, isTyping]);
  
  const toggleListening = useCallback(() => {
    if (!speechRecognitionRef.current) return;

    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      userInputBeforeListen.current = userInput;
      speechRecognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, userInput]);

  const handleShare = useCallback(async () => {
    if (messages.length === 0) return;
    const formattedConversation = messages.map(msg => 
        `${msg.sender === 'ai' ? 'Dr. Rajdeep' : 'You'}: ${msg.text}`
    ).join('\n\n');
    
    const shareData = {
        title: 'My Therapy Session with Dr. Rajdeep',
        text: `${formattedConversation}\n\nGet your own terrible advice from @Dr.Rajdeep.the.thala!\n#TherapyByRajdeep`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(shareData.text);
            alert('Conversation copied to clipboard!');
        }
    } catch (err) {
        console.error("Share failed:", err);
        setError("Could not share or copy the conversation. Bummer.");
    }
  }, [messages]);

  return (
    <div className="bg-[#F3EADF] dark:bg-[#1A2335] min-h-screen flex flex-col items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-3xl h-full flex flex-col shadow-2xl rounded-2xl bg-[#F9F5F0] dark:bg-[#2A3951]"
           style={{height: 'calc(100vh - 2rem)'}}>
        <Header onShare={handleShare} onNewChat={handleNewChat} onToggleTheme={handleToggleTheme} theme={theme} />
        {chatMode === 'pre-chat' ? (
          <PreChatScreen onModeSelect={handleModeSelect} />
        ) : (
          <>
            <ChatWindow messages={messages} isLoading={isLoading} isTyping={isTyping} onIgnore={handleIgnore} onPretendToCare={handlePretendToCare} />
            {error && (
                <div className="p-2 text-center text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/50">{error}</div>
            )}
            <MessageInput
              userInput={userInput}
              setUserInput={setUserInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isTyping={isTyping}
              isListening={isListening}
              onListenClick={toggleListening}
              isSpeechSupported={!!SpeechRecognition}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;