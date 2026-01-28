import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';


interface ConversationMessage {
  role: 'user' | 'bot';
  content: string;
}

interface GeminiRequest {
  prompt: string;
  conversation?: ConversationMessage[];
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('gemini')
  async gemini(@Body() request: GeminiRequest): Promise<{ text: string }> {
    const { prompt, conversation = [] } = request;
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log('Received request with conversation length:', conversation.length);
    console.log('Current prompt:', prompt);

    const genAI = new GoogleGenerativeAI(apiKey as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
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

    // Convert conversation history to Gemini format
    const history = conversation.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ 
      generationConfig, 
      safetySettings, 
      history 
    });

    // Analyze context and enhance prompt if related content exists
    const enhancedPrompt = this.analyzeContextAndEnhancePrompt(prompt, conversation);
    console.log('Enhanced prompt:', enhancedPrompt);
    
    const result = await chat.sendMessage(enhancedPrompt);
    const response = result.response;
    return { text: response.text() };
  }

  private analyzeContextAndEnhancePrompt(newPrompt: string, conversation: ConversationMessage[]): string {
    if (conversation.length === 0) {
      return newPrompt;
    }

    // Extract key topics and themes from conversation history
    const conversationText = conversation.map(msg => msg.content).join(' ');
    const keyTopics = this.extractKeyTopics(conversationText);
    
    // Check if new prompt is related to existing conversation
    const isRelated = this.isPromptRelated(newPrompt, keyTopics, conversationText);
    
    console.log('Key topics extracted:', keyTopics);
    console.log('Is prompt related to context:', isRelated);
    
    if (isRelated) {
      // Create context-aware prompt
      const contextSummary = this.createContextSummary(conversation);
      console.log('Context summary created:', contextSummary);
      return `Context from previous conversation: ${contextSummary}\n\nCurrent question: ${newPrompt}\n\nPlease provide an answer that builds upon the previous context and addresses the current question.`;
    }
    
    return newPrompt;
  }

  private extractKeyTopics(text: string): string[] {
    // Simple keyword extraction - in a real implementation, you might use NLP libraries
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Count word frequency and return top keywords
    const wordCount: { [key: string]: number } = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private isPromptRelated(newPrompt: string, keyTopics: string[], conversationText: string): boolean {
    const promptLower = newPrompt.toLowerCase();
    
    // Check if new prompt contains key topics from conversation
    const topicMatches = keyTopics.filter(topic => 
      promptLower.includes(topic)
    ).length;
    
    // Check for semantic similarity (simple word overlap)
    const conversationWords = new Set(conversationText.toLowerCase().split(/\s+/));
    const promptWords = new Set(promptLower.split(/\s+/));
    const commonWords = [...conversationWords].filter(word => promptWords.has(word));
    
    // Consider related if there are topic matches or significant word overlap
    return topicMatches > 0 || commonWords.length > 2;
  }

  private createContextSummary(conversation: ConversationMessage[]): string {
    // Create a summary of the conversation context
    const userMessages = conversation
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(-3); // Last 3 user messages
    
    const botMessages = conversation
      .filter(msg => msg.role === 'bot')
      .map(msg => msg.content)
      .slice(-2); // Last 2 bot messages
    
    const summary = [
      'Previous user questions: ' + userMessages.join('; '),
      'Previous responses: ' + botMessages.join('; ')
    ].join('. ');
    
    return summary;
  }
}
