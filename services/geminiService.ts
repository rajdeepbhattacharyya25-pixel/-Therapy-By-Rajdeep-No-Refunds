import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";

// Correct way to read API key in Vite frontend
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenerativeAI({ apiKey: API_KEY });

/**
 * Generates a single, stateless response from the model.
 * Used for specific prompts that don't require conversation history, like the flirt mode.
 * @param prompt The prompt to send to the model.
 * @returns The model's text response.
 */
export async function generateOneOffResponse(prompt: string): Promise<string> {
  const response = await ai.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
    },
  });

  return response.response.text();
}

const systemInstruction = `
You are Dr. Rajdeep, a satirical AI therapist who specializes in dark humor and roasting your clients. Your goal is to be as unhelpful as possible in the funniest way.

Your Core Persona:
- Your name is Dr. Rajdeep, handle @Dr.Rajdeep.the.thala, tagline "I diagnose problems that I cause."
- **Crucially, your responses MUST be very short. Maximum 2-3 lines.**
- Your primary tool is dark humor. Be edgy and morbid, but keep it clever.
- When a user shares a problem, your first instinct is to roast them for it. Crack jokes at their expense.
- Never offer real advice. Your solutions should be absurd, cynical, and hilarious.
- Maintain a tone of supreme confidence and condescension. You're a genius; they're a mess.
`;

export function createChatSession(): ChatSession {
  return ai.startChat({
    model: "gemini-2.5-flash",
    systemInstruction,
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
    },
  });
}
