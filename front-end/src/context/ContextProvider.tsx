"use client";
import runChat from "../lib/gemini";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface ContextType {
  theme: string;
  toggle: () => void;
  submit: (prompt: string) => Promise<void>;
  stopGeneration: () => void;
  stopApiCall: () => void;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  result: string;
  loading: boolean;
  isApiLoading: boolean;
  displayResult: boolean;
  recentPrompts: string;
  setRecentPrompts: React.Dispatch<React.SetStateAction<string>>;
  setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  prevPrompts: string[];
  setDisplayResult: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: {role: "user" | "bot", content: string}[];
  newChat: () => void;
  isAnimationPaused: boolean;
}

export const Context = createContext<ContextType | undefined>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: ContextProviderProps) => {
  const [theme, setTheme] = useState<string>("dark");
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [recentPrompts, setRecentPrompts] = useState<string>("");
  const [displayResult, setDisplayResult] = useState<boolean>(false);
  const [prevPrompts, setPrevPrompts] = useState<string[]>([]);
  const [conversation, setConversation] = useState<{role: "user" | "bot", content: string}[]>([]);
  const [isNewChat, setIsNewChat] = useState<boolean>(true);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [animationTimeouts, setAnimationTimeouts] = useState<NodeJS.Timeout[]>([]);
  const [isAnimationPaused, setIsAnimationPaused] = useState<boolean>(false);

  // Process text with formatting
  const processText = (text: string): string => {
    return text
      .split("**")
      .map((part, i) => (i % 2 === 1 ? `<b>${part}</b>` : part))
      .join("")
      .split("*")
      .join("</br>");
  };

  // Animated text display (always enabled, 10ms delay)
  const animateText = (text: string) => {
    const words = text.split(" ");
    words.forEach((word, index) => {
      setTimeout(() => {
        setResult(prev => prev + word + " ");
      }, 10 * index); // 10ms delay
    });
  };

  // Animation state
  const [animationState, setAnimationState] = useState<{
    text: string;
    current: string;
    currentIndex: number;
    isActive: boolean;
  } | null>(null);
  
  // Separate loading state for API call vs text animation
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);

  // Animated bot response for conversation
  const animateBotResponse = (text: string) => {
    setAnimationState({
      text,
      current: "",
      currentIndex: 0,
      isActive: true
    });
  };

  // Handle animation step
  useEffect(() => {
    if (animationState && animationState.isActive && !isAnimationPaused) {
      const words = animationState.text.split(" ");
      
      if (animationState.currentIndex < words.length) {
        const timer = setTimeout(() => {
          const newCurrent = animationState.current + (animationState.currentIndex === 0 ? "" : " ") + words[animationState.currentIndex];
          
          setConversation(prev => {
            if (prev.length && prev[prev.length - 1].role === "bot") {
              return [
                ...prev.slice(0, -1),
                { role: "bot", content: newCurrent }
              ];
            } else {
              return [
                ...prev,
                { role: "bot", content: newCurrent }
              ];
            }
          });
          
          setAnimationState(prev => prev ? {
            ...prev,
            current: newCurrent,
            currentIndex: prev.currentIndex + 1
          } : null);
        }, 30);
        
        return () => clearTimeout(timer);
      } else {
        // Animation complete
        setLoading(false);
        setAbortController(null);
        setIsAnimationPaused(false);
        setAnimationState(null);
      }
    }
  }, [animationState, isAnimationPaused]);

  // Pause/Resume generation function
  const stopGeneration = () => {
    if (isAnimationPaused) {
      // Resume animation
      setIsAnimationPaused(false);
    } else {
      // Pause animation
      setIsAnimationPaused(true);
    }
  };
  
  // Stop API call function
  const stopApiCall = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsApiLoading(false);
    setLoading(false);
    // Remove the last bot message if it was incomplete
    setConversation(prev => {
      if (prev.length > 0 && prev[prev.length - 1].role === "bot") {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  // on submit
  const submit = async (prompt: string) => {
    try {
      // Create new AbortController for this request
      const controller = new AbortController();
      setAbortController(controller);
      
      setIsApiLoading(true);
      setLoading(true);
      setResult("");
      setDisplayResult(true);
      setRecentPrompts(prompt);

      // Add user message to conversation
      setConversation(prev => [...prev, { role: "user", content: prompt }]);
      if (isNewChat) {
        setPrevPrompts(prev => [prompt, ...prev]);
        setIsNewChat(false);
      }

      // Log conversation context for debugging
      console.log('Sending conversation context:', conversation);
      console.log('Current prompt:', prompt);

      // Pass conversation history for context-aware responses
      const response = await runChat(prompt, conversation, controller.signal);
      const processedText = processText(response);

      // Stop API loading and start text animation
      setIsApiLoading(false);
      animateBotResponse(processedText);
      setInput("");
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error("Error generating response:", error);
        setResult("Sorry, there was an error generating the response. Please try again.");
      }
      setLoading(false);
      setIsApiLoading(false);
      setAbortController(null);
    }
  };

  // light and dark mode
  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Start a new chat
  const newChat = () => {
    setConversation([]);
    setInput("");
    setDisplayResult(false);
    setIsNewChat(true);
  };

  const contextValue: ContextType = {
    theme,
    toggle,
    submit,
    stopGeneration,
    stopApiCall,
    setInput,
    input,
    result,
    loading,
    isApiLoading,
    displayResult,
    recentPrompts,
    setRecentPrompts,
    setPrevPrompts,
    prevPrompts,
    setDisplayResult,
    conversation,
    newChat,
    isAnimationPaused,
  };

  return (
    <Context.Provider value={contextValue}>
      <div className={theme}>{children}</div>
    </Context.Provider>
  );
};

export default ContextProvider;
export type { ContextType };