// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";

interface ConversationMessage {
  role: "user" | "bot";
  content: string;
}

async function runChat(prompt: string, conversation?: ConversationMessage[], signal?: AbortSignal): Promise<string> {
  // Call Next.js API route deployed on Vercel
  const response = await fetch(`/api/gemini`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      prompt,
      conversation: conversation || []
    }),
    signal,
  });
  if (!response.ok) throw new Error("Backend error");
  const data = await response.json();
  return data.text;
}

export default runChat;
export type { ConversationMessage };
