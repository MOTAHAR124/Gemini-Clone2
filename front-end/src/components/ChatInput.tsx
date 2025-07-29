"use client";
import React, { useRef } from "react";
import { Plus, SendHorizontal } from "lucide-react";
import LoadingLogo from "./LoadingLogo";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isApiLoading: boolean;
  loading: boolean;
  stopApiCall: () => void;
  stopGeneration: () => void;
  uploadedFiles: UploadedFile[];
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  handleSubmit,
  handleFileChange,
  isApiLoading,
  loading,
  stopApiCall,
  stopGeneration,
  uploadedFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bgPrimaryColor z-10">
        <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto px-2 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-5 bg-bgSecondaryColor py-1 sm:py-2 md:py-2.5 px-2 sm:px-3 md:px-5 rounded-full">
              <Plus
                size={28}
                className="text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
                onClick={handlePlusClick}
              />
              <input
                suppressHydrationWarning={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                value={input}
                type="text"
                className="input-area flex-1 bg-transparent border-none outline-none p-1 sm:p-2 text-base sm:text-lg text-gray-400"
                placeholder="Enter a prompt here .."
              />
              <div className="flex items-center gap-2">
                {isApiLoading || loading ? (
                  <LoadingLogo
                    size={35}
                    className="animate-pulse"
                    onClick={isApiLoading ? stopApiCall : stopGeneration}
                  />
                ) : (input && input.trim() !== "") || uploadedFiles.length > 0 ? (
                  <button type="submit" className="flex cursor-pointer" aria-label="Send">
                    <SendHorizontal size={30} color="white" />
                  </button>
                ) : null}
              </div>
            </div>
          </form>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm text-center p-1 sm:p-2 md:p-3">
            Gemini may display inaccurate info, including about people, so
            double-check its responses. Your privacy and Gemini Apps
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
