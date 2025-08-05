"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Menu,
  Plus,
  CircleHelp,
  Activity,
  Settings,
  MessageSquare,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Context } from "../context/ContextProvider";
import type { ContextType } from "../context/ContextProvider";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setDisplayResult, setInput, prevPrompts, setRecentPrompts, submit, newChat } =
    useContext(Context) as ContextType;

  // Handle mouse enter on sidebar area
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsOpen(true);
  };

  // Handle mouse leave from sidebar area
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadPrompt = (prompt: string) => {
    setRecentPrompts(prompt);
    submit(prompt);
  };

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Always show toggle button */}
      <button
        ref={buttonRef}
        className="fixed top-4 left-4 z-30 bg-bgPrimaryColor p-2 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        suppressHydrationWarning={true}
      >
        <Menu size={25} className="text-softTextColor" />
      </button>
      {/* Sidebar: width 0 when closed, 250px when open */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-bgSecondaryColor py-6 px-4 flex flex-col justify-between z-20 transition-all duration-300 ${
          isOpen ? 'w-[250px]' : 'w-[70px] overflow-hidden'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isOpen && (
          <>
            <div>
              <div
                className="mt-10 inline-flex py-2.5 items-center gap-2.5 px-4 bg-bgPrimaryColor rounded-full text-md text-gray-400 cursor-pointer w-full"
                onClick={newChat}
              >
                <Plus size={20} className="cursor-pointer text-softTextColor" />
                <p>New Chat</p>
              </div>
              <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-250px)]">
                <p className="mt-5 text-gray-300 mb-5">Recent</p>
                {prevPrompts?.map((item: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => loadPrompt(item)}
                    className="my-2 flex items-center gap-2.5 pr-10 rounded-full text-gray-300 cursor-pointer hover:bg-[#1a0e0e] p-2 "
                  >
                    <MessageSquare
                      size={20}
                      className="cursor-pointer text-softTextColor"
                    />
                    <p className="truncate">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="pr-2.5 cursor-pointer flex gap-2 text-gray-400 items-center">
                <CircleHelp size={20} className="text-softTextColor" />
                <p>Help</p>
              </div>
              <div className="pr-2.5 cursor-pointer flex gap-2 text-gray-400 items-center">
                <Activity size={20} className="text-softTextColor" />
                <p>Activity</p>
              </div>
              <div className="pr-2.5 cursor-pointer flex gap-2 text-gray-400 items-center">
                <Settings size={20} className="text-softTextColor" />
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;