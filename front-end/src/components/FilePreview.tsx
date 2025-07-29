"use client";
import React from "react";
import { X, FileText, Image, File } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface FilePreviewProps {
  uploadedFiles: UploadedFile[];
  showFilePreview: boolean;
  removeFile: (fileId: string) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  uploadedFiles,
  showFilePreview,
  removeFile,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image size={16} className="text-blue-400" />;
    } else if (fileType.includes("text") || fileType.includes("document")) {
      return <FileText size={16} className="text-green-400" />;
    } else {
      return <File size={16} className="text-gray-400" />;
    }
  };

  if (!showFilePreview || uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-[140px] left-0 right-0 z-10">
      <div className="max-w-full sm:max-w-[600px] md:max-w-[900px] mx-auto px-2 sm:px-4 md:px-5 py-3">
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center bg-bgSecondaryColor rounded-lg p-2 gap-2 max-w-xs"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-8 h-8 object-cover rounded"
                />
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
  );
};

export default FilePreview;
