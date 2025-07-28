// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash";

async function runChat(prompt: string, signal?: AbortSignal): Promise<string> {
  // Call the backend API instead of using the API key here
  const response = await fetch("http://localhost:3001/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!response.ok) throw new Error("Backend error");
  const data = await response.json();
  return data.text;
}

export default runChat;
