import { NextResponse } from "next/server";
export const runtime = 'nodejs';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface ConversationMessage {
  role: "user" | "bot";
  content: string;
}

interface GeminiRequest {
  prompt: string;
  conversation?: ConversationMessage[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GeminiRequest;
    const { prompt, conversation = [] } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const history = conversation.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ generationConfig, safetySettings, history });

    const enhancedPrompt = analyzeContextAndEnhancePrompt(prompt, conversation);
    const result = await chat.sendMessage(enhancedPrompt);
    const response = result.response;

    return NextResponse.json({ text: response.text() });
  } catch (err) {
    console.error("/api/gemini error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function analyzeContextAndEnhancePrompt(newPrompt: string, conversation: ConversationMessage[]): string {
  if (conversation.length === 0) return newPrompt;

  const conversationText = conversation.map((msg) => msg.content).join(" ");
  const keyTopics = extractKeyTopics(conversationText);

  const isRelated = isPromptRelated(newPrompt, keyTopics, conversationText);
  if (!isRelated) return newPrompt;

  const contextSummary = createContextSummary(conversation);
  return `Context from previous conversation: ${contextSummary}\n\nCurrent question: ${newPrompt}\n\nPlease provide an answer that builds upon the previous context and addresses the current question.`;
}

function extractKeyTopics(text: string): string[] {
  const commonWords = [
    "the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those","i","you","he","she","it","we","they","me","him","her","us","them",
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !commonWords.includes(w));

  const wordCount: Record<string, number> = {};
  for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([w]) => w);
}

function isPromptRelated(newPrompt: string, keyTopics: string[], conversationText: string): boolean {
  const promptLower = newPrompt.toLowerCase();
  const topicMatches = keyTopics.filter((topic) => promptLower.includes(topic)).length;

  const conversationWords = new Set(conversationText.toLowerCase().split(/\s+/));
  const promptWords = new Set(promptLower.split(/\s+/));
  const common = [...conversationWords].filter((w) => promptWords.has(w));

  return topicMatches > 0 || common.length > 2;
}

function createContextSummary(conversation: ConversationMessage[]): string {
  const userMessages = conversation
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .slice(-3);
  const botMessages = conversation
    .filter((m) => m.role === "bot")
    .map((m) => m.content)
    .slice(-2);

  return [
    "Previous user questions: " + userMessages.join("; "),
    "Previous responses: " + botMessages.join("; "),
  ].join(". ");
}
