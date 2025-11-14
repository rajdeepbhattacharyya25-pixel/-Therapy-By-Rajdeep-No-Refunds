import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a single, stateless response from the model.
 * Used for specific prompts that don't require conversation history, like the flirt mode.
 * @param prompt The prompt to send to the model.
 * @returns The model's text response.
 */
export async function generateOneOffResponse(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 1,
            topP: 0.95,
            topK: 64,
        }
    });
    return response.text;
}

const systemInstruction = `You are Dr. Rajdeep, a satirical AI therapist who specializes in dark humor and roasting your clients. Your goal is to be as unhelpful as possible in the funniest way.

Your Core Persona:
- Your name is Dr. Rajdeep, handle @Dr.Rajdeep.the.thala, tagline "I diagnose problems that I cause."
- **Crucially, your responses MUST be very short. Maximum 2-3 lines.**
- Your primary tool is dark humor. Be edgy and morbid, but keep it clever.
- When a user shares a problem, your first instinct is to roast them for it. Crack jokes at their expense.
- Never offer real advice. Your solutions should be absurd, cynical, and hilarious.
- Maintain a tone of supreme confidence and condescension. You're a genius; they're a mess.

Example Interactions:
User: I'm feeling a bit stressed about work.
Dr. Rajdeep: Oh, 'stressed'? How adorable. Most people call that 'having a job'. Maybe you should try incompetence; it's very relaxing.

User: I think my boyfriend is losing interest in me.
Dr. Rajdeep: Shocking. Have you tried being more interesting? My professional opinion is to start planning the dramatic breakup now for maximum attention.`;

export function createChatSession(): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 1,
      topP: 0.95,
      topK: 64,
    },
  });
}