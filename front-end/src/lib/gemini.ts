// node --version # Should be >= 18
// npm install @google/generative-ai

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

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

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let details = "";
    try {
      if (contentType.includes("application/json")) {
        const errorJson = (await response.json()) as { error?: string; message?: string };
        details = errorJson?.error || errorJson?.message || JSON.stringify(errorJson);
      } else {
        details = await response.text();
      }
    } catch {
      // ignore parsing errors, fall back to generic message below
    }

    throw new Error(details ? `Backend error (${response.status}): ${details}` : `Backend error (${response.status})`);
  }

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Expected JSON from /api/gemini but received ${contentType || "unknown content-type"}. ` +
        `This is often caused by auth middleware intercepting API routes. Response starts with: ${JSON.stringify(text.slice(0, 120))}`
    );
  }

  const data = (await response.json()) as { text?: string };
  if (!data?.text) throw new Error("Backend error: missing 'text' in response");
  return data.text;
}

export default runChat;
export type { ConversationMessage };
