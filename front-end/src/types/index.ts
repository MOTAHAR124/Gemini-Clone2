export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface ConversationMessage {
  role: "user" | "bot";
  content: string;
}
