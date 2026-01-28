import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DEFAULT_SYSTEM_INSTRUCTION = "You are Glucasia, a helpful, reasoning AI assistant created by Glucasia and 206. Be concise, accurate, and helpful.";

/**
 * Sends a chat message to Gemini (Text-only or Text + Grounding).
 * Uses 'gemini-3-flash-preview' for fast, reasoned responses.
 * Enables Google Search tool for grounding.
 */
export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    // Use the custom instruction if provided, otherwise fallback to default
    const instruction = systemInstruction && systemInstruction.trim().length > 0 
      ? systemInstruction 
      : DEFAULT_SYSTEM_INSTRUCTION;

    // Construct the full conversation content
    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
      { role: 'user', parts: [{ text: newMessage }] }
    ];

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: instruction
        }
    });

    let text = response.text || "";
    
    // Check for grounding
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (grounding && grounding.length > 0) {
        text += "\n\n**Sources:**\n";
        grounding.forEach((chunk: any, index: number) => {
             if (chunk.web?.uri) {
                 text += `- [${chunk.web.title || 'Source ' + (index + 1)}](${chunk.web.uri})\n`;
             }
        });
    }

    return text;

  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};

/**
 * Generates an image based on a prompt.
 * Uses 'gemini-2.5-flash-image'.
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    // Iterate parts to find image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Edits an image based on a prompt.
 * Uses 'gemini-2.5-flash-image'.
 */
export const editImage = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    // Strip header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png' // Assuming png for simplicity, or detect from input
            }
          },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image generated.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Enhances a user's prompt using the text model.
 */
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following image generation prompt to be more descriptive, artistic, and detailed. 
      Only return the enhanced prompt text, nothing else.
      
      Original Prompt: ${originalPrompt}`
    });
    return response.text || originalPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return originalPrompt;
  }
};