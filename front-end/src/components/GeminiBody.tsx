"use client";
import React, { useContext, useRef, useEffect, useState } from "react";
import {
  CircleUserRound,
  Compass,
  Lightbulb,
  Youtube,
  Code,
  SendHorizontal,
  Zap,
  SquarePen,
  Copy,
  CheckLine,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Share2,
  EllipsisVertical,
  Plus,
  X,
  FileText,
  Image,
  File,
} from "lucide-react";
import { Context } from "../context/ContextProvider";
import type { ContextType } from "../context/ContextProvider";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

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
  const resultRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedGenIdx, setCopiedGenIdx] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showFilePreview, setShowFilePreview] = useState<boolean>(false);

  const handleCopy = (text: string, idx?: number) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (typeof idx === 'number') {
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
      }
    }
  };

  const handleCopyGenerated = (htmlContent: string, idx: number) => {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = htmlContent;
    const text = tempEl.innerText;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedGenIdx(idx);
      setTimeout(() => setCopiedGenIdx(null), 1500);
    }
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

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
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (uploadedFiles.length === 1) {
      setShowFilePreview(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image size={16} className="text-blue-400" />;
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return <FileText size={16} className="text-green-400" />;
    } else {
      return <File size={16} className="text-gray-400" />;
    }
  };

  // Enhanced submit function to handle files
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically process the files along with the text input
    // For now, we'll just submit the text and log the files
    if (uploadedFiles.length > 0) {
      console.log('Files to upload:', uploadedFiles);
      // You can process files here - upload to server, convert to base64, etc.
    }
    
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 text-gray-100">
              <div
                className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer"
                onClick={() => setInput("Suggest beautiful places to see on an upcoming road trip.")}
              >
                <p>Suggest beautiful places to see on an upcoming road trip.</p>
                <Compass
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div
                className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer"
                onClick={() => setInput("What's the reaction to and impact of autonomous vehicles.")}
              >
                <p>What's the reaction to and impact of autonomous vehicles.</p>
                <Lightbulb
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div
                className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer"
                onClick={() => setInput("Come up with a recipe for an upcoming event.")}
              >
                <p>Come up with a recipe for an upcoming event.</p>
                <Youtube
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
              <div
                className="h-32 md:h-48 p-3 md:p-4 bg-bgSecondaryColor rounded-xl relative cursor-pointer"
                onClick={() => setInput("Evaluate and rank common camera categories.")}
              >
                <p>Evaluate and rank common camera categories.</p>
                <Code
                  size={28}
                  className="p-1 absolute bottom-2 right-2 bg-bgPrimaryColor text-softTextColor rounded-full md:size-9"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="result" ref={resultRef}>
            {conversation.map((msg, idx) =>
              msg.role === "user" ? (
                <div key={idx} className="my-4 sm:my-6 md:my-10 flex items-center justify-end gap-2 sm:gap-3 md:gap-5 pr-2 sm:pr-4 md:pr-40">
                  <div className="flex items-center gap-2">
                    <SquarePen size={20} className="text-softTextColor cursor-pointer" onClick={() => setInput(msg.content)} />
                    {copiedIdx === idx ? (
                      <CheckLine size={20} className="text-white" />
                    ) : (
                      <Copy size={20} className="text-softTextColor cursor-pointer" onClick={() => handleCopy(msg.content, idx)} />
                    )}
                    <p className="entered-prompt text-white text-xs sm:text-base mr-[-40px] sm:mr-[-100px] text-right px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl" style={{ backgroundColor: '#333537' }}>{msg.content}</p>
                  </div>
                </div>
              ) : (
                <div key={idx} className="flex flex-col md:flex-row items-start gap-2 sm:gap-3 md:gap-5 ml-[-30px] sm:ml-[-70px]">
                  <img src="/gemini.png" alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />
                  <div className="flex flex-col">
                    <p
                      className="generated-text text-md sm:text-md font-sans font-normal leading-6 sm:leading-7 text-gray-200 rounded-2xl p-3 sm:p-5 shadow-md transition-all duration-200"
                      style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    ></p>
                    <div className="flex justify-start ml-5 gap-3">
                      <ThumbsUp size={18} strokeWidth={2.5} className="thumbs-up-icon text-gray-400 cursor-pointer hover:text-blue-500 transition-colors duration-150" />
                      <ThumbsDown size={18} strokeWidth={2.5} className="thumbs-down-icon text-gray-400 cursor-pointer hover:text-red-500 transition-colors duration-150" />
                      <RotateCw size={18} strokeWidth={2.5} className="rotate-cw-icon text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors duration-150" />
                      <Share2 size={18} strokeWidth={2.5} className="share2-icon text-gray-400 cursor-pointer hover:text-green-500 transition-colors duration-150" />
                      {copiedGenIdx === idx ? (
                        <CheckLine size={18} strokeWidth={2.5} className="copy-icon text-white" />
                      ) : (
                        <Copy size={18} strokeWidth={2.5} className="copy-icon text-gray-400 cursor-pointer hover:text-purple-500 transition-colors duration-150" onClick={() => handleCopyGenerated(msg.content, idx)} />
                      )}
                      <EllipsisVertical size={18} strokeWidth={2.5} className="ellipsis-vertical-icon text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-150" />
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* File Preview Section */}
      {showFilePreview && uploadedFiles.length > 0 && (
        <div className="fixed bottom-[140px] left-0 right-0 z-10">
          <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto px-2 sm:px-4 md:px-5 py-3">
            {/* <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">{uploadedFiles.length} file(s) selected</span>
              <button
                onClick={() => {
                  setUploadedFiles([]);
                  setShowFilePreview(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div> */}
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center bg-bgSecondaryColor rounded-lg p-2 gap-2 max-w-xs">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    getFileIcon(file.type)
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-xs truncate">{file.name}</p>
                    <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-400 flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-bgPrimaryColor z-10">
        <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto px-2 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-5 bg-bgSecondaryColor py-1 sm:py-2 md:py-2.5 px-2 sm:px-3 md:px-5 rounded-full">
              <Plus 
                size={20} 
                className="text-gray-400 cursor-pointer hover:text-gray-300 transition-colors" 
                onClick={handlePlusClick}
              />
              <input
                suppressHydrationWarning={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                value={input}
                type="text"
                className="input-area flex-1 bg-transparent border-none outline-none p-1 sm:p-2 text-base sm:text-lg text-gray-400"
                placeholder="Enter a prompt here .."
              />
              {(input && input.trim() !== "") || uploadedFiles.length > 0 ? (
                <button type="submit" className="flex cursor-pointer" aria-label="Send">
                  <SendHorizontal size={30} color="white" />
                </button>
              ) : null}
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