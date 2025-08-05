"use client";
import React, { useState } from "react";
import {
  SquarePen,
  Copy,
  CheckLine,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Share2,
  EllipsisVertical,
} from "lucide-react";

import type { ConversationMessage } from "../types";

interface ConversationDisplayProps {
  conversation: ConversationMessage[];
  setInput: (input: string) => void;
  isApiLoading: boolean;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  conversation,
  setInput,
  isApiLoading,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedGenIdx, setCopiedGenIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx?: number) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (typeof idx === "number") {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
      }
    }
  };

  const handleCopyGenerated = (htmlContent: string, idx: number) => {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = htmlContent;
    const text = tempEl.innerText;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedGenIdx(idx);
      setTimeout(() => setCopiedGenIdx(null), 1500);
    }
  };

  return (
    <div className="result">
      {conversation.map((msg, idx) =>
        msg.role === "user" ? (
          <div
            key={idx}
            className="my-4 sm:my-6 md:my-10 flex items-center justify-end gap-2 sm:gap-3 md:gap-5 pr-2 sm:pr-4 md:pr-40"
          >
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                <SquarePen
                  size={20}
                  className="text-softTextColor cursor-pointer"
                  onClick={() => setInput(msg.content)}
                />
              </div>
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {copiedIdx === idx ? (
                  <CheckLine size={20} className="text-white" />
                ) : (
                  <Copy
                    size={20}
                    className="text-softTextColor cursor-pointer"
                    onClick={() => handleCopy(msg.content, idx)}
                  />
                )}
              </div>
              <p
                className="entered-prompt text-white text-xs sm:text-base mr-[-40px] sm:mr-[-100px] text-right px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl"
                style={{ backgroundColor: "#333537" }}
              >
                {msg.content}
              </p>
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="flex flex-col md:flex-row items-start gap-2 sm:gap-3 md:gap-5 ml-[-30px] sm:ml-[-70px]"
          >
            <img
              src="/gemini.png"
              alt=""
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"
            />
            <div className="flex flex-col">
              <p
                className="generated-text text-md sm:text-md font-sans font-normal leading-6 sm:leading-7 text-gray-200 rounded-2xl p-3 sm:p-5 shadow-md transition-all duration-200"
                style={{
                  fontFamily: "Inter, Roboto, Arial, sans-serif",
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)",
                }}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></p>
              <div className="flex justify-start ml-5 gap-3">
                <ThumbsUp
                  size={18}
                  strokeWidth={2.5}
                  className="thumbs-up-icon text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-150"
                />
                <ThumbsDown
                  size={18}
                  strokeWidth={2.5}
                  className="thumbs-down-icon text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-150"
                />
                <RotateCw
                  size={18}
                  strokeWidth={2.5}
                  className="rotate-cw-icon text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors duration-150"
                />
                <Share2
                  size={18}
                  strokeWidth={2.5}
                  className="share2-icon text-gray-400 cursor-pointer hover:text-green-500 transition-colors duration-150"
                />
                {copiedGenIdx === idx ? (
                  <CheckLine
                    size={18}
                    strokeWidth={2.5}
                    className="copy-icon text-white"
                  />
                ) : (
                  <Copy
                    size={18}
                    strokeWidth={2.5}
                    className="copy-icon text-gray-400 cursor-pointer hover:text-purple-500 transition-colors duration-150"
                    onClick={() => handleCopyGenerated(msg.content, idx)}
                  />
                )}
                <EllipsisVertical
                  size={18}
                  strokeWidth={2.5}
                  className="ellipsis-vertical-icon text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-150"
                />
              </div>
            </div>
          </div>
        )
      )}
      {isApiLoading && (
        <div className="flex flex-col md:flex-row items-start gap-2 sm:gap-3 md:gap-5 ml-[-30px] sm:ml-[-70px]">
          <img
            src="/gemini.png"
            alt=""
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"
          />
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Generating response... </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;
