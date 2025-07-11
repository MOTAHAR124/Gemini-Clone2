"use client";
import React, { useContext } from "react";
import {
  CircleUserRound,
  Compass,
  Lightbulb,
  Youtube,
  Code,
  SendHorizontal,
  Zap,
} from "lucide-react";
import { Context } from "../context/ContextProvider";
import type { ContextType } from "../context/ContextProvider";

const GeminiBody = () => {
  const {
    submit,
    recentPrompts,
    displayResult,
    loading,
    result,
    input,
    setInput,
    conversation,
  } = useContext(Context) as ContextType;
  console.log(loading, "loading");
  return (
    <div className="flex-1 min-h-screen relative ml-0 ">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-end p-2 sm:p-3 md:p-5 text-base sm:text-lg md:text-xl text-gray-400 bg-bgPrimaryColor z-10">
        <CircleUserRound size={28} className="text-softTextColor sm:w-8 sm:h-8 md:w-10 md:h-10" />
      </div>

      {/* Main Content with Padding for Header and Footer */}
      <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto mt-[60px] sm:mt-[70px] md:mt-[80px] mb-[80px] sm:mb-[100px] md:mb-[150px] px-2 sm:px-4 md:px-5">
        {(!displayResult && conversation.length === 0) ? (
          <>
            <div className="text-2xl md:text-3xl font-bold text-gray-400 mb-2">Gemini</div>
            <div className="my-8 md:my-12 text-3xl md:text-5xl font-medium">
              <p>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Hello, Motahar
                </span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              <div className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <Compass
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer">
                <p>What's the reaction to and impact of autonomous vehicles</p>
                <Lightbulb
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer">
                <p>Come up with a recipe for an upcoming event</p>
                <Youtube
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer">
                <p>Evaluate and rank common camera categories</p>
                <Code
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            {conversation.map((msg, idx) =>
              msg.role === "user" ? (
                <div key={idx} className="my-4 sm:my-6 md:my-10 flex items-center justify-end gap-2 sm:gap-3 md:gap-5 pr-2 sm:pr-4 md:pr-40">
                  <p className="text-white text-xs sm:text-base mr-[-40px] sm:mr-[-100px] text-right px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl" style={{ backgroundColor: '#333537' }}>{msg.content}</p>
                </div>
              ) : (
                <div key={idx} className="flex flex-col md:flex-row items-start gap-2 sm:gap-3 md:gap-5 ml-[-30px] sm:ml-[-70px]">
                  <img src="/gemini.png" alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />
                  <p
                    className="text-md sm:text-md font-sans font-normal leading-6 sm:leading-7 text-gray-200 rounded-2xl p-3 sm:p-5 shadow-md transition-all duration-200"
                    style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                  ></p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bgPrimaryColor z-10">
        <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto px-2 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4">
          <form onSubmit={e => { e.preventDefault(); submit(input); }}>
            <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-5 bg-bgSecondaryColor py-1 sm:py-2 md:py-2.5 px-2 sm:px-3 md:px-5 rounded-full">
              <input
                suppressHydrationWarning={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                value={input}
                type="text"
                className="flex-1 bg-transparent border-none outline-none p-1 sm:p-2 text-base sm:text-lg text-gray-400"
                placeholder="Enter a prompt here .."
              />
              <div className="flex cursor-pointer">
                <SendHorizontal type="submit" size={18} />
              </div>
            </div>
          </form>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm text-center p-1 sm:p-2 md:p-3">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiBody;