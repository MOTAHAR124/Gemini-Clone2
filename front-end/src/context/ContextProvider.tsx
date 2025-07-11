"use client";
import runChat from "../lib/gemini";
import React, { createContext, useState, ReactNode } from "react";

interface ContextType {
  theme: string;
  toggle: () => void;
  submit: (prompt: string) => Promise<void>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  input: string;
  result: string;
  loading: boolean;
  displayResult: boolean;
  recentPrompts: string;
  setRecentPrompts: React.Dispatch<React.SetStateAction<string>>;
  setPrevPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  prevPrompts: string[];
  setDisplayResult: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: {role: "user" | "bot", content: string}[];
  newChat: () => void;
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

  // Animated bot response for conversation
  const animateBotResponse = (text: string) => {
    let current = "";
    const words = text.split(" ");
    words.forEach((word, idx) => {
      setTimeout(() => {
        current += (current ? " " : "") + word;
        setConversation(prev => {
          // If last message is bot, update it; else, add new bot message
          if (prev.length && prev[prev.length - 1].role === "bot") {
            return [
              ...prev.slice(0, -1),
              { role: "bot", content: current }
            ];
          } else {
            return [
              ...prev,
              { role: "bot", content: current }
            ];
          }
        });
      }, 30 * idx); // 30ms per word
    });
  };

  // on submit
  const submit = async (prompt: string) => {
    try {
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

      const response = await runChat(prompt);
      const processedText = processText(response);

      // Animate bot response
      animateBotResponse(processedText);
      setInput("");
    } catch (error) {
      console.error("Error generating response:", error);
      setResult("Sorry, there was an error generating the response. Please try again.");
    } finally {
      setLoading(false);
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
    setInput,
    input,
    result,
    loading,
    displayResult,
    recentPrompts,
    setRecentPrompts,
    setPrevPrompts,
    prevPrompts,
    setDisplayResult,
    conversation,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      <div className={theme}>{children}</div>
    </Context.Provider>
  );
};

export default ContextProvider;
export type { ContextType };