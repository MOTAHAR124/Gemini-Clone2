"use client";
import React, { useContext, useRef, useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { Context } from "../context/ContextProvider";
import type { ContextType } from "../context/ContextProvider";
import SuggestionCards from "./SuggestionCards";
import ConversationDisplay from "./ConversationDisplay";
import FilePreview from "./FilePreview";
import ChatInput from "./ChatInput";
import type { UploadedFile } from "../types";

const GeminiBody = () => {
  const {
    submit,
    stopGeneration,
    stopApiCall,
    displayResult,
    loading,
    isApiLoading,
    input,
    setInput,
    conversation,
  } = useContext(Context) as ContextType;
  
  const resultRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showFilePreview, setShowFilePreview] = useState<boolean>(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId 
                ? { ...f, preview: event.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      return uploadedFile;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setShowFilePreview(true);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (uploadedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
    
    // Clear files after submit
    setUploadedFiles([]);
    setShowFilePreview(false);
  };



  useEffect(() => {
    const resultEl = resultRef.current;
    if (resultEl && bottomRef.current) {
      if (resultEl.scrollHeight > resultEl.clientHeight) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [conversation, loading]);

  return (
    <div className="flex-1 min-h-screen relative ml-0">
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
            <SuggestionCards setInput={setInput} />
          </>
        ) : (
          <div className="result" ref={resultRef}>
            <ConversationDisplay 
              conversation={conversation}
              setInput={setInput}
              isApiLoading={isApiLoading}
            />
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* File Preview Section */}
      <FilePreview 
        uploadedFiles={uploadedFiles}
        showFilePreview={showFilePreview}
        removeFile={removeFile}
      />

      {/* Chat Input */}
      <ChatInput 
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isApiLoading={isApiLoading}
        loading={loading}
        stopApiCall={stopApiCall}
        stopGeneration={stopGeneration}
        uploadedFiles={uploadedFiles}
      />
    </div>
  );
};

export default GeminiBody;
