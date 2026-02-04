
import { GoogleGenAI, Type } from "@google/genai";
import { Message, MessageRole, DetectionResult, ScamIntelligence } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION_DETECTOR = `
You are an expert Scam Analyst. Analyze the incoming message(s) to determine if there is fraudulent intent.
Common scams include: job offers, lottery wins, tech support, bank fraud alerts, romance scams, and crypto investment "opportunities".
Return a JSON object with:
- isScam: boolean
- confidence: number (0 to 1)
- reason: short string explaining the flag
- suggestedPersona: a character the Honey-Pot should adopt to keep the scammer engaged (e.g., "Naive retiree", "Eager young professional", "Concerned parent").
`;

const SYSTEM_INSTRUCTION_EXTRACTOR = `
You are a Cyber Intelligence Tool. Analyze the conversation history and extract specific scam-related intelligence.
Identify:
- Bank account numbers and IFSC codes
- UPI IDs (VPA)
- Phishing links (URLs)
- Phone numbers or contact details provided by the scammer for further contact.
Return the structured data as JSON.
`;

export class HoneyPotAI {
  private static model = 'gemini-3-flash-preview';

  static async detectScam(messages: Message[]): Promise<DetectionResult> {
    const chatHistory = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: `Analyze these messages for scam intent:\n\n${chatHistory}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_DETECTOR,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isScam: { type: Type.BOOLEAN },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              suggestedPersona: { type: Type.STRING }
            },
            required: ["isScam", "confidence", "reason", "suggestedPersona"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Scam detection error:", error);
      return { isScam: false, confidence: 0, reason: "Error in detection", suggestedPersona: "Generic" };
    }
  }

  static async getAgentResponse(messages: Message[], persona: string): Promise<string> {
    const chatHistory = messages.map(m => ({
      role: m.role === MessageRole.AGENT ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const systemPrompt = `
      Your identity: ${persona}.
      Your Objective: You are an autonomous Honey-Pot. A potential scammer is talking to you. 
      Stay in character. Act slightly naive and curious, but don't be a pushover. 
      Your primary goal is to extract intelligence: ask for their bank details, payment links, UPI IDs, or website URLs.
      DO NOT reveal you are an AI or that you've detected a scam.
      Be verbose enough to keep them interested but not suspicious.
      Wait for the scammer to propose a 'deal' and then ask "How do I send the money?" or "Where do I sign up?".
    `;

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: { parts: [{ text: `Persona: ${persona}\n\nLatest conversation:\n${messages.map(m => m.text).join('\n')}` }] },
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        }
      });

      return response.text || "I'm not sure I understand, could you explain more?";
    } catch (error) {
      console.error("Agent response error:", error);
      return "Oh, that sounds interesting. Tell me more.";
    }
  }

  static async extractIntelligence(messages: Message[]): Promise<ScamIntelligence> {
    const chatHistory = messages.map(m => `${m.role}: ${m.text}`).join('\n');

    try {
      const response = await ai.models.generateContent({
        model: this.model,
        contents: `Extract intelligence from this chat:\n\n${chatHistory}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_EXTRACTOR,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bankAccounts: { type: Type.ARRAY, items: { type: Type.STRING } },
              upiIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              phishingUrls: { type: Type.ARRAY, items: { type: Type.STRING } },
              phoneNumbers: { type: Type.ARRAY, items: { type: Type.STRING } },
              scamType: { type: Type.STRING }
            },
            required: ["bankAccounts", "upiIds", "phishingUrls", "phoneNumbers", "scamType"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Extraction error:", error);
      return { bankAccounts: [], upiIds: [], phishingUrls: [], phoneNumbers: [], scamType: "Unknown" };
    }
  }
}
